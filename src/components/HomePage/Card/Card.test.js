import React from 'react';
import { shallow } from 'enzyme';
import Card from './Card';

describe('Testing render of Card component', () => {
   it('renders without crashing', () => {
      shallow(<Card />);
    });
});