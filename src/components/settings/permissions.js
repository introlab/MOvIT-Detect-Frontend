/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin-Didier Tran
 * @author Benjamin Roy
 */

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ErrorMessage from '../shared/errorMessage';
import PreventPermission from './preventPermission';
import { T } from '../../utilities/translator';
import { URL } from '../../redux/applicationReducer';
import { post } from '../../utilities/secureHTTP';

class Permissions extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    changeDataAgreement: PropTypes.func.isRequired,
    dataAgreement: PropTypes.bool.isRequired,
    hasErrors: PropTypes.bool.isRequired,
    showSuccess: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
  };

  async save() {
    const data = {
      dataAgreement: this.props.dataAgreement,
    };
    // console.log(this.props.dataAgreement);
    try {
      await post(`${URL}dataAgreement`, data);
      this.props.showSuccess();
    } catch {
      this.props.showError();
    }
  }

  render() {
    return (
      <div>
        {this.props.hasErrors
          ? <ErrorMessage />
          : (
            <PreventPermission
              permission={this.props.dataAgreement}
              permissionTitle={T.translate(`settings.permissions.dataAgreement.${this.props.language}`)}
              onPermissionChange={this.props.changeDataAgreement}
              onSave={this.save.bind(this)}
            />
          )
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.applicationReducer.language,
  };
}

export default connect(mapStateToProps)(Permissions);
