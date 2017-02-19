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

describe('Testing video queries (no permissions necessary)', () => {

  it('should retrieve correct channel position and video object', () => {
    const videoQuery = `
      query {
        video(channel_id: "test-channel", video_id: "aK0yv9ME-h8"){
          title,
          channel_position
        }
      }
    `
    return graphql(schema, videoQuery, {}, { DB })
      .then(result => {
        const video = result.data.video
        expect(video).to.deep.equal({
          title: 'Moondog - Moondog (1969) [Full Album]',
          channel_position: 2
        })
      }).should.be.fulfilled
  })

  it('should fail for incorrect video id', () => {
    const badVideoQuery = `
      query {
        video(channel_id: "test-channelsd", video_id: "aK0yv9ME-h8sd"){
          title,
          channel_position
        }
      }
    `

    return graphql(schema, badVideoQuery, {}, { DB })
      .then(({ errors }) => {
        if(errors){ return Promise.reject(errors) }
      }).should.be.rejected
  })

})
