import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import './RenterPropertyPage.css';

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
            this.setState({ info: resJson });
        });
    }

    render() {
        let { info } = this.state;
        if (!info) {
            return null;
        }
        let { title, formattedAddress, numBedrooms, numBathrooms, area, rent, deposit, leaseLength, description, openHouse } = info;
        return (
            <div id="renter-property-page">
                <h1>{title}</h1>
                <h3>{formattedAddress}</h3>
                <div id="renter-property-body">
                    <div id="renter-property-body-main">
                        <div id="renter-property-body-info">
                            <img id="renter-property-body-video" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" />
                            <div id="renter-property-body-images">
                                <img className="" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" />
                                <img className="" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" />
                                <img className="" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" />
                                <img className="" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" />
                            </div>
                            <div id="renter-property-body-description">{description}</div>
                            <div id="renter-property-body-summary">
                                Bedroom(s): {numBedrooms} <br />
                                Bathroom(s): {numBathrooms} <br />
                                Size: {area} Sq Ft <br />
                                Rent: ${rent} / Month <br />
                                Security Deposit: ${deposit} <br />
                                Lease Length: {leaseLength} Month(s)
                            </div>
                        </div>
                        <div id="renter-property-body-reviews">
                            <h3>Peer Reviews</h3>
                        </div>
                    </div>
                    <div id="renter-property-body-side">
                        <div>
                            <h3>Open House</h3>
                            <h3>{new Date(openHouse).toLocaleString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</h3>
                            <Button bsStyle="primary">RSVP</Button>
                        </div>
                        <div>
                            <h3>Too busy? We'll find you a doppleganger ;) </h3>
                            <Button bsStyle="info">Find agent for $40</Button>
                        </div>
                        <div>
                            <h3>Sold? One-click apply</h3>
                            <Button bsStyle="success">Apply</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
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
