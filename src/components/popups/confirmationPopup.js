/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin-Didier Tran
 * @author Benjamin Roy
 */

import React, { Component } from 'react';

import { Button } from 'primereact/components/button/Button';
import { Dialog } from 'primereact/components/dialog/Dialog';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { T } from '../../utilities/translator';

class ConfirmationPopup extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onStart: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    flagNextButton: PropTypes.bool.isRequired,
    flagStartButton: PropTypes.bool.isRequired,
    labelCancelButton: PropTypes.string.isRequired,
  };

  render() {
    const style = {
      body: {
        textAlign: 'justify'
      },
      icon: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
      },
    };
    const footer = (
      <div>
        <Button
          id="cancelButton"
          label={this.props.labelCancelButton}
          onClick={this.props.onClose}
        />
        
        {this.props.flagStartButton && (
        <Button
          id="startButton"
          label={T.translate(`calibrationPopup.start.${this.props.language}`)}
          onClick={this.props.onStart}
        />)
        }
        {
        this.props.flagNextButton && (
         <Button
          id="nextButton"
          label={T.translate(`calibrationPopup.next.${this.props.language}`)}
          onClick={this.props.onNext}
        />)
        }

      </div>
    );
    return (
      <Dialog
        width="550px"
        visible={this.props.show}
        modal
        header={this.props.title}
        footer={footer}
        onHide={this.props.onClose}
      >
        <div style={style.body}>
          <div className="row">
            <div className="col">
             { <i className="fa fa-question-circle fa-3x" style={style.icon} />}
            </div>
            <div className="col-10">
              {this.props.body}
            </div>
          </div>
        </div>
  
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.applicationReducer.language,
  };
}

export default connect(mapStateToProps)(ConfirmationPopup);
