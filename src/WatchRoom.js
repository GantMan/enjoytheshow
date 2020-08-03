import React, { useReducer, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "@aws-amplify/api";
import { onUpdateByRoomId } from "./graphql/subscriptions";
import { itemsByRoomName } from "./graphql/queries";
import { VictoryPie, VictoryTooltip } from "victory";
import leaveRoom from "./lib/leaveRoom";

// const demoChart = [
//   { x: 'Happy', y: 1 },
//   { x: 'Neutral', y: 8 },
//   { x: 'Surprised', y: 14 },
//   { x: 'Sad', y: 1 },
//   { x: 'Fearful', y: 1 },
//   { x: 'Disgusted', y: 11 },
//   { x: 'Angry', y: 1 },
// ]

class CustomLabel extends React.Component {
  static defaultEvents = VictoryTooltip.defaultEvents;
  render() {
    const { x, y, datum } = this.props;
    const cat = datum.y > 0 ? datum.x : "";
    return (
      <g>
        <text
          x={x - 15}
          y={y}
          fontSize={12}
          fontWeight="bold"
          fill="white"
          fontFamily="'Roboto Condensed', 'Gill Sans', 'Gill Sans MT', 'Ser­avek', 'Trebuchet MS', sans-serif"
        >
          {cat}
        </text>
        <VictoryTooltip
          {...this.props}
          text={`${this.props.text}\n${this.props.datum.y}`}
          orientation="top"
          flyoutStyle={{ fill: "#c33f38" }}
        />
      </g>
    );
  }
}

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

const EmptyMessage = (props) => {
  if (props.check.length === 0) {
    return (
      <div className="roomEmpty">
        <div className="bb">
          <h1>This Room is Empty</h1>
        </div>
      </div>
    );
  }
  return null;
};

const getFaceStats = (emotions) => {
  const emoteArray = emotions.map((em) => em.emotion.split(",")).flat();
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

  return { chart, total: emoteArray.length };
};

function WatchRoom() {
  let params = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  let subscription;

  useEffect(() => {
    leaveRoom();
    fetchRoomEmotions();
    subscribe();
    return () => {
      subscription && subscription.unsubscribe();
    };
  }, []);

  async function fetchRoomEmotions() {
    // Only show faces updated in the past howManyMins
    // this helps people who exited their browser
    // but no final API call was made to clear them
    const howManyMins = 5;
    const past = new Date(Date.now() - 60000 * howManyMins);
    const searchSpec = {
      roomName: params.id,
      filter: {
        updatedAt: {
          gt: past.toISOString(),
        },
      },
    };

    let {
      data: {
        itemsByRoomName: { items: roomItems },
      },
    } = await API.graphql({
      query: itemsByRoomName,
      variables: searchSpec,
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

  const faceStats = getFaceStats(state.roomEmotions);
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
        <EmptyMessage check={state.roomEmotions} />
        <VictoryPie
          animate={{
            duration: 200,
          }}
          style={{
            labels: { fontWeight: "bold", fontSize: 8, fill: "white" },
          }}
          labelRadius={({ innerRadius }) => innerRadius + 100}
          labelComponent={<CustomLabel />}
          colorScale={[
            "#295796",
            "#864074",
            "#a85eb3",
            "#752fb4",
            "#422eaf",
            "#637dc2",
            "#6b1d1e",
          ]}
          data={faceStats.chart}
          // data={demoChart}
        />
      </section>
      <h3 className="roomReport">
        There are {faceStats.total} people in the room
      </h3>
      <hr />
      <section id="explainerSection">
        <h2>What is this?</h2>
        <img src="/binoc.svg" id="explainWatch" alt="binoculars icon" />
        <p>
          This page is watching the audience members in room{" "}
          <a href={`/room/${params.id}`}>{params.id}</a>. The emotions of the
          people in that room will be sent here in real-time. Share the room URL
          with your audience members.
        </p>
        <h2>{window.location.href.replace("watch", "room")}</h2>
        <p>
          If you'd like to create your own room or understand more about this
          project, <a href="/">visit the main page</a>.
        </p>
      </section>
    </div>
  );
}

export default WatchRoom;
