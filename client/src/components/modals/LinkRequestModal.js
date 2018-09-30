import React, { Component } from 'react';
import DateTimePicker from 'react-datetime';
import Select from 'react-select';

import BaseModal from './BaseModal';
import { ModalState } from '../../enums';

import './LinkRequestModal.css';

export default class LinkRequestModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: {},
      openHouse: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeRequestInfo = this.handleChangeRequestInfo.bind(this);
    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleChangeOpenHouse = this.handleChangeOpenHouse.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleChangeRequestInfo(event) {
    this.setState({ requestInfo: event });
  }

  handleChangeAddress(event) {
    let { name, value } = event.target;
    this.setState({ address: Object.assign({}, this.state.address, { [name]: value }) });
  }

  handleChangeOpenHouse(name, value) {
    this.setState({ openHouse: Object.assign({}, this.state.openHouse, { [name]: value }) });
  }

  handleSubmit(event) {
    let linkRequest = Object.assign({}, this.state);
    linkRequest.requestInfo = this.state.requestInfo.map(({ value }) => value);
    fetch('/renter/new_link_request', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(linkRequest)
    }).then(res => res.json()).then(resJson => {
      if (resJson.success) {
        this.props.setModalState(ModalState.NONE);
      }
    });
    event.preventDefault();
  }

  renderBody() {
    let { url, addressFirstLine, addressSecondLine, city, state, zipCode, openHouse, requestInfo, requestDetails } = this.state;
    let { openHouseStart, openHouseEnd } = openHouse;
    const requestInfoOptions = [
      { value: 'bathroomSize', label: 'Bathroom Size' },
      { value: 'neighborhoodFeeling', label: 'Neighborhood Feeling' },
      { value: 'spaciousness', label: 'Spaciousness' },
      { value: 'parkingConvenience', label: 'Parking Convenience' },
      { value: 'images', label: 'Images' },
      { value: 'video', label: 'Video' },
    ];

    return (
      <form id="link-request" style={{ display: 'flex', flexDirection: 'column' }} onSubmit={this.handleSubmit}>
        <p>This form lets you request an agent to view an apartment listing from somewhere else. All you need to do is provide us the URL link and the address (if you know it)!</p>
        <label>URL <br></br>
          <input className='input-text' style={{ width: '100%' }} type="text" name="url" value={url} placeholder={'Craigslist, Apartments.com'} onChange={this.handleChange} /> <br></br>
        </label>
        <label style={{ borderRadius: '5px' }}>Street Address <br></br>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <input className='input-text' style={{ width: '48%' }} type="text" name="addressFirstLine" value={addressFirstLine} placeholder="Street and number" onChange={this.handleChangeAddress} />{'   '}
            <input className='input-text' style={{ width: '45%' }} type="text" name="addressSecondLine" value={addressSecondLine} placeholder="Apt, suite, unit" onChange={this.handleChangeAddress} />
          </div>
        </label>
        <div style={{ width: '100%', display: 'flex', 'justifyContent': 'space-between' }}>
          <label style={{ width: '50%' }}>City <br></br>
            <input className='input-text' style={{ width: '100%' }} type="text" name="city" value={city} onChange={this.handleChangeAddress} /> <br></br>
          </label>
          <label style={{ width: '15%' }}>State <br></br>
            <input className='input-text' style={{ width: '100%' }} type="text" name="state" value={state} onChange={this.handleChangeAddress} /> <br></br>
          </label>
          <label style={{ width: '20%' }}>Zip Code <br></br>
            <input className='input-text' style={{ width: '100%' }} type="text" name="zipCode" value={zipCode} onChange={this.handleChangeAddress} /> <br></br>
          </label>
        </div>
        <label>Open House Start <br></br>
          <DateTimePicker timeConstraints={{ hours: { min: 9, max: 20 } }} value={openHouseStart} onChange={datetime => this.handleChangeOpenHouse('start', datetime)} />
        </label>
        <label>Open House End<br></br>
          <DateTimePicker timeConstraints={{ hours: { min: 10, max: 21 } }} value={openHouseEnd} onChange={datetime => this.handleChangeOpenHouse('end', datetime)} />
        </label>
        <label>Specific Concerns<br></br>
          <Select // TODO allow creatable
            name={'requestInfo'}
            isMulti={true}
            isSearchable={true}
            value={requestInfo}
            placeholder={'Requests...'}
            onChange={this.handleChangeRequestInfo}
            options={requestInfoOptions}
          />
        </label>
        <label>Additonal Details<br></br>
          <textarea id="renter-property-agent-description" style={{padding: '4px 10px', margin: '0px'}} rows="3" cols="50" name="requestDetails" value={requestDetails} placeholder="Details..." onChange={this.handleChange} /> <br></br>
        </label>
        <button type="submit" style={{ borderRadius: '15px', width: '50%', margin: '5px auto' }}>Submit</button>
      </form>
    );
  }

  render() {
    return <BaseModal title={'External Link Request'} body={this.renderBody()} {...this.props} />;
  }
}

