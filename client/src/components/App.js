import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import PreviewHomePage from './pages/PreviewHomePage';
import HomePage from './pages/HomePage';
import OwnerPage from './OwnerPage';
import LoginModal from './modals/LoginModal';
import BasicInfoModal from './modals/BasicInfoModal';
import NavBar from './NavBar';
import Context from './Context';

import { AuthenticationState, ModalState } from '../enums';

import './App.css'

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            authState: AuthenticationState.NONE,
            modalState: ModalState.NONE
        };

        this.fetchUser = this.fetchUser.bind(this);
        this.getAuthenticationState = this.getAuthenticationState.bind(this);
        this.setModalState = this.setModalState.bind(this);
    }

    componentDidMount() {
        this.fetchUser();
    }

    getAuthenticationState(user) {
        if (!user.found) {
            return AuthenticationState.NONE;
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

    setModalState(modalState) {
        if (this.state.authState == AuthenticationState.NEED_INFO) {
            modalState = ModalState.BASIC_INFO;
        }
        this.setState({ modalState });
    }

    getModal(context) {
        let { modalState } = this.state;
        if (modalState === ModalState.NONE) {
            return null;
        } else {
            const modalStateMap = {
                [ModalState.LOGIN]: LoginModal,
                [ModalState.BASIC_INFO]: BasicInfoModal,
            };
            let Modal = modalStateMap[modalState];
            return <Modal {...context} />;
        }
    }

    render() {
        let { user, authState, modalState } = this.state;
        let context = { user, authState, modalState, fetchUser: this.fetchUser, setModalState: this.setModalState };
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
                                {/* <Route path="/renter/:propertyId" component={RenterPropertyPage} /> */}
                                {/* <Route exact path="/owner" component={OwnerPage} /> */}
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
