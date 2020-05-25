import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import API from "@aws-amplify/api";
import { createRoom as createRoomMutation } from "./graphql/mutations";

const initialState = {
  roomName: null,
};

function CreateRoom() {
  const [state, setState] = useState(initialState);
  const history = useHistory();

  function onChangeText(e) {
    const { name, value } = e.target;
    setState((currentState) => ({ ...currentState, [name]: value }));
  }

  async function createNewRoom() {
    try {
      const { roomName } = state;

      const roomData = { id: roomName, lastUpdated: Date.now() };

      const createRoom = API.graphql({
        query: createRoomMutation,
        variables: { input: roomData },
      });
      await Promise.all([createRoom]);

      const url = `/room/${roomName}`;
      history.push(url);
    } catch (err) {
      console.log("error: ", err);
    }
  }

  return (
    <div className="createRoom">
      <div className="titleSection">
        <img src="/stage.svg" />
        <h2>Join a Room</h2>
      </div>

      <div class="form__group field">
        <input
          placeholder="Room Name"
          name="roomName"
          required
          onChange={onChangeText}
          autoComplete="off"
          class="form__field"
          placeholder="Room Name"
        />
        <label for="roomName" class="form__label">
          Room Name
        </label>
      </div>
      <div>
        <button onClick={createNewRoom}>GO</button>
      </div>
    </div>
  );
}

export default CreateRoom;
