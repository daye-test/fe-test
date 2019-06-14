/* eslint import/prefer-default-export: "off" */

import axios from 'axios';
import { API_URL } from '../../constants/config';
import * as types from '../../constants/ActionTypes';

export function retrieveDayeProducts() {
	const req = axios.get(API_URL);

	return {
		type: types.GET_DAYEPRODUCTS,
		payload: req,
	};
}
