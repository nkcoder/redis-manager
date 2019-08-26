import React from 'react';
import './App.css';
import { Layout, Menu, Icon } from 'antd';
import Overview from './components/overview/overview';
import Client from './components/client/client';
import Database from './components/database/database';
import History from './components/history/history';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

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

              <Menu.Item key='database'>
                <Icon type='database' />
                <span>Database</span>
                <Link to='/database' />
              </Menu.Item>

              <Menu.Item key='clients'>
                <Icon type='unordered-list' />
                <span>Clients</span>
                <Link to='/clients' />
              </Menu.Item>

              <Menu.Item key='history'>
                <Icon type='unordered-list' />
                <span>History</span>
                <Link to='/history' />
              </Menu.Item>

            </Menu>
          </Sider>

          <Layout style={{ marginLeft: 200 }}>
            <Header />
            <Content style={{ background: '#fff' }}>
              <Route exact path='/' component={Overview} />
              <Route path='/overview' component={Overview} />
              <Route path='/database' component={Database} />
              <Route path='/clients' component={Client} />
              <Route path='/history' component={History} />
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