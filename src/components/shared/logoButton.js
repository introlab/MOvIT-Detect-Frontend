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
    // value: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    tooltip: PropTypes.string.isRequired,
    // onChange: PropTypes.func.isRequired,
  }

  render() {
    const style = {
      icon: {
        paddingTop: '6px',
        fontSize: 'large',
        minWidth: '26px',
      },

    };

    return ( // copied from logoText
      <div className="form-horizontal row mb-3">
        <div className="col-1 d-inline-block text-right"> {/* logo justified on the right of the logo column */}
          <span style={style.icon}><i className={this.props.iconClass} /></span>
        </div>
        <div className=" col-11 col-lg-8"> {/* block */}
        &nbsp;
          <Button
            onClick={() => this.props.onClick()}
            id="uselessBtn"
            type="button"
            className="p-button-secondary mb-2 mb-sm-0"
            label={this.props.btnText}
          />
          <label htmlFor="activeRecCheck" className="mt-1">{this.props.title}</label>
          {this.props.tooltip
            && (
              <i id={`textRecInfo${this.props.id}`} className="fa fa-info-circle pl-2" />
            )}
        </div>
        <Tooltip // copied from textRecommendation
          for={`#textRecInfo${this.props.id}`}
          title={this.props.tooltip}
        />
      </div>
    );
  }
}
