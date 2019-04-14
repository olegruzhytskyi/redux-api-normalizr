import { deepMerge, deepRemove } from './helpers'

const initialState = {}

export default (state = initialState, action) => {
  const { payload, type } = action
  switch (type) {
    case 'REDUX_API_NORMALIZR_SET':
      return deepMerge(state, payload)

    case 'REDUX_API_NORMALIZR_DESTROY':
      return deepRemove(state, payload)

    default:
      return state
  }
}
