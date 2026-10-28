import Cookies from 'js-cookie'
import { graphql } from './api'
import { createAudienceMember, updateAudienceMember } from '../graphql/mutations'

const COOKIE = 'audience_id'
const HOMEROOM = 'homeroombase'

let pending

// Only audience members that actually join a room get a record
export function ensureAudienceMember() {
  const existing = Cookies.get(COOKIE)
  if (existing) return Promise.resolve(existing)
  pending ??= graphql(createAudienceMember, {
    input: { emotion: 'unknown', roomName: HOMEROOM },
  }).then((result) => {
    const id = result.data.createAudienceMember.id
    Cookies.set(COOKIE, id, { expires: 365, sameSite: 'Lax' })
    return id
  })
  return pending
}

export function leaveRoom() {
  const id = Cookies.get(COOKIE)
  if (!id) return
  graphql(updateAudienceMember, {
    input: { id, emotion: 'unknown', roomName: HOMEROOM },
  }).catch(() => {})
}
