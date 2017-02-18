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

describe('Testing channel creation', () => {

  // channel creation mutation
  const mutation = `
    mutation {
      createChannel(slug: "testslug", channel: {
        title: "test title"
        external_links: {
          weburl: "http://www.thingo.com"
          facebook: "http://www.facebook.com/yoyoyo"
        }
        blurb: "This channel is a test channel"
        logo_url: "http://logo.com"
      }){
        slug
        title
        external_links {
          weburl
          instagram
        }
        total_videos
      }
    }
  `

  it('should successfully create a channel', () => {
    return graphql(schema, mutation, {}, context)
      .then(result => {
        const channel = result.data.createChannel
        expect(channel).to.deep.equal({
          slug: 'testslug',
          title: 'test title',
          external_links: {
            weburl: 'http://www.thingo.com',
            instagram: null
          },
          total_videos: 0
        })
      }).should.be.fulfilled
  })

  it('should not be able to create using existing slug', () => {
    return graphql(schema, mutation, {}, context)
      .then(({ errors }) => {
        if(errors){ return Promise.reject(errors) }
      }).should.be.rejected
  })

  it('should fail creation if not using an admin token', () => {
    return graphql(schema, mutation, {}, { DB, viewer: {} })
      .then(({ errors }) => {
        if(errors){ return Promise.reject(errors) }
      }).should.be.rejected
  })

})
