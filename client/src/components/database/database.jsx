import React, { Component } from 'react';
import RedisService from '../../service/RedisService';
import { Button, Table, Input, Popconfirm, Select, Menu, Dropdown, message, Divider } from 'antd';
import './Database.css';
import { switchDatabase } from '../../redux/actions/switchDatabaseAction';
import { connect } from 'react-redux';

const { Search } = Input;
const { Option } = Select;

class Database extends Component {

  constructor(props) {
    super(props);

    this.columns = [
      {
        dataIndex: 'redisKey',
        title: 'Key',
        align: 'center',
      },
      {
        dataIndex: 'type',
        title: 'Type',
        align: 'center',
      },
      {
        dataIndex: 'value',
        title: 'Value',
        align: 'center',
      },
      {
        dataIndex: 'action',
        title: 'Action',
        align: 'center',
        render: (_, record) => {
          const menu = (
            <Menu>
              <Menu.Item onClick={() => this.expireKey(record.redisKey, 10)}><div>Expire in seconds</div></Menu.Item>
              <Menu.Item ><div>Persist (remove expire)</div></Menu.Item>
              <Menu.Item><div>TTL in seconds</div></Menu.Item>
            </Menu>
          );
          return (
            <div>
              <Button type='primary' className='op-btn' onClick={() => this.getValue(record.key, record.redisKey)}>Get</Button>
              <Popconfirm title='Sure to delete?' onConfirm={() => this.deleteKeys(record.redisKey)}>
                <Button type='danger' className='op-btn' >Delete</Button>
              </Popconfirm>
              <Dropdown overlay={menu} placement='bottomCenter'>
                <Button type='ghost'>More</Button>
              </Dropdown>
            </div>
          );
        }
      }
    ];

    this.rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}, selectedRows: ${JSON.stringify(selectedRows)}`);
        this.setState({ selectedRowRedisKeys: selectedRows.map(row => row.redisKey) });
        console.log(`selected redis keys: ${this.state.selectedRowRedisKeys}`);
      },
      getCheckboxProps: record => ({
        name: record.name,
        disabled: false
      }),
    }
  }

  state = {
    tableData: [],
    nextCursor: 0,
    dataDone: false,
    query: '',
    selectedRowRedisKeys: [],
  }

  componentDidMount() {
    const { query, nextCursor } = this.state;
    this.loadKeys(query, nextCursor);
  }

  loadKeys = async (query, cursor) => {
    console.log('cursor: %i', cursor);
    const { newCursor, keys } = await this.doLoadKeys(query, cursor);

    console.log('allKeys, cursor: %s, data: %o', newCursor, keys);

    const tableData = keys.map((key, index) => this.mapToTableRow(key, index));

    this.setState({ tableData, nextCursor: newCursor, dataDone: newCursor === '0' });
  }

  doLoadKeys = async (key, cursor) => {
    const { data } = await RedisService.searchKey(key, cursor);
    console.log("data: ", data);
    return { newCursor: data.cursor, keys: data.keys };
  }

  getValue = async (rowKey, key) => {
    console.log('try to show value for key: %s', key);

    const { data } = await RedisService.getValue(key, 0);
    const { type, cursor, value } = data;

    console.log('newCursor: %s, type: %s, value: %o', cursor, type, value);

    const newData = [...this.state.tableData];
    const index = newData.findIndex(item => item.key === rowKey);
    newData[index].type = type.toUpperCase();
    newData[index].value = value;

    this.setState({ tableData: newData, newCursor: cursor });
  }

  loadMoreKeys = async (query, cursor) => {
    const { newCursor, keys } = await this.doLoadKeys(query, cursor);
    console.log('load more data, lastCursor: %i, newCursor: %i, keys: %s', cursor, newCursor, keys);

    const newData = keys.map((key, index) => this.mapToTableRow(key, index));
    this.setState(
      {
        tableData: [...this.state.tableData, ...newData],
        nextCursor: newCursor,
        dataDone: newCursor === '0'
      }
    );
  }

  searchKey = async key => {
    const searchResult = [];
    let cursor = '0';
    do {
      const { data } = await RedisService.searchKey(key, cursor);
      const { cursor: newCursor, keys } = data;
      const currentResult = keys.map((key, index) => this.mapToTableRow(key, index));

      searchResult.push(...currentResult);
      cursor = newCursor;
    } while (searchResult.length < 30 && cursor !== '0');

    this.setState({
      tableData: searchResult,
      nextCursor: cursor,
      dataDone: cursor === '0',
      query: key
    })

  }

  expireKey = async (key, seconds) => {
    const { data } = await RedisService.expireKey(key, seconds);
    if (data.code !== 1) {
      alert("expire key failed, key not exist.");
    }
  }

  deleteKeys = async keys => {
    const { data } = await RedisService.deleteKeys(keys);
    if (data.deleted !== keys.length) {
      console.warn("try to delete keys: %s, but only %i of them are deleted", keys, data.deleted);
    }
    this.loadKeys("", 0);
    this.setState({ selectedRowRedisKeys: [] });
  }

  mapToTableRow = (key, index) => (
    {
      key: key + '-' + index,
      redisKey: key,
      type: '-',
      value: '-'
    }
  );

  switchDatabase = async index => {
    console.log(`switch database to: ${index}`)
    const { data, status } = await RedisService.switchDataBase(index);

    if (status === 200) {
      console.log(`switch db to ${index} done.`);
      this.loadKeys('', '0');
      this.props.switchDatabase(index);
      message.success(`switch to db: ${index}`);
    } else {
      message.warn(`switch to db: ${index} failed, reason: ${data.message}`)
    }


  }

  render() {
    let deleteButton;
    const { selectedRowRedisKeys } = this.state;
    if (selectedRowRedisKeys.length > 0) {
      deleteButton =
        <Popconfirm title='Are you sure to DELETE these keys?' onConfirm={() => this.deleteKeys(selectedRowRedisKeys)}>
          <Button type='danger'>Delete</Button>
        </Popconfirm>
    } else {
      deleteButton = <span></span>
    }
    return (
      <div style={{ padding: '10px 100px', width: '100%' }}>
        <div style={{ overflow: 'auto', paddingBottom: '10px' }}>

          <div style={{ display: 'inline' }}>
            <b>Select Database: </b>
            <Select defaultValue='0' style={{ width: '70px', padding: '0 10px' }} onChange={this.switchDatabase}>
              <Option value='0'>0</Option>
              <Option value='1'>1</Option>
              <Option value='2'>2</Option>
              <Option value='3'>3</Option>
              <Option value='4'>4</Option>
            </Select>
          </div>

          <Button type='primary' style={{ paddingRight: '10px' }}>Add key</Button>

          <Divider type='vertical' />

          <Search placeholder='search key' enterButton='Search' size='default' onSearch={value => this.searchKey(value)} maxLength='30' allowClear={true} style={{ maxWidth: '30%', paddingRight: '10px' }} />

          {deleteButton}
        </div>

        <Table columns={this.columns} dataSource={this.state.tableData} pagination={true} bordered={true} rowSelection={this.rowSelection} />
        <div style={{ textAlign: 'center', padding: '20px' }}>
          {
            !this.state.dataDone && < Button type='primary' onClick={() => this.loadMoreKeys(this.state.query, this.state.nextCursor)}> Load More</Button>
          }
        </div>

      </div >
    )
  }

}

// export default Database;
export default connect(
  null,
  { switchDatabase }
)(Database);