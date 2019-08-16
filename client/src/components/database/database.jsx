import React, { Component } from 'react';
import { Button, Table, Divider } from 'antd';
import RedisService from 'service/RedisService';

class Database extends Component {

  constructor(props) {
    super(props);

    this.columns = [
      {
        key: 'rkey',
        dataIndex: 'rkey',
        title: 'Key',
        align: 'center',
      },
      {
        key: 'type',
        dataIndex: 'type',
        title: 'Type',
        align: 'center',
      },
      {
        key: 'value',
        dataIndex: 'value',
        title: 'Value',
        align: 'center',
      },
      {
        key: 'action',
        dataIndex: 'action',
        title: 'Action',
        align: 'center',
        render: (text, record) => (
          <div>
            <Button type='primary' size='small' onClick={() => this.showValue(record)}>Fetch</Button>
          </div>
        )
      }
    ];
  }

  state = {
    tableData: []
  }

  componentDidMount() {
    this.fetchKeys(0);
  }

  fetchKeys = async (cursor) => {
    const { data: responseData } = await RedisService.allKeys(cursor);
    const { cursor: newCursor, keys } = responseData;
    console.log('allKeys, cursor: %s, data: %o', newCursor, keys);

    const tableData = keys.map((key, index) => (
      {
        key: index,
        rkey: key,
        type: '-',
        value: '-'
      }
    ))

    this.setState({ tableData });
  }

  showValue = async record => {
    console.log('try to show value for record: ', record);

    const { data } = await RedisService.fetchValue(record.rkey, 0);
    const { cursor: newCursor, type, value } = data;

    console.log('newCursor: %i, type: %s, value: %o', newCursor, type, value);

    const newData = [...this.state.tableData];
    const index = newData.findIndex(item => item.key === record.key);
    newData[index].type = type.toUpperCase();
    newData[index].value = value;

    this.setState({ tableData: newData });
  }

  render() {
    return (
      <div style={{ padding: '40px' }}>
        <Table columns={this.columns} dataSource={this.state.tableData} pagination={false} bordered={true} />
      </div>
    )
  }

}

export default Database;