import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  createAudienceMember,
  updateAudienceMember,
  updateRoom,
} from './graphql/mutations'
import API from '@aws-amplify/api'

function Room() {
  const [person, setPerson] = useState()
  let params = useParams()

  async function createPerson() {
    const person = await API.graphql({
      query: createAudienceMember,
      variables: { input: { emotion: 'neutral', roomName: params.id } },
    })

    setPerson(person.data.createAudienceMember.id)
    console.log('HEYYY', person)
  }

  async function setSad() {
    console.log('person', person)
    await API.graphql({
      query: updateAudienceMember,
      variables: { input: { id: person, emotion: 'sad' } },
    })

    API.graphql({
      query: updateRoom,
      variables: {
        input: { id: params.id, lastUpdated: Date.now().toString() },
      },
    })
  }

  async function setHappy() {
    await API.graphql({
      query: updateAudienceMember,
      variables: {
        input: { id: person, emotion: 'happy' },
      },
    })

    API.graphql({
      query: updateRoom,
      variables: {
        input: { id: params.id, lastUpdated: Date.now().toString() },
      },
    })
  }

  return (
    <div>
      <p>I am Room - {params.id}</p>
      <button onClick={createPerson}>Create Person X</button>
      <hr />
      <button onClick={setSad}>Sad</button>
      <button onClick={setHappy}>Happy</button>
    </div>
  )
}

export default Room
