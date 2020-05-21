/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAudienceMember = /* GraphQL */ `
  query GetAudienceMember($id: ID!) {
    getAudienceMember(id: $id) {
      id
      emotion
      roomName
    }
  }
`;
export const listAudienceMembers = /* GraphQL */ `
  query ListAudienceMembers(
    $filter: ModelAudienceMemberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAudienceMembers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        emotion
        roomName
      }
      nextToken
    }
  }
`;
export const getRoom = /* GraphQL */ `
  query GetRoom($id: ID!) {
    getRoom(id: $id) {
      id
      lastUpdated
    }
  }
`;
export const listRooms = /* GraphQL */ `
  query ListRooms(
    $filter: ModelRoomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        lastUpdated
      }
      nextToken
    }
  }
`;
export const itemsByRoomName = /* GraphQL */ `
  query ItemsByRoomName(
    $roomName: String
    $sortDirection: ModelSortDirection
    $filter: ModelAudienceMemberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    itemsByRoomName(
      roomName: $roomName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        emotion
        roomName
      }
      nextToken
    }
  }
`;
