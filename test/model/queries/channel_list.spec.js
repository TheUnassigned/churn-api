import mock from '/dynamodb/mock'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import schema from '/model'
import AWS from 'aws-sdk'
import DB from '/dynamodb'
import { graphql } from 'graphql'
import { config } from '/config/environment'

chai.use(chaiAsPromised)
chai.should()

const expect = chai.expect

// wait until the mocks have initialised before running any tests
before(() => mock)

// init the database client
DB.setDoc(new AWS.DynamoDB.DocumentClient({ region: config.AWS_REGION }))

// construct the context object for each call to simulate an admin
const context = {
  DB,
  viewer: { admin: true }
}

describe('Testing channel list scan (no permissions necessary)', () => {

  const mutation = `
    mutation {
      createChannel(slug: "channellistslug", channel: {
        title: "test title"
        external_links: {
          weburl: "http://www.thingo.com"
          facebook: "http://www.facebook.com/yoyoyo"
        }
        blurb: "This channel is a test channel"
        logo_url: "http://logo.com"
      }){
        slug
      }
    }
  `

  // create the initial channel
  before(() => graphql(schema, mutation, {}, context))

  const queryChannelList = `
    query {
      channelList {
        slug
        title
      }
    }
  `

  it('should retrieve more than one channel in the list', () => {
    return graphql(schema, queryChannelList, {}, { DB })
      .then(result => {
        const list = result.data.channelList
        expect(list).to.have.length.above(1)
      }).should.be.fulfilled
  })

})
