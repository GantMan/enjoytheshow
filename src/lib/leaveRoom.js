import Cookies from "js-cookie";
import { updateAudienceMember } from "../graphql/mutations";
import API from "@aws-amplify/api";

export default () => {
  API.graphql({
    query: updateAudienceMember,
    variables: {
      input: {
        id: Cookies.get("audience_id"),
        emotion: "unknown",
        roomName: "homeroombase",
      },
    },
  });
};
