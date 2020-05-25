import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import * as slugify from "slugify";

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
      const cleanRoom = slugify(roomName.toLowerCase());
      const url = `/room/${cleanRoom}`;
      history.push(url);
    } catch (err) {
      console.log("error: ", err);
    }
  }

  const activeState = state.roomName ? "" : "disabled";

  return (
    <div className="roomBox">
      <div className="titleSection">
        <img src="/stagey.svg" alt="stage icon" className="indicator" />
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
        />
        <label for="roomName" class="form__label">
          Room Name
        </label>
      </div>
      <div>
        <button
          disabled={!state.roomName}
          className={activeState}
          onClick={createNewRoom}
        >
          GO
        </button>
      </div>
    </div>
  );
}

export default CreateRoom;
