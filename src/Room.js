import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  createAudienceMember,
  updateAudienceMember,
  updateRoom,
} from "./graphql/mutations";
import API from "@aws-amplify/api";
import * as faceapi from "face-api.js";

const minConfidence = 0.5;
const faceBoundaries = true;
const videoRef = React.createRef();
const canvasRef = React.createRef();

const getFaceStats = (emotions) => {
  const fCount = emotions.reduce(
    (prev, curr) => ((prev[curr] = ++prev[curr] || 1), prev),
    {
      neutral: 0,
      happy: 0,
      sad: 0,
      fearful: 0,
      angry: 0,
      disgusted: 0,
      surprised: 0,
    }
  );

  const chart = [
    { x: "Happy", y: fCount.happy },
    { x: "Neutral", y: fCount.neutral },
    { x: "Surprised", y: fCount.surprised },
    { x: "Sad", y: fCount.sad },
    { x: "Fearful", y: fCount.fearful },
    { x: "Disgusted", y: fCount.disgusted },
    { x: "Angry", y: fCount.angry },
  ];
  const good = fCount.happy + fCount.neutral + fCount.surprised;
  const bad = fCount.sad + fCount.fearful + fCount.angry + fCount.disgusted;
  return { chart, good, bad, total: emotions.length };
};

function Room() {
  const [faces, setFaces] = useState({});
  const [person, setPerson] = useState();
  let params = useParams();

  const loadModelsAndAll = async () => {
    // Load all needed models
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/");
    await faceapi.loadFaceLandmarkModel("/");
    await faceapi.loadFaceExpressionModel("/");
    // get webcam running
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
        },
      });
    } catch (err) {
      alert(
        "Sorry - Your Browser isn't allowing access to your webcam.  Try a different browser for this device?"
      );
      console.error("getUserMedia error", err);
    }
    videoRef.current.srcObject = stream;
    // hold until the camera loads
    return new Promise((resolve, _) => {
      videoRef.current.onloadedmetadata = () => {
        // Kick off right away
        detectFaceStuff();
        resolve();
      };
    });
  };

  const detectFaceStuff = async () => {
    const videoEl = videoRef.current;
    const canvas = canvasRef.current;
    const result = await faceapi
      .detectAllFaces(
        videoEl,
        new faceapi.SsdMobilenetv1Options({ minConfidence })
      )
      .withFaceExpressions();
    if (result && result.length > 0) {
      // Go turn all faces over minConfidence into strings
      const facialExpressions = result.map((r) => {
        if (r.detection.score > minConfidence)
          return Object.keys(r.expressions).reduce((a, b) =>
            r.expressions[a] > r.expressions[b] ? a : b
          );
      });

      // Update numerical results
      const faceStats = getFaceStats(facialExpressions);
      setFaces(faceStats);

      // Display visual results
      if (faceBoundaries) {
        canvas.style.visibility = "visible";
        const dims = faceapi.matchDimensions(canvas, videoEl, true);
        const resizedResult = faceapi.resizeResults(result, dims);
        faceapi.draw.drawDetections(canvas, resizedResult);
        faceapi.draw.drawFaceExpressions(canvas, resizedResult, minConfidence);
      } else {
        canvas.style.visibility = "hidden";
      }
    }

    requestAnimationFrame(() => {
      // calm down when hidden!
      if (canvasRef.current) {
        detectFaceStuff();
      }
    });
  };

  async function createPerson() {
    const person = await API.graphql({
      query: createAudienceMember,
      variables: { input: { emotion: "neutral", roomName: params.id } },
    });

    setPerson(person.data.createAudienceMember.id);
    // console.log("See that person data", person);
  }

  async function setSad() {
    console.log("person", person);
    await API.graphql({
      query: updateAudienceMember,
      variables: { input: { id: person, emotion: "sad" } },
    });

    API.graphql({
      query: updateRoom,
      variables: {
        input: { id: params.id, lastUpdated: Date.now().toString() },
      },
    });
  }

  async function setHappy() {
    await API.graphql({
      query: updateAudienceMember,
      variables: {
        input: { id: person, emotion: "happy" },
      },
    });

    API.graphql({
      query: updateRoom,
      variables: {
        input: { id: params.id, lastUpdated: Date.now().toString() },
      },
    });
  }

  useEffect(() => {
    loadModelsAndAll();
  }, []);

  return (
    <div>
      <section className="room">
        <img
          className="flourish"
          src="/flourish.svg"
          alt="beautiful flourish"
        />
        <h2 className="explainer">
          Room
          <br />
          {params.id}
        </h2>
      </section>
      <h3 className="centerme">Smile for the Camera</h3>
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
        <img src="/staff.svg" id="explainerHeaderImage" />
        <h2>What is this page?</h2>
        <p>
          Your camera is attempting to identify your current emotional state
          from your facial expression. The most dominant emotional state is then
          combined and sent off for real time tracking with everyone else who's
          also in this unique room.
        </p>
        <p>
          If you'd like to create your own room or understand more about this
          project, <a href="/">visit the main page</a>.
        </p>
      </section>
      <div>
        <button onClick={createPerson}>Create Person X</button>
        <hr />
        <button onClick={setSad}>Sad</button>
        <button onClick={setHappy}>Happy</button>
      </div>
    </div>
  );
}

export default Room;
