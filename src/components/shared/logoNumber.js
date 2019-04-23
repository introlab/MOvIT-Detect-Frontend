/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin Didier Tran
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class LogoNumber extends Component {
  static propTypes = {
    iconClass: PropTypes.string.isRequired,
    placeHolder: PropTypes.string.isRequired,
    value: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    const style = {
      icon: {
        paddingTop: '6px',
        fontSize: 'large',
        minWidth: '23px',
      },
    };

    return (
      <div className="form-horizontal row mb-3">
        <div className="col-1 d-inline-block text-right">
          <span className="text-center" style={style.icon}><i className={this.props.iconClass} /></span>
        </div>
        <div className="col-11 col-lg-8 d-inline-block pr-1">
          <input
            type="number"
            placeholder={this.props.placeHolder}
            className="form-control"
            id="logoNumber"
            min={this.props.min || 0}
            max={this.props.max || 90}
            onChange={e => this.props.onChange(Number(e.target.value))}
            value={this.props.value || ''}
          />
        </div>
      </div>
    );
  }
}
