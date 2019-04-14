import { path } from './helpers'

export const resourceSelector = (state, ...pathParams) => {
  return path(['api', ...pathParams], state)
}

export const responseDataSelector = (state, ...pathParams) => {
  return path(['api', 'responseData', ...pathParams], state)
}
