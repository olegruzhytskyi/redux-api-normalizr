export const deepMerge = (...objectsToMerge) => {
  const objects = [...objectsToMerge]

  return objects.reduce((acc, obj) => {
    for (const key in obj) {
      if (acc[key]) {
        for (const deepKey in obj[key]) {
          acc[key][deepKey] = obj[key][deepKey]
        }
      } else {
        acc[key] = obj[key]
      }
    }

    return acc
  }, {})
}

export const deepRemove = (target, query) => {

  const clearedTarget = { ...target }

  for (const key in query) {
    if (clearedTarget[key]) {
      for (const deepKey in query[key]) {
        delete clearedTarget[key][deepKey]
      }
    }
  }

  return clearedTarget
}

export const path = (pathArr = [], obj = {}) => {
  let el = obj
  for (let i = 0; i < pathArr.length; i++) {
    const newElement = el[pathArr[i]]
    if (newElement) {
      el = newElement
    } else {
      return newElement
    }
  }

  return el
}
