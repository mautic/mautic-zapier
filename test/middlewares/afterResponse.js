const should = require('should')
const afterResponse = require('../../middlewares/afterResponse')
const throwJsonErrors = afterResponse[0]

describe('after response middleware', () => {
  describe('throwJsonErrors', () => {
    it('should handle 403 json error message with status of 200', () => {
      const responseMock = {
        status: 200,
        json: require('../../fixtures/samples/403.js'),
      }
      const expectedMessage = 'Bulk import of contacts is not enabled for Mautic Cloud Free users. To get this feature and several other benefits including support, training, and unlimited email sends contact us about upgrading to Mautic Cloud Pro.Contact us today'
      should(() => throwJsonErrors(responseMock)).throw(expectedMessage)
    })

    it('should handle successful json response with status of 200', () => {
      const responseMock = {
        status: 200,
        json: require('../../fixtures/samples/contact.js'),
      }
      throwJsonErrors(responseMock).should.equal(responseMock)
    })
  })
})
