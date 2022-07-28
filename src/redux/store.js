import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import Reducers from "./reducers";

const RootReducer = combineReducers({ Reducers });

export const Store = createStore(RootReducer, applyMiddleware(thunk));
