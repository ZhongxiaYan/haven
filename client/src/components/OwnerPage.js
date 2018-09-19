import React, { Component } from 'react';

export default class OwnerPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            propertyList: []
        };

        this.setAddingProperty = this.setAddingProperty.bind(this);
        this.getPropertyList = this.getPropertyList.bind(this);
    }

    componentDidMount() {
        this.getPropertyList();
    }

    getPropertyList() {
        fetch('/owner/property_list', {
            method: 'GET',
            credentials: 'include'
        }).then(res => res.json()).then(resJson => {
            console.log(resJson);
            this.setState({ propertyList: resJson });
        });
    }

    setAddingProperty(addingProperty, updated) {
        this.setState({ addingProperty: addingProperty });
        if (updated) {
            this.getPropertyList();
        }
    }

    render() {
        let { addingProperty, propertyList } = this.state;
        return (
            <div>
                <div>
                    {
                        addingProperty ? 
                            <NewProperty setAddingProperty={this.setAddingProperty} /> : 
                            <button type="button" onClick={() => this.setAddingProperty(true)}>Add New Property</button>
                    }
                </div>

                Applications:

                My Properties:
                { propertyList.map(data => <Property key={data._id} data={data} />) }
            </div>
        )
    }
}

class Property extends Component {
    render() {
        let data = this.props.data;
        return <div>{JSON.stringify(data, null, 2)}</div>;
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
        let { numBedrooms, numBathrooms, area, addressFirstLine, addressSecondLine, city, state, zipCode, contactNumber } = this.state;
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
