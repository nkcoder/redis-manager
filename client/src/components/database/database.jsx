import React, { Component } from 'react';
import RedisService from 'service/RedisService';
import { Button, Table, Empty, Input } from 'antd';
import './database.css';

const { Search } = Input;

class Database extends Component {

  constructor(props) {
    super(props);

    this.columns = [
      {
        key: 'rowKey',
        dataIndex: 'key',
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
            <Button type='primary' className='op-btn' onClick={() => this.getValue(record.rowKey, record.key)}>Get</Button>
            <Button type='ghost' className='op-btn' onClick={() => this.expireKey(record.key, 120)}>Expire</Button>
            <Button type='danger' className='op-btn' onClick={() => this.deleteKey(record.key)}>Delete</Button>
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
    this.loadKeys(query, nextCursor);
  }

  loadKeys = async (query, cursor) => {
    console.log('cursor: %i', cursor);
    const { newCursor, keys } = await this.doLoadKeys(query, cursor);

    console.log('allKeys, cursor: %s, data: %o', newCursor, keys);

    const tableData = keys.map((key, index) => (
      {
        rowKey: key + '-' + index,
        key: key,
        type: '-',
        value: '-'
      }
    ))

    this.setState({ tableData, nextCursor: newCursor, dataDone: newCursor === '0' });
  }

  doLoadKeys = async (key, cursor) => {
    const { data } = await RedisService.searchKey(key, cursor);
    console.log("data: ", data);
    return { newCursor: data.cursor, keys: data.keys };
  }

  getValue = async (rowKey, key) => {
    console.log('try to show value for key: %s', key);

    const { data } = await RedisService.fetchValue(key, 0);
    const { type, cursor, value } = data;

    console.log('newCursor: %s, type: %s, value: %o', cursor, type, value);

    const newData = [...this.state.tableData];
    const index = newData.findIndex(item => item.rowKey === rowKey);
    newData[index].type = type.toUpperCase();
    newData[index].value = value;

    this.setState({ tableData: newData, newCursor: cursor });
  }

  loadMoreKeys = async (query, cursor) => {
    const { newCursor, keys } = await this.doLoadKeys(query, cursor);
    console.log('load more data, lastCursor: %i, newCursor: %i, keys: %s', cursor, newCursor, keys);

    const newData = keys.map((item, index) => (
      {
        rowKey: item + '-' + index,
        key: item,
        type: '-',
        value: '-'
      }
    ));
    this.setState(
      {
        tableData: [...this.state.tableData, ...newData],
        nextCursor: newCursor,
        dataDone: newCursor === '0'
      }
    );
  }

  searchKey = async key => {
    const { data } = await RedisService.searchKey(key, 0);
    console.log('search key: %s, data: %s', key, data);

    const { cursor: newCursor, keys } = data;
    const newData = keys.map((key, index) => (
      {
        rowKey: key + '-' + index,
        key: key,
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

  expireKey = async (key, seconds) => {
    const { data } = await RedisService.expireKey(key, seconds);
    if (data.code !== 1) {
      alert("expire key failed, key not exist.");
    }
  }

  deleteKey = async keys => {
    const { data } = await RedisService.deleteKeys(keys);
    if (data.deleted !== keys.length) {
      console.warn("try to delete keys: %s, but only %i of them are deleted", keys, data.deleted);
    }
    this.loadKeys("", 0);
  }

  render() {
    return (
      <div style={{ padding: '10px 100px', width: '100%' }}>
        <div style={{ overflow: 'auto' }}>
          <span style={{ paddingBottom: '10px', width: '300', float: 'left' }}>
            <Search placeholder='search key' enterButton='Search' size='default' onSearch={value => this.searchKey(value)} maxLength='20' allowClear={true} />
          </span>
        </div>

        <Table columns={this.columns} dataSource={this.state.tableData} pagination={false} bordered={true} />
        <div style={{ textAlign: 'center', padding: '20px' }}>
          {
            this.state.dataDone ? <Empty description={<span>no more data</span>} /> : < Button type='primary' onClick={() => this.loadMoreKeys(this.state.query, this.state.nextCursor)}> Load More</Button>
          }
        </div>

      </div>
    )
  }

}

export default Database;