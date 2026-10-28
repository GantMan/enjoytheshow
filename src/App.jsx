import React, { useEffect } from 'react'
import CreateRoom from './CreateRoom'
import JoinRoom from './JoinRoom'
import DemoVideo from './DemoVideo'

const TALK_ID = 'GskMuu821NI'

function App() {
  // Make sure returning visitors aren't still counted in a room
  useEffect(() => {
    if (document.cookie.includes('audience_id=')) {
      import('./lib/audience').then(({ leaveRoom }) => leaveRoom())
    }
  }, [])

  return (
    <div className="App">
      <section className="masthead" aria-label="Theatre stage">
        <h1>
          <span className="visually-hidden">Enjoying The </span>SHOW
        </h1>
        <p className="tagline">Real-time AI audience emotion tracking for speakers</p>
        <a className="button" href="#explainer">
          What is This?
        </a>
      </section>
      <section className="navigateRooms" aria-label="Start or join a room">
        <CreateRoom />
        <JoinRoom />
      </section>
      <div>
        <img
          id="explainer"
          className="flourish"
          src="/flourish.svg"
          alt=""
          width="600"
          height="120"
          loading="lazy"
        />
        <section id="explainerSection">
          <h2 className="explainer">Enjoying The Show</h2>
          <p>
            This is an experiment for connecting speakers and audiences using
            AI. Any speaker can allocate a room URL for their audience, and
            regardless of the crowd being real or virtual, their webcams will
            share their dominant facial expression with the speaker in an
            audience summary. This helps the speaker gauge feedback from the
            audience just as they would by looking out at the faces in the
            crowd.
          </p>
          <img src="/audience.svg" alt="" width="120" height="120" loading="lazy" />
          <div className="videoDemo">
            <hr />
            <DemoVideo />
            <hr />
          </div>

          <h2>How it works</h2>
          <ol className="steps">
            <li>
              <strong>Speaker:</strong> type a room name under{' '}
              <em>Watch a Room</em>. You'll land on{' '}
              <code>/watch/your-room</code>, a live pie chart of the room's mood.
            </li>
            <li>
              <strong>Audience:</strong> share{' '}
              <code>enjoyingthe.show/room/your-room</code>. Each person allows
              webcam access and their expression is detected right in their
              browser.
            </li>
            <li>
              <strong>Privacy:</strong> video never leaves the device. Only the
              single word for the dominant expression (like “happy”) is sent.
            </li>
          </ol>

          <p>
            The Technology used for <strong>Enjoying The Show</strong> uses
            elaborate tooling to complete a simple straight-forward task. Each
            audience member's browser runs their webcam input through
            TensorFlow.js (via face-api) to identify the emotional sentiment of
            the person. The dominant detection out of{' '}
            <em>
              Happy, Neutral, Surprised, Sad, Fearful, Disgusted, and Angry,{' '}
            </em>
            is sent to an AWS AppSync GraphQL API. <em>On the other side,</em>{' '}
            the "watching room" URL has a GraphQL subscription and updates
            whenever a new audience member arrives, leaves, or changes their
            facial expression. Hundreds of client models can be managed and
            displayed on the dashboard in real-time.
          </p>

          <section className="talk" aria-labelledby="talk-title">
            <h2 id="talk-title">Watch the talk</h2>
            <a
              className="talkThumb"
              href={`https://www.youtube.com/watch?v=${TALK_ID}`}
              target="_blank"
              rel="noopener"
            >
              <img
                src={`https://i.ytimg.com/vi/${TALK_ID}/hqdefault.jpg`}
                alt="Enjoying the Show - Gant Laborde - Made with TensorFlow.js (YouTube)"
                width="480"
                height="360"
                loading="lazy"
              />
              <span className="play" aria-hidden="true">▶</span>
            </a>
            <p>
              Gant Laborde walks through how Enjoying The Show was built on{' '}
              <em>Made with TensorFlow.js</em>, from the TensorFlow channel.
            </p>
          </section>

          <img src="/hat.svg" alt="" width="120" height="120" loading="lazy" />
          <h2 className="specialThanks">Special Thanks</h2>
          <div className="thanks">
            <p>
              To{' '}
              <a href="https://x.com/dabit3" target="_blank" rel="noopener noreferrer">
                Nader Dabit
              </a>
              , who has done a great job advocating AWS Amplify and answering
              questions on this awesome technology. To{' '}
              <a href="https://github.com/justadudewhohacks" target="_blank" rel="noopener noreferrer">
                Vincent Mühler
              </a>
              , who has done all the hard work in TensorFlow.js with his amazing
              face-api.js library. To{' '}
              <a href="https://infinite.red" target="_blank" rel="noopener">
                Infinite Red
              </a>
              , who is the best damn consulting company in the world; their
              support allows me push the boundaries of AI, Machine Learning, and
              JavaScript.
            </p>
            <p>
              And <strong>THANK YOU</strong> for sharing this with others. Feel
              free to use this service with your audience. I'll see you on{' '}
              <a href="https://x.com/gantlaborde" target="_blank" rel="noopener me">
                X / Twitter
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
