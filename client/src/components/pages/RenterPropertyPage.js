import React, { Component } from 'react';
import { OverlayTrigger, Popover, Button } from 'react-bootstrap';
import Select from 'react-select';

import Context from '../Context';
import { ModalState } from '../../enums';

import './RenterPropertyPage.css';

export default class RenterPropertyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: null
    };
    this.propertyId = this.props.match.params.propertyId;

    this.getProperty = this.getProperty.bind(this);
    this.requestProperty = this.requestProperty.bind(this);
    this.applyProperty = this.applyProperty.bind(this);
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

  requestProperty(agent, agentInfo) {
    fetch('/renter/request_property', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ property: this.props.propertyId, agent, agentInfo })
    }).then(res => res.json()).then(resJson => {
      // TODO
    });
  }

  applyProperty() {
    fetch('/renter/apply_property', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ property: this.props.propertyId })
    }).then(res => res.json()).then(resJson => {
      // TODO
    });
  }

  render() {
    let { info } = this.state;
    if (!info) {
      return null;
    }
    let { title, formattedAddress, numBedrooms, numBathrooms, area, rent, deposit, leaseLength, description, openHouse } = info;
    let formattedOpenHouse = new Date(openHouse).toLocaleString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    return (
      <Context.Consumer>
        {({ setModalState }) => (
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
                  <h3>{formattedOpenHouse}</h3>
                  <OverlayTrigger trigger="click" placement="left" overlay={
                    <Popover id="rsvp-popover" placement="left" title="RSVP Confirmation">
                      We look forward to seeing you at {formattedAddress} on {formattedOpenHouse}.<br />If you have questions, please contact the owner at
                    <Button bsStyle="primary" onClick={() => this.requestProperty(false)}>Submit</Button>
                    </Popover>
                  }>
                    <Button bsStyle="primary">RSVP</Button>
                  </OverlayTrigger>
                </div>
                <div>
                  <h3>Too busy? We'll find you a doppleganger ;) </h3>
                  <OverlayTrigger trigger="click" placement="left" overlay={<FindAgentPopOver requestProperty={this.requestProperty} />}>
                    <Button bsStyle="info">Find agent for $40</Button>
                  </OverlayTrigger>
                </div>
                <div>
                  <h3>Sold? One-click apply</h3>
                  <OverlayTrigger trigger="click" placement="left" overlay={
                    <Popover id="apply-popover" placement="left" title="Congrats :D">
                      We're so happy that you found your dream apartment! Applying is easy and only $30 per applicant.<br />
                      If this is your first time, then we'll ask for your information so we can run background and credit checks before sending your application to the owner!
                      <Button bsStyle="primary" onClick={this.applyProperty}>Submit</Button>
                    </Popover>
                  }>
                    <Button bsStyle="success">Apply</Button>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
          </div>
        )}
      </Context.Consumer>
    );
  }
}

class FindAgentPopOver extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeRequestInfo = this.handleChangeRequestInfo.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleChangeRequestInfo(event) {
    this.setState({ requestInfo: event });
  }

  handleSubmit(event) {
    let agentInfo = Object.assign({}, this.state);
    agentInfo.requestInfo = this.state.requestInfo.map(({ value }) => value);
    this.props.requestProperty(true, agentInfo);
    event.preventDefault();
  }

  render() {
    let { requestInfo, requestDetails } = this.state;
    const requestInfoOptions = [
      { value: 'bathroomSize', label: 'Bathroom Size' },
      { value: 'neighborhoodFeeling', label: 'Neighborhood Feeling' },
      { value: 'spaciousness', label: 'Spaciousness' },
      { value: 'parkingConvenience', label: 'Parking Convenience' },
      { value: 'images', label: 'Images' },
      { value: 'video', label: 'Video' },
    ];
    let popoverProps = Object.assign({}, this.props);
    delete popoverProps.requestProperty;
    return (
      <Popover id="agent-popover" placement="left" title="Congrats :D" {...popoverProps}>
        One of our agents will visit the apartment during open house hours, and take videos and photos for you. You can etiher video chat with the agent while they are at the open house, or schedule a 20 min call with the agent at any other time!<br />
        If you'd like, you can specify details for the agent to attend to too!
        <form onSubmit={this.handleSubmit}>
          <label>Request Information <br></br>
            <Select // TODO allow creatable
              name={'requestInfo'}
              isMulti={true}
              isSearchable={true}
              value={requestInfo}
              onChange={this.handleChangeRequestInfo}
              options={requestInfoOptions}
            />
          </label>
          <label>Request Details
            <input type="text" name="requestDetails" value={requestDetails} onChange={this.handleChange} /> <br></br>
          </label>
          <input type="submit" value="Submit" />
        </form>
      </Popover>
    );
  }
}
