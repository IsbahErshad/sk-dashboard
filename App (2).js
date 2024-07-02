import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Navigation from './components/Navbar';
import Register from '/components/Auth/Register';
import Login from './components/Auth/Login';
import DataList from './components/Data/DataList';
import DataForm from './components/Data/DataForm';
import PrivateRoute from './PrivateRoute';

const App = () => {
  return (
    <>
      <Navigation />
      <div className="container mt-4">
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <PrivateRoute exact path="/" component={DataList} />
          <PrivateRoute path="/add" component={DataForm} />
          <PrivateRoute path="/edit/:id" component={DataForm} />
        </Switch>
      </div>
    </>
  );
};

export default App;
