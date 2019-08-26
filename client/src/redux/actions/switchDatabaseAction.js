import { SWITCH_DATABASE } from './actionTypes';

export const switchDatabase = db => (
  {
    type: SWITCH_DATABASE,
    payload: db
  }
);
