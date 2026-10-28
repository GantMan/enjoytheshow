import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { VictoryPie, VictoryTooltip } from 'victory'
import { graphql } from './lib/api'
import { leaveRoom } from './lib/audience'
import { touchRoom } from './lib/rooms'
import { onUpdateByRoomId } from './graphql/subscriptions'
import { itemsByRoomName } from './graphql/queries'

// Only show faces updated in the past few minutes; this drops people who
// closed their browser before a final API call could clear them
const activeWindowMins = 5

function CustomLabel(props) {
  const { x, y, datum, text } = props
  return (
    <g>
      <text
        x={x - 15}
        y={y}
        fontSize={12}
        fontWeight="bold"
        fill="white"
        fontFamily="'Roboto Condensed', 'Gill Sans', 'Trebuchet MS', sans-serif"
      >
        {datum.y > 0 ? datum.x : ''}
      </text>
      <VictoryTooltip
        {...props}
        text={`${text}\n${datum.y}`}
        orientation="top"
        flyoutStyle={{ fill: '#c33f38' }}
      />
    </g>
  )
}
CustomLabel.defaultEvents = VictoryTooltip.defaultEvents

const EmptyMessage = () => (
  <div className="roomEmpty">
    <div className="bb">
      <p>This Room is Empty</p>
    </div>
  </div>
)

export const getFaceStats = (members) => {
  const emotions = members.flatMap((m) => m.emotion.split(','))
  const count = (name) => emotions.filter((e) => e === name).length
  const chart = ['Happy', 'Neutral', 'Surprised', 'Sad', 'Fearful', 'Disgusted', 'Angry'].map(
    (x) => ({ x, y: count(x.toLowerCase()) })
  )
  return { chart, total: emotions.length }
}

function WatchRoom() {
  const { id: roomName } = useParams()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = `Watching ${roomName} | Enjoying The Show`
    let cancelled = false

    async function fetchRoomEmotions() {
      const past = new Date(Date.now() - 60000 * activeWindowMins)
      const { data } = await graphql(itemsByRoomName, {
        roomName,
        limit: 1000,
        filter: { updatedAt: { gt: past.toISOString() } },
      })
      if (!cancelled) {
        setMembers(data.itemsByRoomName.items)
        setLoading(false)
      }
    }

    leaveRoom()
    touchRoom(roomName).catch(() => {})
    fetchRoomEmotions().catch((e) => console.error('Could not load room', e))

    const subscription = graphql(onUpdateByRoomId, { id: roomName }).subscribe({
      next: () => fetchRoomEmotions().catch(() => {}),
      error: (e) => console.error('Subscription error', e),
    })
    // Age out audience members that silently left
    const refresh = setInterval(() => fetchRoomEmotions().catch(() => {}), 60000)

    return () => {
      cancelled = true
      clearInterval(refresh)
      subscription.unsubscribe()
    }
  }, [roomName])

  const faceStats = getFaceStats(members)
  const roomUrl = `${window.location.origin}/room/${roomName}`
  return (
    <div>
      <meta name="robots" content="noindex" />
      <section className="room">
        <img className="flourish" src="/flourish.svg" alt="" width="600" height="120" />
        <h1 className="explainer">
          Watching
          <br />
          {roomName}
        </h1>
      </section>
      <section className="resultFramer">
        {!loading && members.length === 0 && <EmptyMessage />}
        <VictoryPie
          animate={{ duration: 200 }}
          style={{ labels: { fontWeight: 'bold', fontSize: 8, fill: 'white' } }}
          labelRadius={({ innerRadius }) => innerRadius + 100}
          labelComponent={<CustomLabel />}
          colorScale={['#295796', '#864074', '#a85eb3', '#752fb4', '#422eaf', '#637dc2', '#6b1d1e']}
          data={faceStats.chart}
        />
      </section>
      <h2 className="roomReport" aria-live="polite">
        There {faceStats.total === 1 ? 'is 1 person' : `are ${faceStats.total} people`} in the room
      </h2>
      <hr />
      <section id="explainerSection">
        <h2>What is this?</h2>
        <img src="/binoc.svg" id="explainWatch" alt="" />
        <p>
          This page is watching the audience members in room{' '}
          <Link to={`/room/${roomName}`}>{roomName}</Link>. The emotions of the
          people in that room will be sent here in real-time. Share the room URL
          with your audience members.
        </p>
        <h2 className="shareUrl">{roomUrl}</h2>
        <p>
          If you'd like to create your own room or understand more about this
          project, <Link to="/">visit the main page</Link>.
        </p>
      </section>
    </div>
  )
}

export default WatchRoom
