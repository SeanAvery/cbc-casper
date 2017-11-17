import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import * as reducers from './reducers/index'

export default createStore(combineReducers({...reducers}), applyMiddleware(thunk))
