import React, { useEffect, useCallback, useState } from 'react';
import TimepointList from '../TimepointList';
import Timepoint from './Timepoint';
import Timestamps from './Timestamps';
import Element from './Element';
import './styles.css';
import SimpleBar from 'simplebar-react';

export default function Timeline(props) {
  const { store, getEndTimes } = props;
  let time = getEndTimes();
  const { state } = store;
  const { snapshots } = state;
  const [timelineList, setTimelineList] = useState([]);
  const [endTimesList, setEndTimesList] = useState([]);

  useEffect(() => {
    if (Boolean(snapshots.length)) {
      let timeline = [...snapshots];
      setTimelineList((timelineList) => [...timelineList, timeline]);

      let endTime = getEndTimes();
      setEndTimesList((endTimesList) => [...endTimesList, endTime]);
    } else {
      setTimelineList([]);
      setEndTimesList([]);
    }
  }, [time, snapshots.length]);

  const renderTimeline = useCallback(
    (snapshots, timelineIdx) => {
      let lastTimestamp = 0;
      return (
        <section key={timelineIdx} className="timeline-container">
          {timelineIdx === 0 && <Element title="Start" classNames="timeline-start-container" />}
          {snapshots.map((snapshot, index) => {
            const { timePointTimestamp, timeLineId } = snapshot;
            if (timelineIdx <= timeLineId) {
              let marginLeft =
                timelineIdx > 0
                  ? (timePointTimestamp - lastTimestamp) * 5
                  : (timePointTimestamp - lastTimestamp - 1) * 5;
              lastTimestamp = snapshot.timePointTimestamp;
              return (
                <Timepoint
                  key={index}
                  store={store}
                  snapshot={snapshot}
                  enable={Boolean(timelineIdx === snapshot.timeLineId)}
                  marginLeft={marginLeft}
                />
              );
            }
          })}
          <Element
            title="End"
            classNames="timeline-start-container timeline-end-container"
            marginLeft={(endTimesList[0] - lastTimestamp) * 5}
          />
        </section>
      );
    },
    [timelineList],
  );

  return (
    <section className="timeline-viewer-container">
      <TimepointList store={store} />
      <div className="timeline-viewer">
        {Boolean(timelineList.length) ? (
          <div className="timeline-list-container">
            <SimpleBar style={{ height: '100%' }}>
              <Timestamps endTime={endTimesList[0] + 10} />
              {timelineList.map(renderTimeline)}
            </SimpleBar>
          </div>
        ) : (
          <div className="timeline-viewer-without-timelines">
            <span>Run the code to start tracking timepoints</span>
          </div>
        )}
      </div>
    </section>
  );
}
