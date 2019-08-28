import React, { Component } from 'react';
import { Table, Button } from 'antd';
import RedisService from '../../service/RedisService';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getClients } from '../../redux/actions/getClientsAction';

class ClientList extends Component {

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
        render: (_, record) => (
          <div>
            <Link to={`/client/${record.id}`}>Detail</Link>
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
    this.fetchClients().then(_ => this.props.getClients(this.state.clients));
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

export default connect(null, { getClients })(ClientList);