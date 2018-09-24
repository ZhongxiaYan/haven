import React, { Component } from 'react';
import DatePicker from 'react-16-bootstrap-date-picker';

export default class NewProperty extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeOpenHouseDate = this.handleChangeOpenHouseDate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        let { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleChangeOpenHouseDate(value) {
        this.setState({ openHouseDate: value });
    }

    handleSubmit(event) {
        fetch('/owner/new_property', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state)
        }).then(res => res.json()).then(resJson => {
            console.log(resJson);
            if (resJson.success) {
                this.props.setAddingProperty(false, true);
            } else {
                // TODO
            }
        });
        event.preventDefault();
    }

    render() {
        let { numBedrooms, numBathrooms, area, openHouseDate, addressFirstLine, addressSecondLine, city, state, zipCode, contactNumber } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <label>Number of Bedrooms <br></br>
                    <input type="number" min="0" step="1" name="numBedrooms" value={numBedrooms} onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Number of Bathrooms <br></br>
                    <input type="number" min="0" step="1" name="numBathrooms" value={numBathrooms} onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Size (sq ft) <br></br>
                    <input type="number" min="0" step="0.1" name="area" value={area} onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Open House Date <br></br>
                    <DatePicker value={openHouseDate} onChange={this.handleChangeOpenHouseDate} /> <br></br>
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
                <label>Contact Number <br></br>
                    <input type="text" name="contactNumber" value={contactNumber} placeholder="Phone number" onChange={this.handleChange} /> <br></br>
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}
