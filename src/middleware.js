import FlatJsonApiNormalizr from 'flat-jsonapi-normalizr'

const jsonApiNormalizr = new FlatJsonApiNormalizr()

export default store => next => action => {
  if (typeof action.then !== 'function') {
    return next(action)
  }

  if (action.reduxApiNormalizrActionType && action.reduxApiNormalizrActionKey) {
    return Promise.resolve(action)
      .then(res => {
        let serializedData = {}

        if (res.body) {
          serializedData = jsonApiNormalizr.normalize(res.body)
          const { jsonapi, links, errors, meta, ...data } = serializedData
          next({
            type: `REDUX_API_NORMALIZR_${action.reduxApiNormalizrActionType}`,
            payload: {
              responseData: {
                [`${action.reduxApiNormalizrActionKey}`]: {
                  jsonapi,
                  links,
                  errors,
                  meta,
                },
              },
              ...data,
            }
          })
        }

        return Promise.resolve(serializedData)
      }).catch(err => {
        console.error(err) // eslint-disable-line no-console
        return Promise.reject({})
      })
  }

  return Promise.resolve(action).then(store.dispatch)
}
