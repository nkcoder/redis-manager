import { GET_CLIENTS } from './actionTypes';

export const getClients = clients => (
  {
    type: GET_CLIENTS,
    payload: {
      clients
    }
  }
)