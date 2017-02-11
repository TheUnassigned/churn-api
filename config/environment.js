
const env = process.env

const config = {
  AWS_ID: env.CHURNAPI_AWS_ID,
  AWS_KEY: env.CHURNAPI_AWS_KEY,
  AWS_REGION: env.CHURNAPI_AWS_REGION || 'us-east-1',
  JWT_SECRET: env.CHURNAPI_JWT_SECRET
}

if(env.CHURNAPI_GRAPHIQL_HEADER){
  config.GRAPHIQL_HEADER = env.CHURNAPI_GRAPHIQL_HEADER
}

export {
  config
}
