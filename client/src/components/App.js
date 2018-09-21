import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import HomePage from './HomePage';
import RenterPage from './RenterPage';
import RenterPropertyPage from './RenterPropertyPage';
import OwnerPage from './OwnerPage';
import Context from './Context';

import { AuthenticationState } from '../enums';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            authState: AuthenticationState.NONE
        };

        this.fetchUser = this.fetchUser.bind(this);
        this.getAuthenticationState = this.getAuthenticationState.bind(this);
    }

    componentDidMount() {
        this.fetchUser();
    }

    getAuthenticationState(user) {
        if (!user) {
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
        }).then(res => res.json()).then(resJson => {
            if (resJson.found) {
                let user = resJson;
                this.setState({ user, authState: this.getAuthenticationState(user) });
            }    
        });    
    }    

    render() {
        return (
            <Context.Provider value={{ user: this.state.user, authState: this.state.authState, fetchUser: this.fetchUser }}>
                <Router>
                    <div>
                        <Switch>
                            <Route exact path="/" component={HomePage} />
                            {this.state.authState !== AuthenticationState.FULL ? <Route render={() => <Redirect to='/' />} /> : null }
                            <Route exact path="/renter" component={RenterPage} />
                            <Route path="/renter/:propertyId" component={RenterPropertyPage} />
                            <Route exact path="/owner" component={OwnerPage} />
                            <Route component={NoMatch} />
                        </Switch>
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
