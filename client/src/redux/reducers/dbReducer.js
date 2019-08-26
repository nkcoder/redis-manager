import initialState from "./initialState";
import { SWITCH_DATABASE } from "../actions/actionTypes";

export default function (state = initialState, action) {
  console.log(`receive action, type: ${JSON.stringify(action)}}`);
  switch (action.type) {
    case SWITCH_DATABASE:
      const { index } = action.payload;
      return (
        {
          index: index
        }
      );
    default:
      return state;
  }
}