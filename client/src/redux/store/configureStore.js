import { createStore, applyMiddleware } from "redux";
import rootReducers from '../reducers';

export default createStore(rootReducers);