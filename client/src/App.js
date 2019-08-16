import React from 'react';
import './App.css';
import { Layout, Menu, Icon } from 'antd';
import Overview from './components/overview/overview';
import Client from './components/client/client';
import Database from './components/database/database';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu

class App extends React.Component {
  state = {
    collapsed: false,
  }

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  }

  render() {
    return (
      <Router>

        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: '0' }}>
            <div className='logo' />

            <Menu theme="dark" defaultSelectedKeys={['overview']} mode="inline">
              <Menu.Item key='overview'>
                <Icon type='info-circle' />
                <span>Overview</span>
                <Link to='/overview' />
              </Menu.Item>

              <Menu.Item key='clients'>
                <Icon type='unordered-list' />
                <span>Clients</span>
                <Link to='/clients' />
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

          <Layout style={{ marginLeft: 200 }}>
            <Header />
            <Content style={{ background: '#fff' }}>
              <Route exact path='/' component={Overview} />
              <Route path='/overview' component={Overview} />
              <Route path='/clients' component={Client} />
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
