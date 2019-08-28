import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Overview from '../components/overview/Overview';
import Database from '../components/database/DataBase';
import ClientList from '../components/client/ClientList';
import ClientDetail from '../components/client/ClientDetail';
import History from '../components/history/History';

export const BaseRoute = () => {
  return (
    <Switch>
      <Route exact path='/' component={Overview} />
      <Route path='/overview' component={Overview} />
      <Route path='/database' component={Database} />

      <Route exact path='/client' component={ClientList} />
      <Route path='/client/:id' component={ClientDetail} />

      <Route path='/history' component={History} />
    </Switch >
  );

}