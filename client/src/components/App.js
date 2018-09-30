import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import HomePage from './pages/HomePage';
import RenterPropertyPage from './pages/RenterPropertyPage';
import StatusPage from './pages/StatusPage';
import OwnerPage from './OwnerPage';
import CalendarPage from './pages/CalendarPage';
import LoginModal from './modals/LoginModal';
import BasicInfoModal from './modals/BasicInfoModal';
import ViewAgentModal from './modals/ViewAgentModal';
import LinkRequestModal from './modals/LinkRequestModal';
import NavBar from './NavBar';
import Context from './Context';

import { AuthenticationState, ModalState } from '../enums';

import './App.css'

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      authState: AuthenticationState.INDETERMINED,
      modalState: ModalState.NONE,
      logoutActions: {}
    };

    this.fetchUser = this.fetchUser.bind(this);
    this.getAuthenticationState = this.getAuthenticationState.bind(this);
    this.setModalState = this.setModalState.bind(this);
    this.setLogoutAction = this.setLogoutAction.bind(this);
  }

  componentDidMount() {
    this.fetchUser();
  }

  getAuthenticationState(user) {
    if (user === null) {
      return AuthenticationState.INDETERMINED;
    } else if (!user.found) {
      return AuthenticationState.NOT_LOGGED_IN;
    } else if (user.name && user.email && user.dateOfBirth) {
      return AuthenticationState.FULL;
    } else {
      return AuthenticationState.NEED_INFO;
    }
  }

  fetchUser() {
    fetch('/auth/get_user', {
      method: 'GET',
      credentials: 'include'
    }).then(res => res.json()).then(user => {
      let authState = this.getAuthenticationState(user);
      let modalState = ModalState.NONE;
      if (authState === AuthenticationState.NEED_INFO) { // If user hasn't provided necessary information yet, ask with modal
        modalState = ModalState.BASIC_INFO;
      }
      this.setState({ user, authState, modalState });
    });
  }

  setModalState(modalState, modalData) {
    if (this.state.authState == AuthenticationState.NEED_INFO) {
      modalState = ModalState.BASIC_INFO;
    }
    this.setState({ modalState, modalData });
  }

  getModal(context) {
    let { modalState, modalData } = this.state;
    if (modalState === ModalState.NONE) {
      return null;
    } else {
      const modalStateMap = {
        [ModalState.LOGIN]: LoginModal,
        [ModalState.BASIC_INFO]: BasicInfoModal,
        [ModalState.VIEW_AGENT]: ViewAgentModal,
        [ModalState.LINK_REQUEST]: LinkRequestModal
      };
      let Modal = modalStateMap[modalState];
      return <Modal modalData={modalData} {...context} />;
    }
  }

  setLogoutAction(key, action) {
    let logoutActions = Object.assign({}, this.state.logoutActions);
    if (action) {
      logoutActions[key] = action;
    } else {
      delete logoutActions[key];  
    }
    this.setState({ logoutActions });
  }

  render() {
    let { user, authState, modalState, logoutActions } = this.state;
    if (authState === AuthenticationState.INDETERMINED) {
      return null;
    }
    let { fetchUser, setModalState, setLogoutAction } = this;
    let context = { user, authState, modalState, logoutActions, setLogoutAction, fetchUser, setModalState };
    return (
      <Context.Provider value={context}>
        <Router>
          <Fragment>
            <NavBar {...context} />
            {this.getModal(context)}
            <Switch>
              <Route exact path="/" render={() => <Redirect to='/home' />} />
              <Route exact path="/home" component={HomePage} />
              {authState === AuthenticationState.NOT_LOGGED_IN ? <Route render={() => <Redirect to='/' />} /> : null}

              <Route path="/renter/:propertyId" component={RenterPropertyPage} />
              <Route exact path="/owner" component={OwnerPage} />
              <Route exact path="/status" component={StatusPage} />
              <Route exact path="/calendar" component={CalendarPage} />
              <Route component={NoMatch} />
            </Switch>
          </Fragment>
        </Router>
      </Context.Provider>
    );
  }
}

const NoMatch = ({ location }) => (
  <div>
    <h3>No match for ${location.pathname}</h3>
  </div>
);
