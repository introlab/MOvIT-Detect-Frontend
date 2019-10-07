/**
 * @author Charles Maheu
 * Logo, button and tooltip icon for the configuraion page
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'primereact/components/tooltip/Tooltip';
import { Button } from 'primereact/components/button/Button';
import { T } from '../../utilities/translator';

export default class logoButton extends Component {
  static propTypes = {
    btnText: PropTypes.string.isRequired,
    iconClass: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onClick: PropTypes.func.isRequired,
    tooltip: PropTypes.string.isRequired,
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
        <div className="col-8 col-lg-6 d-inline-block pr-1">
          <Button
            onClick={this.props.onClick}
            id="btn"
            type="button"
            className="p-button-secondary mb-2 mb-sm-0"
            label={this.props.btnText}
          />
          {this.props.tooltip
            && (
              <i id={`textRecInfo${this.props.id}`} className="fa fa-info-circle" />
            )}
          <Tooltip
            for={`#textRecInfo${this.props.id}`}
            title={this.props.tooltip}
          />
        </div>
        <div className="col-3 col-lg-2 d-inline-block pr-1">
          <input
            type="number"
            placeholder={this.props.placeHolder}
            className="form-control text-right"
            id="logoNumber"
            min={this.props.min || -90}
            max={this.props.max || 90}
            onChange={e => this.props.onChange(Number(e.target.value))}
            value={this.props.value}
          />
        </div>
      </div>
    );
  }
}
