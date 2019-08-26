import { SWITCH_DATABASE } from './actionTypes';

export const switchDatabase = index => (
  {
    type: SWITCH_DATABASE,
    payload: {
      index
    }
  }
);
