/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin-Didier Tran
 * @author Benjamin Roy
 */

import Enzyme, { shallow } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';
import PropTypes from 'prop-types';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import toJson from 'enzyme-to-json';
import Permissions from '../../../src/components/settings/permissions';

Enzyme.configure({ adapter: new Adapter() });

describe('Permissions Tests', () => {
  const initialState = {
    applicationReducer: { language: 'en' },
  };
  const mockStore = configureMockStore();
  const store = mockStore(initialState);

  it('should have proptypes', () => {
    const actualValue = Permissions.WrappedComponent.propTypes;

    const expectedValue = {
      language: PropTypes.string.isRequired,
      changeDataAgreement: PropTypes.func.isRequired,
      dataAgreement: PropTypes.bool.isRequired,
      hasErrors: PropTypes.bool.isRequired,
      showSuccess: PropTypes.func.isRequired,
      showError: PropTypes.func.isRequired,
    };

    expect(JSON.stringify(actualValue)).toEqual(JSON.stringify(expectedValue));
  });

  it('should match the snapshot with no error', () => {
    const props = {
      hasErrors: false,
      showSuccess: () => {},
      showError: () => {},
    };
    const wrapper = shallow(<Permissions store={store} {...props} />).dive();

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should match the snapshot with errors', () => {
    const props = {
      hasErrors: true,
      showSuccess: () => {},
      showError: () => {},
    };
    const wrapper = shallow(<Permissions store={store} {...props} />).dive();

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
