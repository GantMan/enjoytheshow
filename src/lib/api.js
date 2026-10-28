import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/api'
import config from '../aws-exports'

Amplify.configure({
  API: {
    GraphQL: {
      endpoint: config.aws_appsync_graphqlEndpoint,
      region: config.aws_appsync_region,
      defaultAuthMode: 'apiKey',
      apiKey: config.aws_appsync_apiKey,
    },
  },
})

const client = generateClient()

export const graphql = (query, variables) => client.graphql({ query, variables })
