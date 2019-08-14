import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import './navbar.css';
import RedisService from '../../service/RedisService'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class NavBar extends React.Component {
  state = {
    collapsed: false,
    info: '',
    clients: [],
  }

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  }

  async fetch() {
    const { data } = await RedisService.info();
    const clients = await RedisService.clients();
    this.setState({ info: data, clients })
  }

  componentDidMount() {
    this.fetch();
  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className='logo' />

          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key='1'>
              <Icon type='info' />
              <span>Info</span>
            </Menu.Item>

            <Menu.Item key='2'>
              <Icon type='setting' />
              <span>Config</span>
            </Menu.Item>

            <SubMenu key='db'
              title={<span><Icon type='database' /><span>Database</span> </span>}>
              <Menu.Item key='db1'>
                <Icon type='database' />
                <span>String</span>
              </Menu.Item>
              <Menu.Item key='db2'>
                <Icon type='database' />
                <span>Hash</span>
              </Menu.Item>
              <Menu.Item key='db3'>
                <Icon type='database' />
                <span>Set</span>
              </Menu.Item>
            </SubMenu>

          </Menu>

        </Sider>

        <Layout>
          <Header />

          <Content>
            <div>
              {this.state.info}
            </div>
          </Content>

          <Footer style={{ textAlign: 'center' }}>
            Redis Admin @2019
          </Footer>

        </Layout>

      </Layout>
    )
  }


}

export default NavBar;