import {expect} from 'chai'

describe('strings', function () {
  it('concatenates', function () {
    expect('foo' + 'bar').to.eql('foobar')
  })
})
