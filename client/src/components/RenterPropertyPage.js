import React, { Component } from 'react';

export default class RenterPropertyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: null
        };
        this.propertyId = this.props.match.params.propertyId;
    }

    componentDidMount() {
        this.getProperty();
    }

    getProperty() {
        fetch('/renter/property/' + this.propertyId, {
            method: 'GET',
            credentials: 'include'
        }).then(res => res.json()).then(resJson => {
            console.log(resJson);
            this.setState({ info: resJson });
        });
    }

    render() {
        let { info } = this.state;
        if (!info) {
            return null;
        }
        return (
            <div>
                <Property data={info} />
                <ApplicationForm propertyId={this.propertyId} />
            </div>
        );
    }
}

class Property extends Component {
    render() {
        let data = this.props.data;
        return <div>{JSON.stringify(data, null, 2)}</div>;
    }
}


class ApplicationForm extends Component {
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
        let data = Object.assign({}, this.state);
        data.property = this.props.propertyId;
        fetch('/renter/submit_application', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(resJson => {
            if (resJson.success) {
                // TODO
            } else {
                // TODO
            }
        });
        event.preventDefault();
    }

    render() {
        let { info } = this.state;
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Info <br></br>
                        <input type="text" name="info" value={info} onChange={this.handleChange} required /> <br></br>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}
