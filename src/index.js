import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Router from "./Router";
import * as serviceWorker from "./serviceWorker";
import Amplify from "@aws-amplify/core";
import config from "./aws-exports";
import Cookies from "js-cookie";
import { createAudienceMember } from "./graphql/mutations";
import API from "@aws-amplify/api";

Amplify.configure(config);

// Create Audience Member
if (!Cookies.get("audience_id")) {
  API.graphql({
    query: createAudienceMember,
    variables: { input: { emotion: "unknown", roomName: "homeroombase" } },
  }).then((personResult) => {
    // console.log(
    //   "Setting audience_id to",
    //   personResult.data.createAudienceMember.id
    // );
    Cookies.set("audience_id", personResult.data.createAudienceMember.id);
  });
}

ReactDOM.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
