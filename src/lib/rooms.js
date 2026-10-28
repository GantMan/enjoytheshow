import { graphql } from './api'
import { createRoom, updateRoom } from '../graphql/mutations'

// Bumping a room's timestamp fires the subscription the watch page listens to
export async function touchRoom(id) {
  const input = { id, lastUpdated: Date.now().toString() }
  try {
    await graphql(updateRoom, { input })
  } catch (e) {
    if (e?.errors?.[0]?.errorType !== 'DynamoDB:ConditionalCheckFailedException') throw e
    await graphql(createRoom, { input }).catch(() => {})
  }
}
