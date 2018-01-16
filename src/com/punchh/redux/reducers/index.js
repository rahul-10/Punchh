import { combineReducers } from 'redux';
import FavReducer from './FavReducer';

export default combineReducers({
  object: FavReducer
  //console.log("hello");
});
