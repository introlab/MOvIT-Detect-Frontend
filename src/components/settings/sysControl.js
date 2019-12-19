/**
 * @author Charles Maheu
 * NOT FULLY WORKING, to be used in settings page
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/components/button/Button';

export default class SysControl extends Component {
  static propTypes = {
    onClickShutdown: PropTypes.func.isRequired,
    onClickReboot: PropTypes.func.isRequired,
    btnTextShutdown: PropTypes.string.isRequired,
    btnTextReboot: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div>
          <div className="row">
            <Button
                onClick={this.props.onClickShutdown()}
                id="btnShutdown"
                type="button"
                className="p-button-secondary mb-2 mb-sm-0"
                label={this.props.btnTextShutdown}
            />
            <Button
                onClick={this.props.onClickReboot()}
                id="btnReboot"
                type="button"
                className="p-button-secondary mb-2 mb-sm-0"
                label={this.props.btnTextReboot}
            />
          </div>
      </div>
    );
  }
}
