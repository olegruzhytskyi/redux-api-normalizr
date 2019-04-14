import fetch from 'isomorphic-fetch'

export default ({
  url,
  options: { headers = {}, ...options },
  data,
}) => {
  const isFormData = data && data.constructor === FormData
  const jsonApiHeaders = {
    ...isFormData ? { 'content-type': 'application/vnd.api+json' } : null,
    'accept': 'application/vnd.api+json',
  }

  return fetch(url, {
    headers: {
      ...jsonApiHeaders,
      ...headers,
    },
    ...data && { body: isFormData ? data : JSON.stringify(data) },
    ...options,
  })
    .then(formatResponse)
    .then(handleResponse)
}

const formatResponse = (res) => {
  const { status, headers } = res
  const response = {
    status,
    headers,
  }

  if (status !== 204) {
    return res.json().then(body => ({ ...response, body }))
  }

  return Promise.resolve(response)
}

const handleResponse = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  }

  return Promise.reject(response)
}
