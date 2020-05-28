import React, { useReducer, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import API from '@aws-amplify/api'
import { onUpdateByRoomId } from './graphql/subscriptions'
import { itemsByRoomName } from './graphql/queries'

const initialState = {
  loading: true,
  roomEmotions: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROOM_EMOTIONS':
      return {
        ...state,
        roomEmotions: action.roomEmotions,
        loading: false,
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.loading,
      }
    default:
      return state
  }
}

function WatchRoom() {
  let params = useParams()
  const [state, dispatch] = useReducer(reducer, initialState)
  let subscription

  useEffect(() => {
    fetchRoomEmotions()
    subscribe()
    return () => {
      subscription && subscription.unsubscribe()
    }
  }, [])

  async function fetchRoomEmotions() {
    let {
      data: {
        itemsByRoomName: { items: roomItems },
      },
    } = await API.graphql({
      query: itemsByRoomName,
      variables: { roomName: params.id },
    })
    // console.log("roomItems", roomItems);
    dispatch({ type: 'SET_ROOM_EMOTIONS', roomEmotions: roomItems })
  }

  function subscribe() {
    subscription = API.graphql({
      query: onUpdateByRoomId,
      variables: { id: params.id },
    }).subscribe({
      next: (apiData) => {
        fetchRoomEmotions()
      },
    })
  }

  return (
    <div>
      <p>I watch Room - {params.id}</p>
      <p>{JSON.stringify(state.roomEmotions)}</p>
    </div>
  )
}

export default WatchRoom
