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

  const videoAddA = youtubeId => `
    mutation {
      addVideo(channel_slug: "addvideoslug", video_url: "https://www.youtube.com/watch?v=${youtubeId}GDSqMG0rbKI"){
        channel_id
        channel_position
        youtube_id
        title
        duration
      }
    }
  `

  const sampleVideos = [
    { id: 'GDSqMG0rbKI', title: 'Valentines Day In Australia', duration: 119 },
    { id: '8CxODDXpkcg', title: 'The Kid in Dubai with $1,000,000 in Shoes ...', duration: 771 },
    { id: '3awG5wEE7LU', title: 'American Gods | Official Trailer | STARZ', duration: 83 },
    { id: 'TFzy1l_WoAs', title: 'A Rabbi, a Priest and an Atheist Smoke Weed Together', duration: 485 },
    { id: 'V-Cb9x70gYQ', title: 'Amtrak Snow-mo Collision', duration: 43 },
    { id: 'QZ3JYLriWaE', title: 'VOICE FROM THE STONE - Official Trailer', duration: 152 },
  ]

  it('should be able to add video to channel and update channel', () => {
    const vid = sampleVideos[0]
    return graphql(schema, videoAddA(vid.id), {}, context)
      .then(result => {
        const video = result.data.addVideo
        expect(video).to.deep.equal({
          channel_id: 'addvideoslug',
          channel_position: 1,
          youtube_id: vid.id,
          title: vid.title,
          duration: vid.duration
        })
      }).should.be.fulfilled
  })

  it('should be able to add a second video and update position correctly', () => {
    const vid = sampleVideos[1]
    return graphql(schema, videoAddA(vid.id), {}, context)
      .then(result => {
        const video = result.data.addVideo
        expect(video).to.deep.equal({
          channel_id: 'addvideoslug',
          channel_position: 2,
          youtube_id: vid.id,
          title: vid.title,
          duration: vid.duration
        })
      }).should.be.fulfilled
  })

  it('should be able to add more videos than those in the recent list (removal should work)', () => {
    const last = sampleVideos[5]
    return graphql(schema, videoAddA(sampleVideos[2].id), {}, context)
      .then(() => graphql(schema, videoAddA(sampleVideos[3].id), {}, context))
      .then(() => graphql(schema, videoAddA(sampleVideos[4].id), {}, context))
      .then(() => graphql(schema, videoAddA(last.id), {}, context))
      .then(result => {
        const video = result.data.addVideo
        expect(video).to.deep.equal({
          channel_id: 'addvideoslug',
          channel_position: 6,
          youtube_id: last.id,
          title: last.title,
          duration: last.duration
        })
      }).should.be.fulfilled
  })

  const readChannelRecent = `
    query {
      channel(slug: "addvideoslug"){
        slug
        title
        recent_videos {
          youtube_id
        }
      }
    }
  `

  it('should only now read 5 videos in the recent list (even though more have been added)', () => {
    return graphql(schema, readChannelRecent, {}, context)
      .then(result => {
        const channel = result.data.channel
        expect(channel).to.deep.equal({
          slug: 'addvideoslug',
          title: 'test title',
          recent_videos: [
            { youtube_id: sampleVideos[5].id },
            { youtube_id: sampleVideos[4].id },
            { youtube_id: sampleVideos[3].id },
            { youtube_id: sampleVideos[2].id },
            { youtube_id: sampleVideos[1].id },
          ]
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
