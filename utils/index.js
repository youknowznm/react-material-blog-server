const assertNoError = (err) => {
  require('assert').equal(err, null)
}

module.exports = {
  assertNoError,
}
