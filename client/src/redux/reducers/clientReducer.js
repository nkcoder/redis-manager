import initialState from "./initialState";
import { GET_CLIENTS } from "../actions/actionTypes";

export default function (state = initialState, action) {
  console.log(`receive action, type: ${JSON.stringify(action)}`);
  switch (action.type) {
    case GET_CLIENTS:
      console.log('GET_CLIENTS case')
      return ({
        clients: action.payload.clients
      });
    default:
      return state;
  }
}