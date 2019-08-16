import React, { Component } from 'react';
import RedisService from 'service/RedisService';
import { Row, Col, Card, Table, Divider } from 'antd';

class Overview extends Component {

  constructor(props) {
    super(props);

    this.columns = [
      {
        title: 'Property',
        dataIndex: 'property',
        key: 'property',
        align: 'center'
      },
      {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
        align: 'center'
      }
    ]
  }

  state = {
    server: [],
    client: [],
    memory: [],
    persistence: []
  }

  componentDidMount() {
    this.fetchInfo();
  }

  async fetchInfo() {
    const { data } = await RedisService.info();
    console.log('data: ', data);

    this.fillServerInfo(data);
    this.fillClientInfo(data);
    this.fillMemoryInfo(data);
    this.fillPersistenceInfo(data);
  }

  fillServerInfo = info => {
    const server = [
      {
        key: '1',
        property: 'Redis Version',
        value: info.Server.redis_version
      },
      {
        key: '2',
        property: 'Redis Mode',
        value: info.Server.redis_mode
      },
      {
        key: '3',
        property: 'TCP Port',
        value: info.Server.tcp_port
      },
      {
        key: '4',
        property: 'Uptime In Days',
        value: info.Server.uptime_in_days
      }
    ];

    this.setState({ server })
  }

  fillClientInfo = info => {
    const client = [
      {
        key: '1',
        property: 'Connected Clients',
        value: info.Clients.connected_clients
      },
      {
        key: '2',
        property: 'Blocked Clients',
        value: info.Clients.blocked_clients
      }
    ]
    this.setState({ client });
  }

  fillMemoryInfo = info => {
    const memory = [
      {
        key: 1,
        property: 'Max Memory',
        value: info.Memory.maxmemory_human
      },
      {
        key: 2,
        property: 'Max Memory Policy',
        value: info.Memory.maxmemory_policy
      },
      {
        key: 3,
        property: 'Memory Fragmentation Ratio',
        value: info.Memory.mem_fragmentation_ratio
      },
      {
        key: 4,
        property: 'Total System Memory',
        value: info.Memory.total_system_memory_human
      },
      {
        key: 5,
        property: 'Used Memory',
        value: info.Memory.used_memory_human
      },
      {
        key: 6,
        property: 'Used Memory RSS',
        value: info.Memory.used_memory_rss_human
      }
    ];
    this.setState({ memory });
  }

  fillPersistenceInfo = info => {
    const persistence = [
      {
        key: '1',
        property: 'AOF Enabled',
        value: info.Persistence.aof_enabled,
      },
      {
        key: '2',
        property: 'AOF Last Rewrite Status',
        value: info.Persistence.aof_last_write_status
      },
      {
        key: '3',
        property: 'AOF Last Rewrite Status',
        value: info.Persistence.aof_last_write_status
      },
      {
        key: '4',
        property: 'AOF Last Bgwrite Status',
        value: info.Persistence.aof_last_bgrewrite_status
      },
      {
        key: '5',
        property: 'AOF Last Bgwrite Status',
        value: info.Persistence.aof_last_bgrewrite_status
      },
      {
        key: '6',
        property: 'RDB Last Bgsave Status',
        value: info.Persistence.rdb_last_bgsave_status
      },
      {
        key: '7',
        property: 'RDB Last Save Time',
        value: new Date(info.Persistence.rdb_last_save_time * 1000).toDateString()
      },
    ];

    this.setState({ persistence });

  }

  render() {
    return (
      <div>
        <div style={{ padding: '50px' }}>
          <Row gutter={100}>
            <Col span={12}>
              <Card title='Server' bordered={true} hoverable={true} size='small' headStyle={{ textAlign: 'center' }}>
                <Table dataSource={this.state.server} columns={this.columns} showHeader={false} pagination={false} bordered={true} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title='Client' bordered={true} hoverable={true} size='small' headStyle={{ textAlign: 'center' }}>
                <Table dataSource={this.state.client} columns={this.columns} showHeader={false} pagination={false} bordered={true} />
              </Card>
            </Col>
          </Row>

          <Divider type='horizontal' />

          <Row gutter={100}>
            <Col span={12}>
              <Card title='Memory' bordered={true} hoverable={true} size='small' headStyle={{ textAlign: 'center' }}>
                <Table dataSource={this.state.memory} columns={this.columns} showHeader={false} pagination={false} bordered={true} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title='Persistence' bordered={true} hoverable={true} size='small' headStyle={{ textAlign: 'center' }}>
                <Table dataSource={this.state.persistence} columns={this.columns} showHeader={false} pagination={false} bordered={true} />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    )
  }

}

export default Overview;