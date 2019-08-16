import React, { Component } from 'react';
import { Table, Divider, Button, Popconfirm, Modal } from 'antd';
import RedisService from 'service/RedisService';

class Client extends Component {

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center'
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        align: 'center'
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        align: 'center'
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        align: 'center'
      },
      {
        title: 'Action',
        key: 'action',
        align: 'center',
        render: (text, record) => (
          <div>
            <Button type='primary' onClick={this.showDetail}>Detail</Button>
            <Modal title='Client Info' visible={this.state.detailVisible} onOk={this.handleDetailOk} onCancel={this.handleDetailCancel}>
              <code>{JSON.stringify(this.state.clients.filter(c => c.id === text.id))}</code>
            </Modal>

            <Divider type='vertical' />

            <Popconfirm title='Sure to KILL?' onConfirm={() => this.handleKill(record.key)}>
              <Button type='danger'>KILL</Button>
            </Popconfirm>

          </div>
        )
      },
    ]
  }

  state = {
    clients: [],
    columnData: [],
    detailVisible: false
  }

  componentDidMount() {
    this.fetchClients();
  }

  async fetchClients() {
    const { data: clients } = await RedisService.clients();
    console.log('clients: ', clients);

    const dataToShow = clients.map(client => (
      {
        key: client.id,
        id: client.id,
        name: client.name,
        address: client.addr,
        age: client.age
      }
    ));

    this.setState({ clients, columnData: dataToShow });
  }

  handleRefresh = () => {
    this.fetchClients();
  }

  handleKill = key => {
    console.warn('try to kill client: ', key);
  }

  showDetail = () => {
    console.log('show detail');
    this.setState({ detailVisible: true });
  }

  handleDetailOk = () => {
    this.setState({ detailVisible: false });
  }

  handleDetailCancel = () => {
    this.setState({ detailVisible: false });
  }


  render() {
    return (
      <div style={{ padding: '40px' }}>
        <div style={{ paddingBottom: '10px', textAlign: 'left' }}>
          <Button type='primary' onClick={() => this.handleRefresh()}>Refresh</Button>
        </div>
        <Table columns={this.columns} dataSource={this.state.columnData} bordered={true} />
      </div >
    )
  }

}

export default Client;