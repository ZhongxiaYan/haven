import React, { Component } from 'react';

export default class OwnerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <div>
                    {
                        this.state.addingProperty ? <NewProperty /> : <button type="button" onClick={() => this.setState({ addingProperty: true })}>Add New Property</button>
                    }
                </div>

                Applications:

                My Properties:
            </div>
        )
    }
}

class NewProperty extends Component {
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
        fetch('/api/new_property', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state)
        }).then(res => res.json()).then(resJson => {
            console.log(resJson);
            if (resJson.success) {
                this.props.history.replace('/owner');
            } else {
                // TODO
            }
        });
    }

    render() {
        let { bedrooms, bathrooms, size, address_first_line, address_second_line, city, state, zip_code, number } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <label>Number of Bedrooms <br></br>
                    <input type="number" min="0" step="1" name="bedrooms" value={bedrooms} onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Number of Bathrooms <br></br>
                    <input type="number" min="0" step="1" name="bathrooms" value={bathrooms} onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Size (sq ft) <br></br>
                    <input type="number" min="0" name="size" value={size} onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Street Address <br></br>
                    <input type="text" name="address_first_line" value={address_first_line} placeholder="Street and number" onChange={this.handleChange} required /> <br></br>
                    <input type="text" name="address_second_line" value={address_second_line} placeholder="Apartment, suite, unit, etc." onChange={this.handleChange} required /> <br></br>
                </label>
                <label>City <br></br>
                    <input type="text" name="city" value={city} onChange={this.handleChange} required /> <br></br>
                </label>
                <label>State <br></br>
                    <input type="text" name="state" value={state} onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Zip Code <br></br>
                    <input type="text" name="zip_code" value={zip_code} onChange={this.handleChange} required /> <br></br>
                </label>
                <label>Contact Number <br></br>
                    <input type="text" name="number" value={number} placeholder="Phone number" onChange={this.handleChange} /> <br></br>
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}