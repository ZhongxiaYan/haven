import React, { Component } from 'react';
import Context from './Context';

import { AuthenticationState } from '../enums';

export default class HomePage extends Component {
    render() {
        return (
            <Context.Consumer>
                {({ user, authState, fetchUser }) => {
                    switch (authState) {
                        case AuthenticationState.NEED_INFO:
                            return <BasicInfoForm user={user} fetchUser={fetchUser} />;
                        case AuthenticationState.FULL:
                            return <HomeMain history={this.props.history} />;
                        case AuthenticationState.NONE:
                        default:
                            return <SignInForm fetchUser={fetchUser} />;
                    }
                }}
            </Context.Consumer>
        );
    }
}

const HomeMain = ({ history }) => {
    return (
        <div>
            <button onClick={() => history.push('/renter')}>I am a Renter</button>
            <button onClick={() => history.push('/owner')}>I am a Owner</button>
        </div>
    );
}

class SignInForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        let { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit(event) {
        fetch('/auth/' + document.activeElement.value, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state)
        }).then(res => res.json()).then(resJson => {
            console.log(resJson);
            if (resJson.success) {
                this.props.fetchUser();
            } else {
                // TODO
            }
        });
        event.preventDefault();
    }

    render() {
        let { email, password } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <label>Email <br></br>
                    <input type="text" name="email" value={email} placeholder="Email" onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Password <br></br>
                    <input type="password" name="password" value={password} placeholder="Password" onChange={this.handleChange} required /> <br></br>
                </label>
                <button type="submit" value={'login'}>Login</button>
                <button type="submit" value={'sign_up'}>Sign Up</button>
                <div><a href="/auth/facebook">Login with Facebook</a></div>
            </form>
        );
    }
}

class BasicInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.props.user);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        let { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit(event) {
        fetch('/auth/update_basic_info', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state)
        }).then(res => res.json()).then(resJson => {
            if (resJson.success) {
                this.props.fetchUser();
            } else {
                // TODO
            }
        });
        event.preventDefault();
    }

    render() {
        let { name, email, dateOfBirth } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                Basic Information <br></br>
                <label>Name <br></br>
                    <input type="text" name="name" value={name} placeholder="Name" onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Email <br></br>
                    <input type="text" name="email" value={email} placeholder="Email" onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Date of Birth <br></br>
                    <input type="text" name="dateOfBirth" value={dateOfBirth} onChange={this.handleChange} required /> <br></br>
                </label>
                <button type="submit">Submit</button>
            </form>
        );
    }
}
