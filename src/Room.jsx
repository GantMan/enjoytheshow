import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import * as faceapi from '@vladmandic/face-api'
import { graphql } from './lib/api'
import { ensureAudienceMember, leaveRoom } from './lib/audience'
import { touchRoom } from './lib/rooms'
import { updateAudienceMember } from './graphql/mutations'

const minConfidence = 0.5
const faceBoundaries = true
// ~4 checks a second is plenty for audience mood and keeps laptops cool
const detectIntervalMs = 250

function Room() {
  const { id: roomName } = useParams()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [status, setStatus] = useState('Warming up the stage lights…')
  const [faces, setFaces] = useState('')

  useEffect(() => {
    document.title = `Room ${roomName} | Enjoying The Show`
    let cancelled = false
    let timer
    let stream
    let personId
    let lastSent

    async function setEmotion(emotion, extra = {}) {
      await graphql(updateAudienceMember, { input: { id: personId, emotion, ...extra } })
      await touchRoom(roomName)
    }

    async function detect() {
      if (cancelled) return
      const video = videoRef.current
      const canvas = canvasRef.current
      const result = await faceapi
        .detectAllFaces(video, new faceapi.SsdMobilenetv1Options({ minConfidence }))
        .withFaceExpressions()

      if (!cancelled && result.length > 0) {
        // Dominant expression of every confident face, e.g. "happy,neutral"
        const expressions = result
          .filter((r) => r.detection.score > minConfidence)
          .map((r) => r.expressions.asSortedArray()[0].expression)
          .toString()

        if (expressions !== lastSent) {
          lastSent = expressions
          setFaces(expressions)
          setEmotion(expressions).catch((e) => console.error('Could not send emotion', e))
        }

        if (faceBoundaries) {
          const dims = faceapi.matchDimensions(canvas, video, true)
          const resized = faceapi.resizeResults(result, dims)
          faceapi.draw.drawDetections(canvas, resized)
          faceapi.draw.drawFaceExpressions(canvas, resized, minConfidence)
        }
      }
      timer = setTimeout(detect, detectIntervalMs)
    }

    async function start() {
      try {
        personId = await ensureAudienceMember()
        await setEmotion('unknown', { roomName })
      } catch (e) {
        console.error('Could not join room', e)
        setStatus('The theatre is having trouble connecting. Please try again shortly.')
        return
      }

      setStatus('Loading the face detection model…')
      await faceapi.tf.ready()
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('/'),
        faceapi.nets.faceExpressionNet.loadFromUri('/'),
      ])
      if (cancelled) return

      setStatus('Waiting for your camera…')
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: 'user' },
        })
      } catch (err) {
        console.error('getUserMedia error', err)
        setStatus("Your browser isn't allowing webcam access. Check permissions or try a different browser.")
        return
      }
      if (cancelled) return stream.getTracks().forEach((t) => t.stop())

      const video = videoRef.current
      video.srcObject = stream
      video.onloadedmetadata = () => {
        setStatus('')
        detect()
      }
    }

    start()

    return () => {
      cancelled = true
      clearTimeout(timer)
      stream?.getTracks().forEach((t) => t.stop())
      if (personId) leaveRoom()
    }
  }, [roomName])

  return (
    <div>
      <meta name="robots" content="noindex" />
      <section className="room">
        <img className="flourish" src="/flourish.svg" alt="" width="600" height="120" />
        <h1 className="explainer">
          Room
          <br />
          {roomName}
        </h1>
      </section>
      <h2 className="centerme">Smile for the Camera</h2>
      <p className="centerme status" role="status">
        {status || (faces ? `Detected: ${faces}` : 'Looking for faces…')}
      </p>
      <section>
        <div id="captureContainer">
          <video
            ref={videoRef}
            id="inputVideo"
            className="captureBox"
            autoPlay
            muted
            playsInline
          ></video>
          <canvas id="overlay" ref={canvasRef} className="captureBox" />
        </div>
      </section>
      <hr />
      <section id="explainerSection">
        <img src="/staff.svg" id="explainerHeaderImage" alt="" />
        <h2>What is this page?</h2>
        <p>
          Your camera is attempting to identify your current emotional state
          from your facial expression. The most dominant emotional state is then
          combined and sent off for real time tracking with everyone else who's
          also in this unique room. Your video never leaves your device.
        </p>
        <p>
          If you'd like to create your own room or understand more about this
          project, <Link to="/">visit the main page</Link>.
        </p>
      </section>
    </div>
  )
}

export default Room
