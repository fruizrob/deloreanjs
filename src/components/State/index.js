import React, { Component } from 'react';

import DependencyItem from '../DependencyItem';
import StateBar from '../StateBar';
import { breakpoint } from '../../core/delorean';
import './styles.css';

class State extends Component {
  componentWillUpdate = () => {
    if (breakpoint.activate) this.props.appStore.selectTimepointById(breakpoint.id);
  };

  render() {
    const {
      selectedTimePoint,
      dependencies,
      timePointValues,
      displayedObjectsDOM,
      displayedObjectsNames,
    } = this.props.appStore.state;
    const { toggleObject } = this.props.appStore;
    const { invokeContinuation } = this.props;

    return (
      <div className="state-panel-container">
        <div className="state-container">
          <StateBar appStore={this.props.appStore} invokeContinuation={invokeContinuation} />

          <div className="state-values-container">
            {selectedTimePoint === ''
              ? dependencies.map((dependency) => {
                  return (
                    <div key={dependency.name} className="state-values">
                      <p>
                        {dependency.type !== 'loop' ? dependency.name : dependency.name + ' (loop)'}
                      </p>
                    </div>
                  );
                })
              : dependencies.map((dependency) => {
                  let element = timePointValues[dependency.name];
                  return (
                    <DependencyItem
                      key={dependency.name}
                      element={element}
                      name={dependency.name}
                      type={dependency.type}
                      timePointValues={timePointValues}
                      toggleObject={toggleObject}
                      displayedObjectsNames={displayedObjectsNames}
                      displayedObjectsDOM={displayedObjectsDOM}
                    />
                  );
                })}
          </div>
        </div>
      </div>
    );
  }
}

export default State;
