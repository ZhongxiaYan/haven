import React, { Component } from 'react';
import { Form, FormControl, Button, ControlLabel } from 'react-bootstrap';
import DateTimePicker from 'react-datetime';
import PhoneInput from 'react-phone-number-input'
import moment from 'moment';

import BaseModal from './BaseModal';

import 'react-phone-number-input/style.css';
import './BasicInfoModal.css';

export default class BasicInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, this.props.user);
    this.state.dateOfBirth = moment(this.state.dateOfBirth);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    fetch('/auth/update_basic_info', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state)
    }).then(res => res.json()).then(resJson => {
      if (resJson.success) {
        this.props.fetchUser();
      } else {
        // TODO
      }
    });
    event.preventDefault();
  }

  renderBody() {
    let { name, email, dateOfBirth, phoneNumber } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <ControlLabel>Name </ControlLabel>
        <FormControl type="text" name="name" value={name} placeholder="Name" onChange={this.handleChange} required /> <br />
        <ControlLabel>Email </ControlLabel>
        <FormControl type="text" name="email" value={email} placeholder="Email" onChange={this.handleChange} required /> <br />
        <ControlLabel>Phone Number </ControlLabel>
        <PhoneInput value={phoneNumber} onChange={phone => this.setState({ phoneNumber: phone })} country={'US'} countryOptions={['US']} required /> <br />
        <ControlLabel>Date of Birth </ControlLabel> <br />
        <DateTimePicker timeFormat={false} value={dateOfBirth} onChange={dob => this.setState({ dateOfBirth: dob })} /> <br></br>
        <Button type="submit" bsStyle="primary">Update</Button>
      </Form>
    );
  }

  render() {
    return <BaseModal title={'Basic Information'} body={this.renderBody()} {...this.props} />;
  }
}

