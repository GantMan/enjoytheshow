import React from 'react'
import { Link } from 'react-router'

export default function NotFound() {
  return (
    <section className="room">
      <title>Page not found | Enjoying The Show</title>
      <meta name="robots" content="noindex" />
      <img className="flourish" src="/flourish.svg" alt="" width="600" height="120" />
      <h1 className="explainer">Intermission</h1>
      <p>
        This page isn't part of tonight's show. <Link to="/">Head back to the lobby</Link>.
      </p>
    </section>
  )
}
