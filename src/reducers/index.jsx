import { combineReducers } from 'redux-immutable';
import dayeProdReducer from './dayeproduct';

const rootReducer = combineReducers({
	dayeproduct: dayeProdReducer,
});

export default rootReducer;
