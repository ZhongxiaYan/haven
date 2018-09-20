import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './HomePage';
import RenterPage from './RenterPage';
import RenterPropertyPage from './RenterPropertyPage';
import OwnerPage from './OwnerPage';
import Context from './Context';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {}
        };
    }

    componentDidMount() {
        fetch('/auth/get_user', {
            method: 'GET',
            credentials: 'include'
        }).then(res => res.json()).then(resJson => {
            if (resJson) {
                console.log(resJson);
                this.setState({ user: resJson });
            }
        });
    }

    render() {
        if (!this.state.user.email) {
            return <HomePage />;
        }
        return (
            <Context.Provider value={{ user: this.state.user }}>
                <Router>
                    <div>
                        <Switch>
                            <Route exact path="/" component={HomePage} />
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
