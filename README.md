# Churn-API

[![Build Status](https://travis-ci.org/TheUnassigned/churn-api.svg?branch=master)](https://travis-ci.org/TheUnassigned/churn-api?branch=master)

This is the backend API for [churn.tv](http://churn.tv). We are all focusing on different startups now, and wanted to slim down churn to focus on the small community of daily users, rather than try and continue growing it massively. So we decided to experiment with newer technologies, and open source the entire startup. It is built with [GraphQL](https://github.com/graphql/graphql-js), [Twobyfour](https://github.com/OpenClubDev/twobyfour), [DynamoDB](https://github.com/aws/aws-sdk-js), and [serverless](https://github.com/serverless/serverless) to run a light scalable serverless backend on AWS lambda.

# Running the API yourself

You will need to setup an AWS account, a youtube developers account and two DynamoDB tables in order to run this project.

## DynamoDB Schema

While we don't explicitly run table/key generation in code, we do inside the test mocks, and the details are as follows:

```
const tableData = [
  {
    TableName : 'churn-channels',
    KeySchema: [
      { AttributeName: 'slug', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'slug', AttributeType: 'S' }
    ]
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
    ]
  }
]
```

## Running locally

`npm run express`

To run this project locally, you need (obviously) to `npm install` first, but then also have the required environment variables set up. These are listed in the environment variables section below. If you felt like running a version with a local database as well, just look inside `mock.js` to see how the local database was setup for testing.

## Running on serverless

`npm run lambda:all`

You will need to setup your appropriate credentials for serverless, and set the profile in the `serverless.yml` file

## Environment variables

```
CHURNAPI_AWS_ID - AWS Id
CHURNAPI_AWS_KEY - AWS key
CHURNAPI_AWS_REGION - AWS region (defaults to 'us-east-1')
CHURNAPI_JWT_SECRET - JWT secret used to decode credentials
CHURNAPI_YOUTUBE_SERVER_KEY - Youtube developer key (for video meta)
CHURNAPI_GRAPHIQL_HEADER - optional header to put tokens in to run Graphiql locally with admin credentials
```

## Auth tokens

There is no specific UI built around generating tokens for admins to create channels, and add videos. In order to do this you will need to generate your own tokens using any of the available online tools.

  - admin tokens - put `{ admin: true }` in the payload
  - single channel admin tokens - put `{ <channel_id>: true }` in the payload

## Frontend

The front end churn react project can be found [here](https://github.com/TheUnassigned/churn)
