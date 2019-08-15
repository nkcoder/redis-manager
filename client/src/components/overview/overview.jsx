import React, { Component } from 'react';
import RedisService from 'service/RedisService';

class Overview extends Component {

  state = {
    info: ''
  }

  componentDidMount() {
    this.fetchInfo();
  }

  async fetchInfo() {
    const { data } = await RedisService.info();
    this.setState({ info: data })
  }

  render() {
    return (
      <div>
        <code>{this.state.info}</code>
      </div>
    )
  }

}

export default Overview;