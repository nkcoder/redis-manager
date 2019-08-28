import { combineReducers } from 'redux';
import dbReducer from './dbReducer';
import clientReducer from './clientReducer';

export default combineReducers({ dbReducer, clientReducer });
