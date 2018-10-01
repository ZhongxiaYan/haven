import React, { Component } from 'react';
import DateTimePicker from 'react-datetime';
import { FormControl, Form, FormGroup, Button } from "react-bootstrap";
import './NewPropertyForm.css';

import 'react-datetime/css/react-datetime.css';

export default class NewProperty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: {},
      openHouse: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeFile = this.handleChangeFile.bind(this);
    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleChangeOpenHouse = this.handleChangeOpenHouse.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleChangeAddress(event) {
    let { name, value } = event.target;
    this.setState({ address: Object.assign({}, this.state.address, { [name]: value }) });
  }

  handleChangeOpenHouse(name, value) {
    this.setState({ openHouse: Object.assign({}, this.state.openHouse, { [name]: value }) });
  }

  handleChangeFile(event) {
    let {name, files} = event.target;
    this.setState({ [name]: files });
  }

  handleSubmit(event) {
    let formData = new FormData();
    Object.entries(this.state).forEach(([key, value]) => {
      if (['video', 'photos'].includes(key)) {
        Object.values(value).forEach(v => {
          formData.append(key, v)
        })
      } else {
        formData.append(key, JSON.stringify(value));
      }
    });
    fetch('/owner/new_property', {
      method: 'POST',
      credentials: 'include',
      body: formData
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
    let {openHouseStart, openHouseEnd} = openHouse;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup style={{ marginLeft: '1%', marginTop: '1%' }}>
          <label style={{fontFamily: 'AppleGothic'}}>Title <br></br>
            <input className='input-text' type="text" name="title" value={title} onChange={this.handleChange} required /> <br></br>
          </label>
        </FormGroup>
        <FormGroup style={{ marginLeft: '1%', marginTop: '1%' }}>
          <label style={{ borderRadius: '5px'}}>Street Address <br></br>
            <input className='input-text' style={{marginBottom: '1%'}}type="text" name="addressFirstLine" value={addressFirstLine} placeholder=" Street and number" onChange={this.handleChangeAddress} required /> <br></br>
            <input className='input-text' type="text" name="addressSecondLine" value={addressSecondLine} placeholder=" Apartment, suite, unit, etc." onChange={this.handleChangeAddress} /> <br></br>
          </label>
          <label style={{fontFamily: 'AppleGothic'}}>City <br></br>
            <input className='input-text' type="text" name="city" value={city} onChange={this.handleChangeAddress} required /> <br></br>
          </label>
          <label style={{fontFamily: 'AppleGothic'}}>State <br></br>
            <input className='input-text' type="text" name="state" value={state} onChange={this.handleChangeAddress} required /> <br></br>
          </label>
          <label style={{fontFamily: 'AppleGothic'}}>Zip Code <br></br>
            <input className='input-text' type="text" name="zipCode" value={zipCode} onChange={this.handleChangeAddress} required /> <br></br>
          </label>
        </FormGroup>
        <FormGroup style={{ marginLeft: '1%', marginTop: '1%' }}>
          <label style={{fontFamily: 'AppleGothic'}}>Description <br></br>
            <input className='input-text' type="text" name="description" value={description} onChange={this.handleChange} required /> <br></br>
          </label>
          <label style={{fontFamily: 'AppleGothic'}}>Number of Bedrooms <br></br>
            <input className='input-number' type="number" min="0" step="1" name="numBedrooms" value={numBedrooms} onChange={this.handleChange} required /> <br></br>
          </label>
          <label style={{fontFamily: 'AppleGothic'}}>Number of Bathrooms <br></br>
            <input className='input-number' type="number" min="0" step="1" name="numBathrooms" value={numBathrooms} onChange={this.handleChange} required /> <br></br>
          </label>
          <label style={{fontFamily: 'AppleGothic'}}>Size (sq ft) <br></br>
            <input className='input-number' type="number" min="0" step="0.1" name="area" value={area} onChange={this.handleChange} required /> <br></br>
          </label>
        </FormGroup>
        <FormGroup style={{ marginLeft: '1%', marginTop: '1%' }}>
          <label style={{fontFamily: 'AppleGothic'}}>Rent ($ / month) <br></br>
            <input className='input-number' type="number" min="0" step="0.1" name="rent" value={rent} onChange={this.handleChange} required /> <br></br>
          </label>
          <label style={{fontFamily: 'AppleGothic'}}>Deposit ($) <br></br>
            <input className='input-number' type="number" min="0" step="0.1" name="deposit" value={deposit} onChange={this.handleChange} required /> <br></br>
          </label>
          <label style={{fontFamily: 'AppleGothic'}}>Lease Length (months) <br></br>
            <input className='input-number' type="number" min="0" step="1" name="leaseLength" value={leaseLength} onChange={this.handleChange} required /> <br></br>
          </label>
        </FormGroup>
        <FormGroup style={{ marginLeft: '1%', marginTop: '1%' }}>
          <label style={{fontFamily: 'AppleGothic'}}>Open House Start <br></br>
            <DateTimePicker timeConstraints={{ hours: { min: 9, max: 20 } }} value={openHouseStart} onChange={datetime => this.handleChangeOpenHouse('start', datetime)} /> <br></br>
          </label> <br></br>
          <label style={{fontFamily: 'AppleGothic'}}>Open House End<br></br>
            <DateTimePicker timeConstraints={{ hours: { min: 10, max: 21 } }} value={openHouseEnd} onChange={datetime => this.handleChangeOpenHouse('end', datetime)} /> <br></br>
          </label>
        </FormGroup>
        <FormGroup style={{ marginLeft: '1%', marginTop: '1%' }}>
          <label style={{fontFamily: 'AppleGothic'}}>Upload Photos</label>
          <FormControl
            name="photos"
            type="file"
            accept=".jpg, .png"
            multiple
            onChange={this.handleChangeFile}
          />
          <label style={{ marginTop: '1%'}}>Upload Video</label>
          <FormControl
            name="video"
            type="file"
            accept=".mp4"
            onChange={this.handleChangeFile}
          />
        </FormGroup>
        <Button style={{ marginLeft: '1%', marginTop: '1%' }} type="submit">Submit</Button>
      </Form>
    );
  }
}
