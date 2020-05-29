import React, { useReducer, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "@aws-amplify/api";
import { onUpdateByRoomId } from "./graphql/subscriptions";
import { itemsByRoomName } from "./graphql/queries";
import { VictoryPie, VictoryTooltip } from "victory";

const initialState = {
  loading: true,
  roomEmotions: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ROOM_EMOTIONS":
      return {
        ...state,
        roomEmotions: action.roomEmotions,
        loading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.loading,
      };
    default:
      return state;
  }
}

const getFaceStats = (emotions) => {
  const emoteArray = emotions.map((em) => em.emotion.split(","));
  const fCount = emoteArray.reduce(
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

function WatchRoom() {
  let params = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  let subscription;

  useEffect(() => {
    fetchRoomEmotions();
    subscribe();
    return () => {
      subscription && subscription.unsubscribe();
    };
  }, []);

  async function fetchRoomEmotions() {
    let {
      data: {
        itemsByRoomName: { items: roomItems },
      },
    } = await API.graphql({
      query: itemsByRoomName,
      variables: { roomName: params.id },
    });
    // console.log("roomItems", roomItems)
    dispatch({ type: "SET_ROOM_EMOTIONS", roomEmotions: roomItems });
  }

  function subscribe() {
    subscription = API.graphql({
      query: onUpdateByRoomId,
      variables: { id: params.id },
    }).subscribe({
      next: (apiData) => {
        fetchRoomEmotions();
      },
    });
  }

  return (
    <div>
      <section className="room">
        <img
          className="flourish"
          src="/flourish.svg"
          alt="beautiful flourish"
        />
        <h2 className="explainer">
          Watching
          <br />
          {params.id}
        </h2>
      </section>
      <section className="resultFramer">
        <VictoryPie
          animate={{
            duration: 200,
          }}
          style={{ labels: { fontSize: 20, fontWeight: "bold" } }}
          labelRadius={({ innerRadius }) => innerRadius + 50}
          labelComponent={<VictoryTooltip />}
          colorScale={[
            "#029832",
            "#62b32b",
            "#C7EA46",
            "#fedb00",
            "#f97a00",
            "#ff5349",
            "#d50218",
          ]}
          data={getFaceStats(state.roomEmotions).chart}
        />
      </section>
      <hr />
      <section id="explainerSection">
        <h2>What is this page?</h2>
        <img src="/binoc.svg" id="explainWatch" />
        <p>
          This is the watching area for this room: <a href="">fdsafsd</a>
        </p>
        <p>
          If you'd like to create your own room or understand more about this
          project, <a href="/">visit the main page</a>.
        </p>
      </section>
    </div>
  );
}

export default WatchRoom;
