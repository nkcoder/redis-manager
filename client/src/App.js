import React from 'react';
import './App.css';
import { Layout, Menu, Icon } from 'antd';

import { BrowserRouter as Router, Link } from "react-router-dom";
import { BaseRoute } from './route';

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
                <Link to='/client' />
              </Menu.Item>

              <Menu.Item key='history'>
                <Icon type='history' />
                <span>History</span>
                <Link to='/history' />
              </Menu.Item>

            </Menu>
          </Sider>

          <Layout style={{ marginLeft: 200 }}>
            <Header />
            <Content style={{ background: '#fff' }}>
              <BaseRoute />
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