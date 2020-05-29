import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  createAudienceMember,
  updateAudienceMember,
  createRoom,
  updateRoom,
  deleteAudienceMember,
} from "./graphql/mutations";
import API from "@aws-amplify/api";
import * as faceapi from "face-api.js";

const minConfidence = 0.5;
const faceBoundaries = true;
const videoRef = React.createRef();
const canvasRef = React.createRef();

function Room() {
  const [_faces, setFaces] = useState();
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
    // SORRY AGAIN
    window.streamStorage = stream;
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
      const facialExpressions = result
        .map((r) => {
          if (r.detection.score > minConfidence)
            return Object.keys(r.expressions).reduce((a, b) =>
              r.expressions[a] > r.expressions[b] ? a : b
            );
        })
        .toString();

      // A person has been setup
      // DON'T YOU JUDGE ME FOR USING GLOBALS!
      if (facialExpressions !== window.faces) {
        // console.log(
        //   `facialExpressions changed from ${window.faces} to ${facialExpressions} `
        // )
        // store local
        window.faces = facialExpressions;
        setFaces(facialExpressions);
        // send to server
        setEmotion(facialExpressions);
      }

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

  async function createPerson(startEmotion = "neutral") {
    const personResult = await API.graphql({
      query: createAudienceMember,
      variables: { input: { emotion: startEmotion, roomName: params.id } },
    });

    setPerson(personResult.data.createAudienceMember.id);
    // console.log('See that person data', personResult)
  }

  async function setEmotion(emotion) {
    // console.log("setting emotion to " + emotion);
    await API.graphql({
      query: updateAudienceMember,
      variables: { input: { id: person, emotion } },
    });

    try {
      await API.graphql({
        query: updateRoom,
        variables: {
          input: { id: params.id, lastUpdated: Date.now().toString() },
        },
      });
    } catch (e) {
      // If the error is that a room doesn't exist - just create it!
      if (
        e.errors[0].errorType === "DynamoDB:ConditionalCheckFailedException"
      ) {
        API.graphql({
          query: createRoom,
          variables: { input: { id: params.id, lastUpdated: Date.now() } },
        });
      }
    }
  }

  useEffect(() => {
    if (person) {
      loadModelsAndAll();
    } else {
      createPerson();
    }

    // clean up the audience member
    return () => {
      // Stop camera
      window.streamStorage && window.streamStorage.getTracks()[0].stop();

      if (person) {
        // Delete person
        API.graphql({
          query: deleteAudienceMember,
          variables: {
            input: { id: person },
          },
        });

        API.graphql({
          query: updateRoom,
          variables: {
            input: { id: params.id, lastUpdated: Date.now().toString() },
          },
        });
      }
    };
  }, [person]);

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
    </div>
  );
}

export default Room;
