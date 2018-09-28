import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import PreviewHomePage from './pages/PreviewHomePage';
import HomePage from './pages/HomePage';
import RenterPropertyPage from './pages/RenterPropertyPage';
import OwnerPage from './OwnerPage';
import CalendarPage from './pages/CalendarPage';
import LoginModal from './modals/LoginModal';
import BasicInfoModal from './modals/BasicInfoModal';
import AgentRequestModal from './modals/AgentRequestModal';
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
      modalData: null
    };

    this.fetchUser = this.fetchUser.bind(this);
    this.getAuthenticationState = this.getAuthenticationState.bind(this);
    this.setModalState = this.setModalState.bind(this);
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
        [ModalState.AGENT_REQUEST]: AgentRequestModal
      };
      let Modal = modalStateMap[modalState];
      return <Modal {...context} modalData={modalData} />;
    }
  }

  render() {
    let { user, authState, modalState } = this.state;
    if (authState === AuthenticationState.INDETERMINED) {
      return null;
    }
    let { fetchUser, setModalState } = this;
    let context = { user, authState, modalState, fetchUser, setModalState };
    console.log(context);
    return (
      <Context.Provider value={context}>
        <Router>
          <div>
            <NavBar {...context} />
            {this.getModal(context)}
            {this.state.authState !== AuthenticationState.FULL ?
              <Switch>
                <Route exact path="/" component={PreviewHomePage} />
                <Route render={() => <Redirect to='/' />} />
              </Switch>
              :
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/renter/:propertyId" component={RenterPropertyPage} />
                <Route exact path="/owner" component={OwnerPage} />
                <Route exact path="/calendar" component={CalendarPage} />
                <Route component={NoMatch} />
              </Switch>
            }
          </div>
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
