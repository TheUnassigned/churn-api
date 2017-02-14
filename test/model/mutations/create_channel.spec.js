import AWS from 'aws-sdk'
import DB from '/dynamodb'
import { config } from '/config/environment'
import mock from '/dynamodb/mock'
import channelType from '/model/types/channel'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
chai.should()

// init the database client
DB.setDoc(new AWS.DynamoDB.DocumentClient({ region: config.AWS_REGION }))

// wait until the mocks have initialised before running any tests
beforeEach(() => {
  return mock
})

describe('Test channel creation', () => {

  it('should successfully create a channel', () => {
    const item = {
      slug: 'create_test',
      title: 'create test title'
    }
    // create and read the created item
    return DB.putResource({
      TableName: channelType.table,
      Item: item
    }).then(() => DB.getResource({
      TableName: channelType.table,
      Key: { slug: item.slug }
    })).then(result => result.should.deep.equal(item)).should.be.fulfilled
  })

  it('should not be able to create using existing slug', () => {
    throw new Error('incomplete test')
  })

  it('should fail creation if not using an admin token', () => {
    throw new Error('incomplete test')
  })
})
