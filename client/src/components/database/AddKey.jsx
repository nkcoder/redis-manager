import React, { Component } from 'react';
import { Select, Divider, Input, Button } from 'antd';
const { Option } = Select
const { TextArea } = Input

const keyTypes = ["string", 'hash', 'list', 'set', 'zset'];

class AddKey extends Component {

  state = {
    type: keyTypes[0]
  }

  handleKeyTypeChange = type => {
    this.setState( { type } );
  }

  showAddView = () => {
    const { type } = this.state;

    switch ( type ) {
      case 'string':
        return (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ float: 'left', width: '12%' }}>key: </h3>
              <TextArea style={{ maxWidth: '80%' }} placeholder='the name of the key' autosize={{ minRows: 1, maxRows: 3 }}></TextArea>
            </div>
            <div>
              <h3 style={{ float: 'left', width: '12%' }} > value: </h3>
              <TextArea style={{ maxWidth: '80%' }} placeholder='the value of the key' autosize={{ minRows: 1, maxRows: 5 }}></TextArea>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px auto' }}>
              <Button>Reset</Button>
              <span style={{ padding: '10px' }} />
              <Button>Submit</Button>
            </div>
          </div >
        );
      default: 
        break;
    }
  }

  render() {
    return (
      <div style={{ maxWidth: '40%', margin: '20px auto' }}>
        <h3 style={{ float: 'left', width: '12%' }}>Type: </h3>
        <Select defaultValue={keyTypes[0]} style={{ width: '80px' }} onChange={this.handleKeyTypeChange}>
          {
            keyTypes.map( type => (
              <Option key={type}>{type}</Option>
            ) )
          }
        </Select>

        <Divider type='horizontal' />

        {this.showAddView()}

      </div>
    )
  }

}

export default AddKey;