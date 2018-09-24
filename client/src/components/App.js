import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, Button, Glyphicon } from 'react-bootstrap';

import RenterPage from './RenterPage';
import RenterPropertyPage from './RenterPropertyPage';
import OwnerPage from './OwnerPage';
import LoginModal from './modals/LoginModal';
import BasicInfoModal from './modals/BasicInfoModal';

import { AuthenticationState, ModalState } from '../enums';

import "react-bootstrap/lib/NavbarHeader";

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
            if (user.found) {
                let authState = this.getAuthenticationState(user);
                let modalState = ModalState.NONE;
                if (authState === AuthenticationState.NEED_INFO) { // If user hasn't provided necessary information yet, ask with modal
                    modalState = ModalState.BASIC_INFO;
                }
                this.setState({ user, authState, modalState });
            }
        });
    }

    setModalState(modalState) {
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
            <Router>
                <div>
                    <NavBarComponent {...context} />
                    {this.getModal(context)}
                    <Switch>
                        <Route exact path="/" component={RenterPage} />
                        {this.state.authState !== AuthenticationState.FULL ? <Route render={() => <Redirect to='/' />} /> : null}
                        <Route exact path="/renter" component={RenterPage} />
                        <Route path="/renter/:propertyId" component={RenterPropertyPage} />
                        <Route exact path="/owner" component={OwnerPage} />
                        <Route component={NoMatch} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

const NoMatch = ({ location }) => (
    <div>
        <h3>No match for ${location.pathname}</h3>
    </div>
);

import './NavBar.css';

const NavBarComponent = ({ user, authState, setModalState }) => {
    return (
        <Navbar>
            <Navbar.Header>
                <Navbar.Brand>
                    <Link to="/">Haven</Link>
                </Navbar.Brand>
            </Navbar.Header>
            <Nav bsStyle="tabs" pullRight>
                {{
                    [AuthenticationState.NONE]: (
                        <NavItem eventKey="1" onClick={() => setModalState(ModalState.LOGIN)}>
                            Login
                        </NavItem>
                    ),
                    [AuthenticationState.NEED_INFO]: (
                        <NavItem eventKey="1" onClick={() => setModalState(ModalState.BASIC_INFO)}>
                            Complete Profile
                        </NavItem>
                    ),
                    [AuthenticationState.FULL]: (
                        <Fragment>
                            <NavItem eventKey="1">
                                <Glyphicon glyph="bell" />
                            </NavItem>
                            <NavItem eventKey="2">
                                <Glyphicon glyph="plus" />
                            </NavItem>
                            <NavItem eventKey="3">
                                <Glyphicon glyph="calendar" />
                            </NavItem>
                            <NavItem eventKey="4">
                                {user.name}
                            </NavItem>
                        </Fragment>
                    )
                }[authState]}
            </Nav>
        </Navbar>
    );
}
