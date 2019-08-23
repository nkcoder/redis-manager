import React, { Component } from 'react';
import { Timeline, Pagination } from 'antd';

class History extends Component {

  constructor(props) {
    super(props);
    this.dataItems = [];
  }


  timelineData = () => {
    for (let i = 0; i < 100; i++) {
      this.dataItems.push(< Timeline.Item > item: {i}</Timeline.Item >);
    }
  }

  render() {
    this.timelineData();
    console.log('data times: ', this.dataItems);
    return (
      <div style={{ margin: 'auto', padding: '20px 0' }}>
        <Timeline mode='alternate' reverse='true'>
          {this.dataItems}
        </Timeline>
      </div>
    );
  }
}

export default History;