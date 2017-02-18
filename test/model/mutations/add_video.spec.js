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

describe('Testing video additions', () => {

  // channel creation mutation
  const mutation = `
    mutation {
      createChannel(slug: "addvideoslug", channel: {
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

  // create the initial channel
  before(() => graphql(schema, mutation, {}, context))

  const videoAddA = `
    mutation {
      addVideo(channel_slug: "addvideoslug", video_url: "https://www.youtube.com/watch?v=GDSqMG0rbKI"){
        channel_id
        channel_position
        youtube_id
        title
        duration
      }
    }
  `

  it('should be able to add video to channel and update channel', () => {
    return graphql(schema, videoAddA, {}, context)
      .then(result => {
        const video = result.data.addVideo
        expect(video).to.deep.equal({
          channel_id: 'addvideoslug',
          channel_position: 1,
          youtube_id: 'GDSqMG0rbKI',
          title: 'Valentines Day In Australia',
          duration: 119
        })
      }).should.be.fulfilled
  })

  it('should be able to add a second video and update position correctly', () => {
    return graphql(schema, videoAddA, {}, context)
      .then(result => {
        const video = result.data.addVideo
        expect(video).to.deep.equal({
          channel_id: 'addvideoslug',
          channel_position: 2,
          youtube_id: 'GDSqMG0rbKI',
          title: 'Valentines Day In Australia',
          duration: 119
        })
      }).should.be.fulfilled
  })

  it('should not allow adding to a channel that does not exist', () => {
    const videoAddNonExist = `
      mutation {
        addVideo(channel_slug: "addvideoslugNotexist", video_url: "https://www.youtube.com/watch?v=GDSqMG0rbKI"){
          channel_id
        }
      }
    `

    return graphql(schema, videoAddNonExist, {}, context)
      .then(({ errors }) => {
        if(errors){ return Promise.reject(errors) }
      }).should.be.rejected
  })

  it('should not allow adding to a channel if not a channel admin', () => {
    return graphql(schema, videoAddA, {}, {})
      .then(({ errors }) => {
        if(errors){ return Promise.reject(errors) }
      }).should.be.rejected
  })

})
