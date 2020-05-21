// import React, { useReducer, useEffect } from 'react'
// import { useParams } from 'react-router-dom'
// import API from '@aws-amplify/api'

// const initialState = {
//   loading: true,
//   roomEmotions: [],
// }

// function reducer(state, action) {
//   switch (action.type) {
//     case 'SET_ROOM_EMOTIONS':
//       return {
//         ...state,
//         roomEmotions: action.roomEmotions,
//         loading: false,
//       }
//     case 'SET_LOADING':
//       return {
//         ...state,
//         loading: action.loading,
//       }
//     default:
//       return state
//   }
// }

// function WatchRoom() {
//   let params = useParams()
//   const [state, dispatch] = useReducer(reducer, initialState)
//   let subscription

//   useEffect(() => {
//     fetchRoomEmotions()
//     return () => {
//       subscription && subscription.unsubscribe
//     }
//   }, [])

//   async function fetchRoomEmotions() {
//     let {
//       data: {
//         itemsByRoomName: { items: roomItems },
//       },
//     } = await API.graphql({
//       query: itemsByRoomName,
//       variables: { roomName: params.id },
//     })
//     console.log('roomItems', roomItems)
//     dispatch({ type: 'SET_ROOM_EMOTIONS', roomEmotions: roomItems })
//     subscribe(roomItems)
//   }

//   function subscribe(roomItems) {
//     // WOOPS, so many subscriptions needed!
//     subscription = API.graphql({
//       query: onUpdateById,
//       variables: { id: roomItems[0].id },
//     }).subscribe({
//       next: (apiData) => {
//         const {
//           value: {
//             data: {
//               onUpdateByID: { id, clientId },
//             },
//           },
//         } = apiData
//         // dispatch({ type})
//       },
//     })
//   }

//   return <div>I watch Room - {params.id}</div>
// }

// export default WatchRoom
