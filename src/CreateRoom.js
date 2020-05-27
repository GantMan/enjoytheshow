import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import API from '@aws-amplify/api'
import { createRoom as createRoomMutation } from './graphql/mutations'
import * as slugify from 'slugify'

const initialState = {
  roomName: null,
}

function CreateRoom() {
  const [state, setState] = useState(initialState)
  const history = useHistory()

  function onChangeText(e) {
    const { name, value } = e.target
    setState((currentState) => ({ ...currentState, [name]: value }))
  }

  async function createNewRoom() {
    try {
      const { roomName } = state
      const cleanRoom = slugify(roomName.toLowerCase())
      const roomData = { id: cleanRoom, lastUpdated: Date.now() }

      const createRoom = API.graphql({
        query: createRoomMutation,
        variables: { input: roomData },
      })
      await Promise.all([createRoom])

      const url = `/watch/${cleanRoom}`
      history.push(url)
    } catch (err) {
      console.log('error: ', err)
    }
  }

  const activeState = state.roomName ? '' : 'disabled'
  return (
    <div className="roomBox">
      <div className="titleSection">
        <img src="/masky.svg" alt="mask icon" className="indicator" />
        <h2>Watch a Room</h2>
      </div>

      <div className="form__group field">
        <input
          placeholder="Room Name"
          name="roomName"
          required
          onChange={onChangeText}
          autoComplete="off"
          className="form__field"
        />
        <label htmlFor="roomName" className="form__label">
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
  )
}

export default CreateRoom
