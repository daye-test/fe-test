import React from 'react';
import { shallow } from 'enzyme';
import HomePage from './HomePage';

describe('First React component test with Enzyme', () => {
   it('renders without crashing', () => {
      shallow(<HomePage />);
    });
});