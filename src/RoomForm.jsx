import React, { useId, useState } from 'react'
import { useNavigate } from 'react-router'
import slugify from 'slugify'

export const toRoomSlug = (name) => slugify(name, { lower: true, strict: true })

export default function RoomForm({ title, icon, iconAlt, basePath }) {
  const [roomName, setRoomName] = useState('')
  const navigate = useNavigate()
  const inputId = useId()
  const slug = toRoomSlug(roomName)

  function onSubmit(e) {
    e.preventDefault()
    if (slug) navigate(`${basePath}/${slug}`)
  }

  return (
    <form className="roomBox" onSubmit={onSubmit}>
      <div className="titleSection">
        <img src={icon} alt={iconAlt} className="indicator" width="130" height="130" />
        <h2>{title}</h2>
      </div>

      <div className="form__group field">
        <input
          id={inputId}
          placeholder="Room Name"
          name="roomName"
          required
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          autoComplete="off"
          className="form__field"
        />
        <label htmlFor={inputId} className="form__label">
          Room Name
        </label>
      </div>
      <div>
        <button type="submit" disabled={!slug} className={slug ? '' : 'disabled'}>
          GO
        </button>
      </div>
    </form>
  )
}
