import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './HomePage'

export default class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/" component={HomePage}/>
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
