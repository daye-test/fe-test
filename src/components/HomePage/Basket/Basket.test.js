import React from 'react';
import { shallow } from 'enzyme';
import Basket from './Basket';

describe('Testing Render of Basket', () => {
   it('renders without crashing', () => {
      shallow(<Basket />);
    });
});