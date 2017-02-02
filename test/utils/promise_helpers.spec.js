import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { or } from '/utils/promise_helpers'

chai.use(chaiAsPromised)
chai.should()

describe('Promise helper functions -', () => {
  describe('OR Helper:', () => {

    const resolved = () => Promise.resolve()
    const rejected = () => Promise.reject(new Error('test error'))

    it('should resolve with single resolved promise', () => {
      return or([resolved])().should.be.fulfilled
    })

    it('should reject with single reject promise', () => {
      return or([rejected])().should.be.rejected
    })

    it('should resolve with both a resolve and reject', () => {
      return or([rejected, resolved])().should.be.fulfilled
    })

    it('should reject with all promises rejecting', () => {
      return or([rejected, rejected, rejected])().should.be.rejected
    })

    it('should pass correct multiple arguments with bind', () => {
      return or([(a, b) => {
        a.should.equal(5)
        b.should.equal(10)
        return Promise.resolve()
      }]).bind(5, 10)()
    })

  })
})
