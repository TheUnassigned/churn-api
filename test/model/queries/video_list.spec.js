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

describe('Testing video list queries (no permissions necessary)', () => {

  it('should read the video list from the most recent in the channel', () => {
    const videoListQuery = `
      query {
        channel(slug: "test-channel") {
          videos(first: 2) {
            edges {
              video {
                youtube_id
                channel_position
                title
              }
            }
          }
        }
      }
    `

    return graphql(schema, videoListQuery, {}, { DB })
      .then(result => {
        const edges = result.data.channel.videos.edges
        expect(edges).to.have.length.above(1)
        expect(edges[0].video.channel_position).to.be.above(edges[1].video.channel_position);
        expect(edges[0].video).to.have.all.keys(['youtube_id', 'channel_position', 'title'])
      }).should.be.fulfilled
  })

  it('should only read as many as given in first', () => {
    const firstCheckQuery = `
      query {
        channel(slug: "test-channel") {
          videos(first: 1) {
            edges {
              video {
                youtube_id
                channel_position
                title
              }
            }
          }
        }
      }
    `

    return graphql(schema, firstCheckQuery, {}, { DB })
      .then(result => {
        const edges = result.data.channel.videos.edges
        expect(edges).to.have.lengthOf(1)
        expect(edges[0].video).to.have.all.keys(['youtube_id', 'channel_position', 'title'])
      }).should.be.fulfilled
  })

  it('should read the second video in the list only when provided video position key (same as paging)', () => {
    const cursorQuery = `
      query {
        channel(slug: "test-channel") {
          videos(first: 1, cursor: {
            channel_id: "test-channel"
            youtube_id: "aK0yv9ME-h8"
            channel_position: 2
          }) {
            edges {
              video {
                youtube_id
                channel_position
                title
              }
            }
          }
        }
      }
    `

    return graphql(schema, cursorQuery, {}, { DB })
      .then(result => {
        console.log(result)
        const edges = result.data.channel.videos.edges
        expect(edges).to.have.lengthOf(1)
        expect(edges[0].video).to.deep.equal({
          youtube_id: 'gN_PK5pXmIY',
          channel_position: 1,
          title: 'Do The Numbers On Toaster Dials Mean Minutes?'
        })
      }).should.be.fulfilled
  })

  it('should fail for too large "first" range', () => {
    const firstCheckQuery = `
      query {
        channel(slug: "test-channel") {
          videos(first: 21) {
            page_info {
              has_next_page
            }
          }
        }
      }
    `

    return graphql(schema, firstCheckQuery, {}, { DB })
      .then(({ errors }) => {
        if(errors){ return Promise.reject(errors) }
      }).should.be.rejected
  })

})
