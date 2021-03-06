import React, { Component } from 'react';
import { Carousel, OverlayTrigger, Popover } from 'react-bootstrap';
import Select from 'react-select';

import './RenterPropertyPage.css';

export default class RenterPropertyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: null,
      reviews: []
    };
    this.propertyId = this.props.match.params.propertyId; // TODO this might be fragile

    this.getProperty = this.getProperty.bind(this);
    this.requestProperty = this.requestProperty.bind(this);
    this.applyProperty = this.applyProperty.bind(this);
    this.cancelRequest = this.cancelRequest.bind(this);
    this.cancelApplication = this.cancelApplication.bind(this);
    this.fetchReviews = this.fetchReviews.bind(this);
    this.handleChangeReview = this.handleChangeReview.bind(this);
    this.handleSubmitReview = this.handleSubmitReview.bind(this);
  }

  // TODO remove these
  handleChangeReview(event) {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmitReview(event) {
    let { review, title } = this.state;
    fetch('/renter/review_property', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ property: this.propertyId, review, title })
    }).then(res => res.json()).then(resJson => {
      if (resJson.success) {
        this.fetchReviews();
      }
    });
    event.preventDefault();
  }

  componentDidMount() {
    // TODO have a better database system
    this.getProperty();
    this.getRequest();
    this.getApplication();
    this.fetchReviews();
  }

  getProperty() {
    fetch('/renter/property/' + this.propertyId, {
      method: 'GET',
      credentials: 'include'
    }).then(res => res.json()).then(resJson => {
      this.setState({ info: resJson });
    });
  }

  getRequest() {
    fetch('/renter/request_list?' + new URLSearchParams([['property', this.propertyId]]), {
      method: 'GET',
      credentials: 'include'
    }).then(res => res.json()).then(resJson => {
      if (resJson.length === 0) {
        this.setState({ request: false });
      } else {
        this.setState({ request: resJson[0] })
      }
    });
  }

  getApplication() {
    fetch('/renter/application_list?' + new URLSearchParams([['property', this.propertyId]]), {
      method: 'GET',
      credentials: 'include'
    }).then(res => res.json()).then(resJson => {
      if (resJson.length === 0) {
        this.setState({ application: false });
      } else {
        this.setState({ application: resJson[0] })
      }
    });
  }

  requestProperty(agent, agentInfo) {
    fetch('/renter/request_property', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ property: this.propertyId, agent, agentInfo })
    }).then(res => res.json()).then(resJson => {
      if (resJson.success) {
        this.getRequest();
      }
    });
  }

  applyProperty() {
    fetch('/renter/apply_property', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ property: this.propertyId })
    }).then(res => res.json()).then(resJson => {
      if (resJson.success) {
        this.getApplication();
      }
    });
  }

  cancelRequest(_id) {
    fetch('/renter/cancel_request', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: _id })
    }).then(res => res.json()).then(resJson => {
      if (resJson.success) {
        this.getRequest();
      } else {
        // TODO
      }
    });
  }

  cancelApplication(_id) {
    fetch('/renter/cancel_application', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: _id })
    }).then(res => res.json()).then(resJson => {
      if (resJson.success) {
        this.getApplication();
      } else {
        // TODO
      }
    });
  }

  fetchReviews() {
    fetch('/renter/review_list?' + new URLSearchParams([['property', this.propertyId]]), {
      method: 'GET',
      credentials: 'include'
    }).then(res => res.json()).then(reviews => {
      console.log(reviews);
      this.setState({ reviews });
    });
  }

  render() {
    let { info, request, application, reviews } = this.state;
    if (!info) {
      return null;
    }
    let { _id, title, formattedAddress, numBedrooms, numBathrooms, area, rent, deposit, leaseLength, description, openHouse, video, photos } = info;
    return (
      <div id="renter-property-page">
        <div id="renter-property-body">
          <h1>{title}</h1>
          <h3>{formattedAddress}</h3>
          <div id="renter-property-body-main">
            <div id="renter-property-body-graphics">
              {video === null ? <div id="renter-property-body-video"></div> :
                <video id="renter-property-body-video" controls>
                  <source src={`/file/${_id}/video/${video}`} />}
                </video>
              }
              <Carousel>
                {photos.map(photo => (
                  <Carousel.Item key={photo}>
                    <img src={`/file/${_id}/photos/${photo}`} />
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
            <div id="renter-property-body-info">
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
              {reviews.length === 0 ? <p>No reviews yet!</p> :
                reviews.map(r => <Review key={r._id} data={r} />)
              }
            </div>
            <form onSubmit={this.handleSubmitReview} style={{ display: 'none' }}>
              <input type="text" name="title" value={this.state.title} onChange={this.handleChangeReview} required /><br></br>
              <textarea rows="3" cols="50" name="review" value={this.state.review} onChange={this.handleChangeReview} /><br></br>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
        <SideBar openHouse={openHouse} formattedAddress={formattedAddress} request={request} application={application} requestProperty={this.requestProperty} applyProperty={this.applyProperty} cancelRequest={this.cancelRequest} cancelApplication={this.cancelApplication} />
      </div>
    );
  }
}

class SideBar extends Component {
  render() {
    let { openHouse, formattedAddress, request, application, requestProperty, applyProperty, cancelRequest, cancelApplication } = this.props;
    let { start, end } = openHouse;
    let openHouseDate = new Date(start).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    let openHouseStartTime = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let openHouseEndTime = new Date(end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let cancelRequestText = <a className="renter-property-cancel" onClick={() => cancelRequest(request._id)}>Cancel</a>;
    let cancelApplicationText = <a className="renter-property-cancel" onClick={() => cancelApplication(application._id)}>Cancel</a>;
    return (
      <div id="renter-property-side" className="color-background">
        <div>
          <h3>Open House</h3>
          <h4>{openHouseDate}</h4>
          <h4>{openHouseStartTime} - {openHouseEndTime}</h4>
          {request === undefined ? <div className="renter-property-button"></div> :
            request === false ?
              <OverlayTrigger trigger="click" placement="left" rootClose overlay={
                <Popover id="rsvp-popover" placement="left" title="RSVP Confirmation">
                  We look forward to seeing you at {formattedAddress} on {openHouseDate} from {openHouseStartTime} to {openHouseEndTime}.
                  <p align="right" className="renter-property-text-button" onClick={() => requestProperty(false)}>Submit</p>
                </Popover>
              }>
                <button className="renter-property-button">RSVP to Open House</button>
              </OverlayTrigger> :
              request.agent === false ? <p className="renter-property-confirmation-message">You've already RSVP'd! {cancelRequestText}</p> : <p className="renter-property-confirmation-message">You've already requested an agent! {cancelRequestText}</p>
          }
        </div>
        <div>
          <h3>Too busy? We'll find you a doppleganger ;) </h3>
          {request === undefined ? <div className="renter-property-button"></div> :
            request === false ?
              <OverlayTrigger trigger="click" placement="left" rootClose overlay={<FindAgentPopOver requestProperty={requestProperty} />}>
                <button className="renter-property-button">Find agent for $40</button>
              </OverlayTrigger> :
              request.agent === false ? <p className="renter-property-confirmation-message">You've already RSVP'd! {cancelRequestText}</p> : <p className="renter-property-confirmation-message">You've already requested an agent! {cancelRequestText}</p>
          }
        </div>
        <div>
          <h3>Sold? One-click apply</h3>
          {application === undefined ? <div className="renter-property-button"></div> :
            application === false ?
              <OverlayTrigger trigger="click" placement="left" rootClose overlay={
                <Popover id="apply-popover" placement="left" title="Congrats :D">
                  We're so happy that you found your dream apartment! Applying is easy and only $30 per applicant.
                  <p align="right" className="renter-property-text-button" onClick={applyProperty}>Confirm ($30)</p>
                </Popover>
              }>
                <button className="renter-property-button">Apply</button>
              </OverlayTrigger> :
              <p className="renter-property-confirmation-message">You've already applied! {cancelApplicationText}</p>
          }
        </div>
      </div>
    );
  }
}

class FindAgentPopOver extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestInfo: []
    };

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

    let { requestProperty, ...popoverProps } = this.props;
    return (
      <Popover id="agent-popover" placement="left" title="Find an agent to visit for me!" {...popoverProps}>
        One of our agents will visit the apartment during open house hours, and take videos and photos for you. You can either video chat with the agent while they are at the open house, or schedule a 20 min call with the agent at any other time!
        <br /><br />
        If you'd like, you can specify details for the agent to attend to...
        <Select // TODO allow creatable
          name={'requestInfo'}
          isMulti={true}
          isSearchable={true}
          value={requestInfo}
          placeholder={'Requests...'}
          onChange={this.handleChangeRequestInfo}
          options={requestInfoOptions}
        />
        <textarea id="renter-property-agent-description" rows="3" cols="50" name="requestDetails" value={requestDetails} placeholder="Details..." onChange={this.handleChange} /> <br></br>
        <p align="right" className="renter-property-text-button" onClick={this.handleSubmit}>Confirm ($40)</p>
      </Popover>
    );
  }
}

class Review extends Component {
  render() {
    let { data } = this.props;
    let { title, review } = data;
    return (
      <div>
        <h4>{title}</h4>
        <p className="renter-property-review-body">{review}</p>
      </div>
    );
  }
}
