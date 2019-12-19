/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin Didier Tran
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class LogoText extends Component {
  static propTypes = {
    id: PropTypes.string,
    placeHolder: PropTypes.string.isRequired,
    iconClass: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    const style = {
      icon: {
        paddingTop: '6px',
        fontSize: 'large',
        minWidth: '26px',
      },

    };

    return (
      <div className="form-horizontal row mb-3">
        <div className="col-1 d-inline-block text-right">
          <span style={style.icon}><i className={this.props.iconClass} /></span>
        </div>
        <div className=" col-11 col-lg-8 d-inline-block pr-1">
          <input
            type="text"
            placeholder={this.props.placeHolder}
            className="form-control"
            id={this.props.id === undefined ? "logoText" : this.props.id}
            onChange={e => this.props.onChange(e.target.value)}
            value={this.props.value || ''}
          />
        </div>
      </div>
    );
  }
}
