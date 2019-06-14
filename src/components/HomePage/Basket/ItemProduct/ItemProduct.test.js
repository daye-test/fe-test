import React from 'react';
import { shallow } from 'enzyme';
import ItemProduct from './ItemProduct';

describe('Testing Render of ItemProduct', () => {
   it('renders without crashing', () => {
      shallow(<ItemProduct />);
    });
});