import React, { Component } from 'react';
import Select from 'react-select';

import BaseModal from './BaseModal';

export default class AgentRequestModal extends Component {
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
    fetch('/renter/request_property', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent: true, agentInfo })
    }).then(res => res.json()).then(resJson => {
      // TODO
    });
    event.preventDefault();
  }

  renderBody() {
    let { requestInfo, requestDetails } = this.state;
    const requestInfoOptions = [
      { value: 'bathroomSize', label: 'Bathroom Size' },
      { value: 'neighborhoodFeeling', label: 'Neighborhood Feeling' },
      { value: 'spaciousness', label: 'Spaciousness' },
      { value: 'parkingConvenience', label: 'Parking Convenience' },
      { value: 'images', label: 'Images' },
      { value: 'video', label: 'Video' },
    ];
    return (
      <div>
        Request to visit an apartment
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
      </div>
    );
  }

  render() {
    return <BaseModal title={'Detail Request for Agent'} body={this.renderBody()} {...this.props} />;
  }
}
