/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin Didier Tran
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'primereact/components/chart/Chart';
import CustomCard from '../../../shared/card';
import { getElement } from '../../../../utilities/loader';
import { Tooltip } from 'primereact/components/tooltip/Tooltip';


export default class RecGoalChart extends Component {
  static propTypes = {
    condition: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    goalTitle: PropTypes.string.isRequired,
    recTitle: PropTypes.string.isRequired,
    goalData: PropTypes.object,
    recData: PropTypes.object,
    isLoaded: PropTypes.bool.isRequired,
    hasErrors: PropTypes.bool.isRequired,
    options: PropTypes.object,
    tooltip: PropTypes.string,
    id: PropTypes.string,
  }
/*
  shouldComponentUpdate() {
    return false;
  }*/

  //hover(e) {
    /* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["e"] }] */
  //  e.target.style.cursor = 'pointer';
  //}

  render() {
    const style = {
      center: {
        textAlign: 'center',
      },
    };


    const header = (
      <div className="ui-card-title"> 
        <h2 style = {style.center}>
        {this.props.title}
        {this.props.tooltip
          && <i id={`tiltLabel${this.props.id}`} className="fa fa-info-circle px-2" />
        }</h2>
        <h5 style = {style.center}> {this.props.subtitle} </h5>
      </div>
    );

/*
    const header = (
      <div className="ui-card-title">
      <h2 style={style.center}>{this.props.title}</h2>
      {this.props.tooltip
        && <i id={`tiltLabel${this.props.id}`} className="fa fa-info-circle px-2" />
      }
      </div>
    );*/

    const chart = (
      <div>
        <h4>{this.props.goalTitle}</h4>
        <Chart type="bar" data={this.props.goalData} options={this.props.options} />
        <hr />
        <h4>{this.props.recTitle}</h4>
        <Chart type="bar" data={this.props.recData} options={this.props.options} />
      </div>
    );

    return (
      <div>
        {this.props.condition
          && (
          <div>
            <CustomCard
              header={header}
              element={getElement(this.props.isLoaded, this.props.hasErrors, chart)}
            />
            <Tooltip
              for={`#tiltLabel${this.props.id}`}
              title={this.props.tooltip}
            />
          </div>
          )
        }
      </div>
    );
  }
}
