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

describe('Testing channel queries (no permissions necessary)', () => {

  const mutation = `
    mutation {
      createChannel(slug: "channelqueryslug", channel: {
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

  const queryChannel = slug => `
    query {
      channel(slug: "${slug}"){
        slug
        title
        external_links {
          weburl
          facebook
        }
        blurb
        logo_url
        total_videos
      }
    }
  `

  it('should load a channel correctly', () => {
    return graphql(schema, queryChannel('channelqueryslug'), {}, { DB })
      .then(result => {
        const channel = result.data.channel
        expect(channel).to.deep.equal({
          slug: 'channelqueryslug',
          title: 'test title',
          external_links: {
            weburl: 'http://www.thingo.com',
            facebook: 'http://www.facebook.com/yoyoyo'
          },
          blurb: 'This channel is a test channel',
          logo_url: 'http://logo.com',
          total_videos: 0
        })
      }).should.be.fulfilled
  })

  it('should return null for missing channel', () => {
    return graphql(schema, queryChannel('notexisting'), {}, { DB })
      .then(({ errors }) => {
        if(errors){ return Promise.reject(errors) }
      }).should.be.rejected
  })

})
