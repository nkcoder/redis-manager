import React from 'react';
import './App.css';
import RedisService from './service/RedisService';
import { Layout, Menu, Icon } from 'antd';
import Info from './components/info/info';
import Setting from './components/setting/setting';
import Database from './components/database/database';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu

class App extends React.Component {
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
      <Router>

        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
            <div className='logo' />

            <Menu theme="dark" defaultSelectedKeys={['info']} mode="inline">
              <Menu.Item key='info'>
                <Icon type='info' />
                <span>Info</span>
                <Link to='/info' />
              </Menu.Item>

              <Menu.Item key='setting'>
                <Icon type='setting' />
                <span>Config</span>
                <Link to='/setting' />
              </Menu.Item>

              <Menu.Item key='database'>
                <Icon type='database' />
                <span>Database</span>
                <Link to='/database' />
              </Menu.Item>

              <SubMenu key='cluster'
                title={<span><Icon type='cluster' /><span>Cluster</span> </span>}>
                <Menu.Item key='cluster-topology'>
                  <Icon type='cluster' />
                  <span>Topology</span>
                  <Link to='/cluster/topology' />
                </Menu.Item>
                <Menu.Item key='cluster-failover'>
                  <Icon type='cluster' />
                  <span>Failover</span>
                  <Link to='/cluster/failover' />
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>

          <Layout>
            <Header />
            <Content>
              <Route exact path='/' component={Info} />
              <Route path='/info' component={Info} />
              <Route path='/setting' component={Setting} />
              <Route path='/database' component={Database} />
            </Content>

            <Footer style={{ textAlign: 'center' }}>
              Redis Admin @2019
          </Footer>

          </Layout>

        </Layout>

      </Router>
    )
  }

}

export default App;
