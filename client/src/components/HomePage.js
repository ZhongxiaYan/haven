import React, { Component } from 'react';

export default class HomePage extends Component {
    render() {
        return (
            <div>
                <SignIn />
                <div><a href="/auth/facebook">Login with Facebook</a></div>
            </div>
        );
    }
}

class SignIn extends Component {
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
        }).then(res => console.log(res));
        // .then(res => res.json()).then(resJson => {
        //     console.log(resJson);
        //     if (resJson.success) {
        //         this.props.history.replace('/');
        //     } else {
        //         // TODO
        //     }
        // });
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
            </form>
        );
    }
}
