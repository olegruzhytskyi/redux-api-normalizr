import fetch from './fetch'
import { deepMerge } from './helpers'

const selfInvoke = (v) => v

export default class Api {
  constructor ({
    baseUrl = '',
    onResolve = selfInvoke,
    onReject = selfInvoke,
    options = {},
  }) {
    this.onResolve = onResolve
    this.onReject = onReject
    this.endpoints = {}
    this.baseUrl = baseUrl
    this.options = options
  }

  add ({ key, path = '', options = {} }) {
    this.endpoints[key] = {
      path,
      options: deepMerge(this.options, options),
    }
  }

  findEndpointByKey (key) {
    return this.endpoints[key]
  }

  call ({ key, data, setOptions = selfInvoke }) {
    const endpoint = this.findEndpointByKey(key)

    if (!endpoint) return Promise.reject()

    const options = setOptions(endpoint.options)
    const isGetMethod = !options.method || options.method.toLowerCase() === 'get'

    const { url, otherParams } = this.getUrlAndParams(endpoint.path, data, isGetMethod)

    const request = fetch({
      url: this.baseUrl + url,
      options,
      data: otherParams,
    })
      .then(this.onResolve)
      .catch(this.onReject)

    request.reduxApiNormalizrActionType = !(options.method && options.method.toLowerCase()) === 'delete'
      ? 'DESTROY'
      : 'SET'

    request.reduxApiNormalizrActionKey = key

    return request
  }

  getUrlAndParams (path = '', params = {}, addOtherParamsToQuery = false) {
    const queryArr = []
    let otherParams = null
    let url = Object.keys(params).reduce((url, key) => {
      const placeholder = `:${key}`

      if (url.includes(placeholder)) {
        url.replace(placeholder, encodeURIComponent(params[key]))
      } else if (addOtherParamsToQuery) {
        queryArr.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      } else {
        if (!otherParams) {
          otherParams = {}
        }
        otherParams[key] = params[key]
      }

      return url
    }, path)

    if (addOtherParamsToQuery && queryArr.length) {
      url += `?${queryArr.join('&')}`
    }

    return {
      url,
      otherParams
    }

  }
}
