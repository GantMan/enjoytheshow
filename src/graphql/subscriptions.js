/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onUpdateById = /* GraphQL */ `
  subscription OnUpdateById($id: ID!) {
    onUpdateById(id: $id) {
      id
      emotion
      roomName
    }
  }
`;
export const onUpdateByRoomId = /* GraphQL */ `
  subscription OnUpdateByRoomId($id: ID!) {
    onUpdateByRoomId(id: $id) {
      id
      lastUpdated
    }
  }
`;
export const onCreateAudienceMember = /* GraphQL */ `
  subscription OnCreateAudienceMember {
    onCreateAudienceMember {
      id
      emotion
      roomName
    }
  }
`;
export const onUpdateAudienceMember = /* GraphQL */ `
  subscription OnUpdateAudienceMember {
    onUpdateAudienceMember {
      id
      emotion
      roomName
    }
  }
`;
export const onDeleteAudienceMember = /* GraphQL */ `
  subscription OnDeleteAudienceMember {
    onDeleteAudienceMember {
      id
      emotion
      roomName
    }
  }
`;
export const onCreateRoom = /* GraphQL */ `
  subscription OnCreateRoom {
    onCreateRoom {
      id
      lastUpdated
    }
  }
`;
export const onUpdateRoom = /* GraphQL */ `
  subscription OnUpdateRoom {
    onUpdateRoom {
      id
      lastUpdated
    }
  }
`;
export const onDeleteRoom = /* GraphQL */ `
  subscription OnDeleteRoom {
    onDeleteRoom {
      id
      lastUpdated
    }
  }
`;
