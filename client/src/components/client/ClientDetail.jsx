import React, { Component } from 'react';
import { Descriptions } from 'antd';
import RedisService from '../../service/RedisService';

class ClientDetail extends Component {

  state = {
    clientDetail: {}
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.getClients(id);
  }

  async getClients(id) {
    const { data: clients } = await RedisService.clients();
    const clientDetail = clients.find(c => c.id === id);
    this.setState({ clientDetail });
  }

  render() {
    const { id, addr, name, age, idle, flags, db, multi, qbuf, fd, sub, psub, obl, oll, omem, events, cmd } = this.state.clientDetail;
    return (
      <div style={{ maxWidth: '80%', margin: '30px auto' }}>
        <Descriptions title='Client Detail' bordered column={2} style={{ textAlign: 'center' }}>
          <Descriptions.Item label='ID' >{id}</Descriptions.Item>
          <Descriptions.Item label='NAME'>{name}</Descriptions.Item>
          <Descriptions.Item label='ADDRESS'>{addr}</Descriptions.Item>
          <Descriptions.Item label='AGE'>{age}</Descriptions.Item>
          <Descriptions.Item label='IDLE'>{idle}</Descriptions.Item>
          <Descriptions.Item label='FLAGS'>{flags}</Descriptions.Item>
          <Descriptions.Item label='DB'>{db}</Descriptions.Item>
          <Descriptions.Item label='MULTI'>{multi}</Descriptions.Item>
          <Descriptions.Item label='FD'>{fd}</Descriptions.Item>
          <Descriptions.Item label="QBUF">{qbuf}</Descriptions.Item>
          <Descriptions.Item label="SUB">{sub}</Descriptions.Item>
          <Descriptions.Item label="PSUB">{psub}</Descriptions.Item>
          <Descriptions.Item label="OBL">{obl}</Descriptions.Item>
          <Descriptions.Item label="OLL">{oll}</Descriptions.Item>
          <Descriptions.Item label="OMEM">{omem}</Descriptions.Item>
          <Descriptions.Item label="EVENTS">{events}</Descriptions.Item>
          <Descriptions.Item label="CMD">{cmd}</Descriptions.Item>
        </Descriptions >
      </div>
    )
  }
}

export default ClientDetail;