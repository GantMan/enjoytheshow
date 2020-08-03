/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onUpdateById = /* GraphQL */ `
  subscription OnUpdateById($id: ID!) {
    onUpdateById(id: $id) {
      id
      emotion
      roomName
      updatedAt
      createdAt
    }
  }
`;
export const onUpdateByRoomId = /* GraphQL */ `
  subscription OnUpdateByRoomId($id: ID!) {
    onUpdateByRoomId(id: $id) {
      id
      lastUpdated
      createdAt
      updatedAt
    }
  }
`;
export const onCreateAudienceMember = /* GraphQL */ `
  subscription OnCreateAudienceMember {
    onCreateAudienceMember {
      id
      emotion
      roomName
      updatedAt
      createdAt
    }
  }
`;
export const onUpdateAudienceMember = /* GraphQL */ `
  subscription OnUpdateAudienceMember {
    onUpdateAudienceMember {
      id
      emotion
      roomName
      updatedAt
      createdAt
    }
  }
`;
export const onDeleteAudienceMember = /* GraphQL */ `
  subscription OnDeleteAudienceMember {
    onDeleteAudienceMember {
      id
      emotion
      roomName
      updatedAt
      createdAt
    }
  }
`;
export const onCreateRoom = /* GraphQL */ `
  subscription OnCreateRoom {
    onCreateRoom {
      id
      lastUpdated
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateRoom = /* GraphQL */ `
  subscription OnUpdateRoom {
    onUpdateRoom {
      id
      lastUpdated
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteRoom = /* GraphQL */ `
  subscription OnDeleteRoom {
    onDeleteRoom {
      id
      lastUpdated
      createdAt
      updatedAt
    }
  }
`;
