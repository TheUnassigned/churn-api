import AWS from 'aws-sdk'
import localDynamo from 'local-dynamo'
import { promiseChain } from 'twobyfour/lib/utils'
import DB from '/dynamodb'
import { config } from '/config/environment'

localDynamo.launch(null, 4567)

AWS.config.update({
  region: config.AWS_REGION,
  accessKeyId: 'dummy',
  secretAccessKey: 'dummy',
  endpoint: 'http://localhost:4567'
})

const dynamodb = new AWS.DynamoDB()
// init the database client
DB.setDoc(new AWS.DynamoDB.DocumentClient({ region: config.AWS_REGION }))

const tableData = [
  {
    TableName : 'churn-channels',
    KeySchema: [
      { AttributeName: 'slug', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'slug', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  },
  {
    TableName : 'churn-videos',
    KeySchema: [
      { AttributeName: 'channel_id', KeyType: 'HASH' },
      { AttributeName: 'youtube_id', KeyType: 'RANGE' }
    ],
    LocalSecondaryIndexes: [
      {
        IndexName: 'videoPositionIndex',
        KeySchema: [
          { AttributeName: 'channel_id', KeyType: 'HASH' },
          { AttributeName: 'channel_position', KeyType: 'RANGE' }
        ],
        Projection: {
          ProjectionType: 'ALL'
        }
      }
    ],
    AttributeDefinitions: [
      { AttributeName: 'channel_id', AttributeType: 'S' },
      { AttributeName: 'channel_position', AttributeType: 'N' },
      { AttributeName: 'youtube_id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  }
]

const videoData = [
  {
    url: 'https://www.youtube.com/watch?v=gN_PK5pXmIY',
    channel_id: 'test-channel',
    channel_position: 1,
    youtube_id: 'gN_PK5pXmIY',
    time_added: 1486988537674,
    title: 'Do The Numbers On Toaster Dials Mean Minutes?',
    duration: 132
  },
  {
    url: 'https://www.youtube.com/watch?v=aK0yv9ME-h8',
    channel_id: 'test-channel',
    channel_position: 2,
    youtube_id: 'aK0yv9ME-h8',
    time_added: 1486989537674,
    title: 'Moondog - Moondog (1969) [Full Album]',
    duration: 1822
  }
]

const channelData = [
  {
    slug: 'test-channel',
    title: 'The Main Test Channel',
    blurb: 'First channel used for testing',
    logo_url: 'https://www.wired.com/wp-content/uploads/2014/10/cat-ft.jpg',
    external_links: {
      url: 'http://somesite.com',
      facebook: 'http://facebook.com/tester',
      twitter: 'http://twitter.com/someuser',
      instagram: 'http://www.instagram.com/person'
    },
    total_videos: 2,
    recent_videos: videoData
  }
]

const deleteTable = table => new Promise((resolve, reject) => {
  //console.log('deleting table:', table)
  dynamodb.deleteTable({
    TableName: table
  }, (err, data) => err ? reject(err) : resolve(data))
})

const getTables = () => new Promise((resolve, reject) => {
  //console.log('getting table list')
  dynamodb.listTables({}, (err, data) => err ? reject(err) : resolve(data))
})

const createTable = params => new Promise((resolve, reject) => {
  //console.log('creating table:', params.TableName)
  dynamodb.createTable(params, (err, data) => err ? reject(err) : resolve(data))
})

const waitTable = ({ TableName }) => new Promise((resolve, reject) => {
  //console.log('waiting for table to be ready:', TableName)
  dynamodb.waitFor('tableExists', {
    TableName
  }, (err, data) => err ? reject(err) : resolve(data))
})

// remove/re-add/clear all tables
export default getTables()
  .then(({ TableNames }) => promiseChain(TableNames, deleteTable))
  .then(() => promiseChain(tableData, createTable))
  .then(() => promiseChain(tableData, waitTable))
  // mock the channel data
  .then(() => promiseChain(channelData, channel => {
    return DB.putResource({
      TableName: 'churn-channels',
      Item: channel
    })
  }))
  // mock the video data
  .then(() => promiseChain(videoData, video => {
    return DB.putResource({
      TableName: 'churn-videos',
      Item: video
    })
  }))
