const assert = (err) => {
  require('assert').equal(err, null)
}

const getQueryObj = (urlObj) => {
  const result = {}
  const queryString = urlObj.query
  if (typeof queryString === 'string') {
    const searchArr = queryString.split('&')
    searchArr.forEach((i) => {
      var pair = i.split('=')
      result[pair[0]] = pair[1]
    })
  }
  return result
}

module.exports = {
  assert,
  getQueryObj,
}
