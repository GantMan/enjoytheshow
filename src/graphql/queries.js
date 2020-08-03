/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAudienceMember = /* GraphQL */ `
  query GetAudienceMember($id: ID!) {
    getAudienceMember(id: $id) {
      id
      emotion
      roomName
      updatedAt
      createdAt
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
        updatedAt
        createdAt
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
      createdAt
      updatedAt
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
        createdAt
        updatedAt
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
        updatedAt
        createdAt
      }
      nextToken
    }
  }
`;
