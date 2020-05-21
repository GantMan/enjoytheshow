import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';

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

  function createNewRoom() {
    try {
      const { roomName } = state
      //const pollId = slugify(pollName)

      //const pollData = { id: pollId, itemType: "Poll", type: pollType, name: pollName }
      const roomData = { id: roomName, lastUpdated: Date.now()}

      // const createPollPromise = API.graphql({ query: createPollMutation, variables: { input: pollData } })
      const createRoom = API.graphql({ query: createNewRoom, variables: { input: roomData }})
      await Promise.all([createRoom])

      const url = `/poll/${pollId}`
      history.push(url)
    } catch(err) {
      console.log('error: ', err)
    }
  }

  return (
    <div>
      <p>What is the name of the room?</p>
      <input
        placeholder="Room Name"
        name="roomName"
        onChange={onChangeText}
        autoComplete="off"
      />
      <div>
        <button onClick={createNewRoom}>Create Room</button>
      </div>
    </div>
  )
}

export default CreateRoom
