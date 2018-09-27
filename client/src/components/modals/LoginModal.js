import React, { Component } from 'react';
import { Form, FormGroup, FormControl, Button, ControlLabel } from 'react-bootstrap';

import BaseModal from './BaseModal';

import 'bootstrap-social/bootstrap-social.css'

export default class LoginModal extends Component {
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
    fetch('/auth/' + document.activeElement.value, {
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
    let { email, password } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup>
          <ControlLabel>Log In via </ControlLabel>
          <a className="btn btn-block btn-social btn-facebook" href="/auth/facebook">
            <span className="fa fa-facebook"></span>Facebook
          </a>
          <a className="btn btn-block btn-social btn-google" href="/auth/google">
            <span className="fa fa-google"></span>Google
          </a>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Or </ControlLabel>
          <FormControl type="text" name="email" value={email} placeholder="Email" onChange={this.handleChange} required /> <br />
          <FormControl type="password" name="password" value={password} placeholder="Password" onChange={this.handleChange} required /> <br />
          <Button type="submit" bsStyle="primary" value={'login'}>Login</Button>{' '}
          <Button type="submit" bsStyle="success" value={'sign_up'}>Sign Up</Button>
        </FormGroup>
      </Form>
    );
  }

  render() {
    return <BaseModal title={'Log In'} body={this.renderBody()} {...this.props} />;
  }
}
