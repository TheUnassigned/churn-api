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

describe('Testing channel updating', () => {

  // setup the initial channel for updating
  const mutation = `
    mutation {
      createChannel(slug: "updater", channel: {
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
      }
    }
  `

  before(() => graphql(schema, mutation, {}, context))

  const updateMutation = `
    mutation {
      updateChannel(slug: "updater", channel: {
        title: "updated title"
        blurb: "This channel is a test channel"
        logo_url: "http://logo.com"
        external_links: {
          weburl: "http://alt.com"
          twitter: "http://www.twitter.com/test"
        }
      }){
        slug
        title
        external_links {
          twitter
          weburl
        }
      }
    }
  `

  it('should update top level and child keys, including adding a child key', () => {
    return graphql(schema, updateMutation, {}, context)
      .then(result => {
        const channel = result.data.updateChannel
        expect(channel).to.deep.equal({
          slug: 'updater',
          title: 'updated title',
          external_links: {
            weburl: 'http://alt.com',
            twitter: 'http://www.twitter.com/test'
          }
        })
      }).should.be.fulfilled
  })

  it('should fail for non existent slug', () => {
    const nonExistent = `
      mutation {
        updateChannel(slug: "shouldnotexist", channel: {
          title: "updated title"
          blurb: "nope"
          logo_url: "nah"
        }){
          slug
        }
      }
    `

    return graphql(schema, nonExistent, {}, context)
      .then(result => {
        expect(result.errors).to.have.length.above(0)
      })
  })

  it('should reject update without key', () => {
    return graphql(schema, updateMutation, {}, {})
      .then(result => {
        expect(result.errors).to.have.length.above(0)
      })
  })

  it('should update successfully with matching channel slug in payload', () => {
    return graphql(schema, updateMutation, {}, {
      DB,
      viewer: {
        updater: true
      }
    }).then(result => {
      expect(result.error).to.be.undefined
    })
  })
})
