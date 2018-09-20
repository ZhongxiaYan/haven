import React, { Component } from 'react';

import RequestingPropertyForm from './RequestingPropertyForm';

export default class RenterPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestingProperty: false,
            requestList: [],
            propertyList: []
        };
        this.getRequestList = this.getRequestList.bind(this);
        this.getPropertyList = this.getPropertyList.bind(this);
        this.navigateToProperty = this.navigateToProperty.bind(this);
        this.setRequestingProperty = this.setRequestingProperty.bind(this);
    }

    componentDidMount() {
        this.getRequestList();
        this.getPropertyList();
    }
    
    getRequestList() {
        fetch('/renter/request_list', {
            method: 'GET',
            credentials: 'include'
        }).then(res => res.json()).then(resJson => {
            this.setState({ requestList: resJson });
        }).catch(err => {
            console.error(err);
        });
    }

    getPropertyList() {
        fetch('/renter/property_list', {
            method: 'GET',
            credentials: 'include'
        }).then(res => res.json()).then(resJson => {
            this.setState({ propertyList: resJson });
        }).catch(err => {
            console.error(err);
        });
    }

    navigateToProperty(propertyId) {
        this.props.history.push('/renter/' + propertyId);
    }

    setRequestingProperty(requestingProperty, updated) {
        this.setState({requestingProperty: requestingProperty});
        if (updated) {
            this.getRequestList();
        }
    }

    render() {
        let { requestingProperty, propertyList, requestList } = this.state;
        return (
            <div>
                {requestingProperty ?
                    <RequestingPropertyForm setRequestingProperty={this.setRequestingProperty} /> :
                    <button type="button" onClick={() => this.setRequestingProperty(true)}>Request Property</button>
                }
                Requests:
                {requestList.map(data => <Request key={data._id} data={data} />)}
                Properties:
                {propertyList.map(data => <Property key={data._id} data={data} navigateToProperty={this.navigateToProperty} />)}
            </div>
        );
    }
}

class Request extends Component {
    render() {
        let { data } = this.props;
        let { _id } = data;
        console.log(data, _id)
        return (
            <div>
                {JSON.stringify(data, null, 2)}
            </div>
        );
    }
}


class Property extends Component {
    render() {
        let { data, navigateToProperty } = this.props;
        let { _id } = data;
        return (
            <div>
                {JSON.stringify(data, null, 2)}
                <button onClick={() => navigateToProperty(_id)}>View</button>
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
        fetch('/api/submit_renter_profile', {
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
        let { description, number, profession } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
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
