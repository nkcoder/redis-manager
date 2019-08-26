import initialState from "./initialState";
import { SWITCH_DATABASE } from "../actions/actionTypes";

export default function (state = initialState, action) {
  switch (action.type) {
    case SWITCH_DATABASE:
      const { database } = action.payload;
      return (
        {
          database: database
        }
      );
    default:
      return state;
  }
}