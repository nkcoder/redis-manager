import React, { Component } from 'react';
import RedisService from 'service/RedisService';
import { Button, Table, Empty, Input } from 'antd';
const { Search } = Input;

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
    tableData: [],
    nextCursor: 0,
    dataDone: false,
    query: ''
  }

  componentDidMount() {
    const { query, nextCursor } = this.state;
    this.fetchKeys(query, nextCursor);
  }

  fetchKeys = async (query, cursor) => {
    console.log('cursor: %i', cursor);
    const { newCursor, keys } = await this.doFetchKeys(query, cursor);

    console.log('allKeys, cursor: %s, data: %o', newCursor, keys);

    const tableData = keys.map((key, index) => (
      {
        key: key + '-' + index,
        rkey: key,
        type: '-',
        value: '-'
      }
    ))

    this.setState({ tableData, nextCursor: newCursor, dataDone: newCursor === '0' });
  }

  doFetchKeys = async (key, cursor) => {
    const { data } = await RedisService.searchKey(key, cursor);
    console.log("data: ", data);
    return { newCursor: data.cursor, keys: data.keys };
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

    this.setState({ tableData: newData, newCursor: newCursor });
  }

  loadMoreData = async (query, cursor) => {
    const { newCursor, keys } = await this.doFetchKeys(query, cursor);
    console.log('load more data, lastCursor: %i, newCursor: %i, keys: %s', cursor, newCursor, keys);

    const newData = keys.map((item, index) => (
      {
        key: item + '-' + index,
        rkey: item,
        type: '-',
        value: '-'
      }
    ));
    this.setState({ tableData: [...this.state.tableData, ...newData], nextCursor: newCursor, dataDone: newCursor === '0' });
  }

  handleSearchKey = async key => {
    const { data } = await RedisService.searchKey(key, 0);
    console.log('search key: %s, data: %s', key, data);

    const { cursor: newCursor, keys } = data;
    const newData = keys.map((key, index) => (
      {
        key: key + '-' + index,
        rkey: key,
        type: '-',
        value: '-'
      }
    ))

    this.setState({
      tableData: newData,
      nextCursor: newCursor,
      dataDone: newCursor === '0',
      query: key
    })

  }

  handleRefresh = () => {
    this.fetchKeys('', 0);
  }

  render() {
    return (
      <div style={{ padding: '10px 100px', width: '100%' }}>
        <div style={{ overflow: 'auto' }}>
          <span style={{ paddingBottom: '10px', width: '300', float: 'left' }}>
            <Search placeholder='search key' enterButton='Search' size='default' onSearch={value => this.handleSearchKey(value)} maxLength='20' allowClear={true} />
          </span>

          <span style={{ paddingBottom: '10px', float: 'right' }}>
            <Button type='ghost' onClick={() => this.handleRefresh()}>Refresh</Button>
          </span>
        </div>


        <Table columns={this.columns} dataSource={this.state.tableData} pagination={false} bordered={true} />
        <div style={{ textAlign: 'center', padding: '20px' }}>
          {
            this.state.dataDone ? <Empty description={<span>no more data</span>} /> : < Button type='primary' onClick={() => this.loadMoreData(this.state.query, this.state.nextCursor)}> Load More</Button>
          }
        </div>

      </div>
    )
  }

}

export default Database;