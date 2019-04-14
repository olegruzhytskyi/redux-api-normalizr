# redux-api-normalizr

Short plugin for JSON API interaction with Redux



# Api integration

## Options

| Name | type |
| --- | --- |
| baseUrl | String |
| onResolve | function |
| onReject | function |
| options | Object | [fetch options](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)


```JavaScript
const api = new Api({
  baseUrl: 'http://localhost:3000',
  onResolve: (res) => {
    console.log(res)
    return res
  },
  onReject: (res) => {
    console.error(res)
    return res
  },
})
```

## Methods

### add()

| Name | type | description |
| --- | --- | --- |
| key | String | string for request identification |
| path | String | parameterized url string |
| options | Object | [fetch options](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

```JavaScript
api.add({
  key: 'updatePost',
  path: '/posts/:post_id',
  options: {
    method: 'PUT',
  },
})
```

### call()

| Name | type | description |
| --- | --- | --- |
| key | String | string for request identification |
| data | Object | params to send |
| setOptions | function | function for merge [fetch options](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) |

```JavaScript
api.call({
  key: 'updatePost',
  data: { post_id: 1 },
  setOptions: (options) => {
    ...options,
    credentials: 'same-origin',
  }
})
```


### Example

```JavaScript
const api = new Api({
  baseUrl: 'http://localhost:3000',
  onResolve: (res) => {
    console.log(res)
    return res
  },
  onReject: (res) => {
    console.error(res)
    return res
  },
})

api.add({
  key: 'fake',
  path: '/fake.json'
})

api.call({
  key: 'fake'
})
```

### React integration

```JavaScript
import React from 'react'
import api from './api'

export default class extends React.Component {
  state = {
    data: null
  }

  componentDidMount () {
    api.call({
      key: 'fake'
    }).then(data => {
      this.setState({ data })
    })
  }

  render () {
    return '...'
  }
}
```

### React & Redux integration

```JavaScript
import {
  createStore,
  applyMiddleware,
  combineReducers,
} from 'redux';

import { reducer, middleware } from 'redux-api-normalizr';

const reducers = combineReducers({
  // other reducers
  api: reducer,
});

const store = createStore(
  reducers,
  applyMiddleware(middleware)
);
```

```JavaScript
import React from 'react'
import { connect } from 'react-redux'
import api from './api'

@connect(state => ({
  post: resourceSelector(state, 'posts', 'id123')
  meta: responseDataSelector(state, 'getPost', 'meta')
}))
export default class extends React.Component {
  componentDidMount () {
    const { dispatch } = this.props
    dispatch(api.call({
      key: 'getPost',
      data: { post_id: 'id123' },
    }))
  }

  render () {
    return '...'
  }
}
```

