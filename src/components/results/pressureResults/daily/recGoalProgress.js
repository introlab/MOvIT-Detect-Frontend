/**
 * @author Gabriel Boucher
 * @author Anne-Marie Desloges
 * @author Austin-Didier Tran
 * @author Benjamin Roy
 */

import React, { Component } from 'react';

import { ProgressBar } from 'primereact/components/progressbar/ProgressBar';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { T } from '../../../../utilities/translator';
import CustomCard from '../../../shared/card';
import { Tooltip } from 'primereact/components/tooltip/Tooltip';
import NoDataMessage from '../../../shared/noDataMessage';

class RecGoalProgress extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    condition: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    goalValue: PropTypes.number,
    recValue: PropTypes.number,
    tooltip: PropTypes.string,
    id: PropTypes.string,
    noDataUser: PropTypes.bool.isRequired,
    noDataClinician: PropTypes.bool.isRequired
  };

  render() {
    const style = {
      center: {
        textAlign: 'center',
      },
    };

    const header = (
      <div>
        <h3 style={style.center}>{this.props.title}
        {this.props.tooltip
          && <i id={`tiltLabel${this.props.id}`} className="fa fa-info-circle px-2" />
        }</h3>
      </div>
    );
    const noData = <NoDataMessage />;
    const user =  
    <div>
      <ProgressBar value={this.props.goalValue} />
      <p style={style.center}>
      {T.translate(`dailyResults.personal.description.${this.props.language}`,
        { percent: Math.round(this.props.goalValue) })}
      </p> 
    </div>
    
    const clinician = 
    <div>
      <ProgressBar value={this.props.recValue} />
      <p style={style.center}>
      {T.translate(`dailyResults.recommended.description.${this.props.language}`,
        { percent: Math.round(this.props.recValue) })}
      </p>
    </div>
    
    var element_user = this.props.noDataUser ? noData : user;
    var element_clinician = this.props.noDataClinician ? noData : clinician;

    const element = (
      <div>
        <h4>{T.translate(`dailyResults.personal.${this.props.language}`)}</h4>
        {element_user}
        <h4>{T.translate(`dailyResults.recommended.${this.props.language}`)}</h4>
        {element_clinician}
      </div>
    );

    return (
      <div>
        {this.props.condition
          && (
            <div>
              <CustomCard
                header={header}
                element={element}
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

function mapStateToProps(state) {
  return {
    language: state.applicationReducer.language,
  };
}

export default connect(mapStateToProps)(RecGoalProgress);
