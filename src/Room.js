import React from 'react'
import { useParams } from 'react-router-dom'

function Room() {
  let params = useParams()

  return <div>I am Room - {params.id}</div>
}

export default Room
