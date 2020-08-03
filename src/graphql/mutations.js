/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAudienceMember = /* GraphQL */ `
  mutation CreateAudienceMember(
    $input: CreateAudienceMemberInput!
    $condition: ModelAudienceMemberConditionInput
  ) {
    createAudienceMember(input: $input, condition: $condition) {
      id
      emotion
      roomName
      updatedAt
      createdAt
    }
  }
`;
export const updateAudienceMember = /* GraphQL */ `
  mutation UpdateAudienceMember(
    $input: UpdateAudienceMemberInput!
    $condition: ModelAudienceMemberConditionInput
  ) {
    updateAudienceMember(input: $input, condition: $condition) {
      id
      emotion
      roomName
      updatedAt
      createdAt
    }
  }
`;
export const deleteAudienceMember = /* GraphQL */ `
  mutation DeleteAudienceMember(
    $input: DeleteAudienceMemberInput!
    $condition: ModelAudienceMemberConditionInput
  ) {
    deleteAudienceMember(input: $input, condition: $condition) {
      id
      emotion
      roomName
      updatedAt
      createdAt
    }
  }
`;
export const createRoom = /* GraphQL */ `
  mutation CreateRoom(
    $input: CreateRoomInput!
    $condition: ModelRoomConditionInput
  ) {
    createRoom(input: $input, condition: $condition) {
      id
      lastUpdated
      createdAt
      updatedAt
    }
  }
`;
export const updateRoom = /* GraphQL */ `
  mutation UpdateRoom(
    $input: UpdateRoomInput!
    $condition: ModelRoomConditionInput
  ) {
    updateRoom(input: $input, condition: $condition) {
      id
      lastUpdated
      createdAt
      updatedAt
    }
  }
`;
export const deleteRoom = /* GraphQL */ `
  mutation DeleteRoom(
    $input: DeleteRoomInput!
    $condition: ModelRoomConditionInput
  ) {
    deleteRoom(input: $input, condition: $condition) {
      id
      lastUpdated
      createdAt
      updatedAt
    }
  }
`;
