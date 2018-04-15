import React from 'react';
import TestUtils from 'react-dom/test-utils';
import PropTypes from 'prop-types';
import SubmitButtons from '../../src/components/submitButtons';

describe('SubmitButtons Tests', () => {
  it('should have proptypes', function () {
    // Actual value
    const actualValue = SubmitButtons.WrappedComponent.propTypes;

    // Expected value
    const expectedValue = {
      language: PropTypes.string.isRequired,
      onSave: PropTypes.func.isRequired,
      onCancel: PropTypes.func.isRequired,
    };

    // Test
    expect(JSON.stringify(actualValue)).toEqual(JSON.stringify(expectedValue));
  });
});