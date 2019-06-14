import React from 'react';
import { shallow } from 'enzyme';
import HomePageContainer from './HomePageContainer';

describe('First React component test with Enzyme', () => {
   it('renders without crashing', () => {
      shallow(<HomePageContainer />);
    });
});