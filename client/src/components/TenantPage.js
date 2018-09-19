import React, { Component } from 'react';

export default class TenantPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <ProfileForm />
            </div>
        );
    }
}

class ProfileForm extends Component {
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
        console.log(this.state);
        fetch('/api/submit_tenant_profile', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state)
        }).then(res => res.json()).then(resJson => {
            console.log(resJson);
            if (resJson.success) {
                this.props.history.replace('/');
            } else {
                // TODO
            }
        });
    }

    render() {
        let { first_name, last_name, description, number, profession } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <label>First Name <br></br>
                    <input type="text" name="first_name" value={first_name} placeholder="First name" onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Last Name <br></br>
                    <input type="text" name="last_name" value={last_name} placeholder="Last name" onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Description <br></br>
                    <input type="text" name="description" value={description} placeholder="Say a little about yourself..." onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Phone Number <br></br>
                    <input type="text" name="number" value={number} placeholder="Phone number" onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Profession <br></br>
                    <select name="profession" value={profession} onChange={this.handleChange} >
                        <option value="engineer">Engineer</option>
                        <option value="doctor">Doctor</option>
                    </select>
                </label> <br></br>
                <input type="submit" value="Sign Up" />
            </form>
        );
    }
}
