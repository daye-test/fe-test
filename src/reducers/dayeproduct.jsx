import * as types from '../constants/ActionTypes';
import initialState from '../constants/InitialState';

export default function dayeProdReducer(state = initialState.getIn(['dayeproduct']), action) {
	if (action.payload && action.payload.data) {
		switch (action.type) {
		case types.GET_DAYEPRODUCTS:
			return state.set('entries', action.payload.data);
		default: return state;
		}
	} else if (action.payload && action.payload.data && !action.payload.data.IsSuccessful) {
		switch (action.type) {
		case types.GET_DAYEPRODUCTS:
			return state
				.set('errors', action.payload.data.ErrorMessage);
		default: return state;
		}
	}
	return state;
}
