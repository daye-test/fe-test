import { fromJS } from 'immutable';

import * as userState from './ProductState';

const state = {
	dayeproduct: {
		entries: null,
		errors: null,
		status: userState.PRODUCT_RETRIEVED,
	},
};

export default fromJS(state);
