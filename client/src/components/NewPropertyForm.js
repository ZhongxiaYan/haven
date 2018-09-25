import React, { Component } from 'react';
import DateTimePicker from 'react-datetime';

import 'react-datetime/css/react-datetime.css';

export default class NewProperty extends Component {
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
        fetch('/owner/new_property', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state)
        }).then(res => res.json()).then(resJson => {
            if (resJson.success) {
                this.props.setAddingProperty(false, true);
            } else {
                // TODO
            }
        });
        event.preventDefault();
    }

    render() {
        let { title, addressFirstLine, addressSecondLine, city, state, zipCode, numBedrooms, numBathrooms, area, rent, deposit, leaseLength, description, openHouse } = this.state;
        console.log(this.state);
        return (
            <form onSubmit={this.handleSubmit}>
                <label>Title <br></br>
                    <input type="text" name="title" value={title} onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Street Address <br></br>
                    <input type="text" name="addressFirstLine" value={addressFirstLine} placeholder="Street and number" onChange={this.handleChange} required /> <br></br>
                    <input type="text" name="addressSecondLine" value={addressSecondLine} placeholder="Apartment, suite, unit, etc." onChange={this.handleChange} /> <br></br>
                </label>
                <label>City <br></br>
                    <input type="text" name="city" value={city} onChange={this.handleChange} required /> <br></br>
                </label>
                <label>State <br></br>
                    <input type="text" name="state" value={state} onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Zip Code <br></br>
                    <input type="text" name="zipCode" value={zipCode} onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Description <br></br>
                    <input type="text" name="description" value={description} onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Number of Bedrooms <br></br>
                    <input type="number" min="0" step="1" name="numBedrooms" value={numBedrooms} onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Number of Bathrooms <br></br>
                    <input type="number" min="0" step="1" name="numBathrooms" value={numBathrooms} onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Size (sq ft) <br></br>
                    <input type="number" min="0" step="0.1" name="area" value={area} onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Rent ($ / month) <br></br>
                    <input type="number" min="0" step="0.1" name="rent" value={rent} onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Deposit ($) <br></br>
                    <input type="number" min="0" step="0.1" name="deposit" value={deposit} onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Lease Length (months) <br></br>
                    <input type="number" min="0" step="1" name="leaseLength" value={leaseLength} onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Open House <br></br>
                    <DateTimePicker timeConstraints={{ hours: { min: 9, max: 21 } }} value={openHouse} onChange={datetime => this.setState({ openHouse: datetime })} /> <br></br>
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}
