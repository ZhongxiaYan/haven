import React, { Component } from 'react';

import Context from '../Context';
import { ModalState } from '../../enums';

import './StatusPage.css';

export default class StatusPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestList: [],
      applicationList: []
    };
    this.fetchRequestList = this.fetchRequestList.bind(this);
    this.fetchApplicationList = this.fetchApplicationList.bind(this);
    this.goToProperty = this.goToProperty.bind(this);
  }

  componentDidMount() {
    this.fetchRequestList();
    this.fetchApplicationList();
  }

  fetchRequestList() {
    fetch('/renter/request_list', {
      method: 'GET',
      credentials: 'include'
    }).then(res => res.json()).then(resJson => {
      this.setState({ requestList: resJson });
    });
  }

  fetchApplicationList() {
    fetch('/renter/application_list', {
      method: 'GET',
      credentials: 'include'
    }).then(res => res.json()).then(resJson => {
      this.setState({ applicationList: resJson });
    });
  }

  goToProperty(propertyId) {
    this.props.history.push(`/renter/${propertyId}`);
  }

  render() {
    let { requestList, applicationList } = this.state;
    return (
      <Context.Consumer>
        {({ setModalState }) =>
          <div id="status-page" className="color-background">
            <h3>Upcoming Agent Visits</h3>
            <Carousel items={requestList.map(data => <Request key={data._id} data={data} goToProperty={this.goToProperty} setModalState={setModalState} fetchRequestList={this.fetchRequestList}/>)} />

            <h3>Outstanding Applications</h3>
            <Carousel items={applicationList.map(data => <Application key={data._id} data={data} goToProperty={this.goToProperty} fetchApplicationList={this.fetchApplicationList} />)} />
          </div>
        }
      </Context.Consumer>
    )
  }
}

import catImg from '../../images/cat.jpg';
const hardCodeAgent = {
  name: 'Cat',
  phone: '510-532-1683',
  description: 'Cat has been working at Haven for three years. Previously she had thirty years of experience as an agent.',
  profile: 'https://www.linkedin.com/in/catherine-wu-703ba399/',
  img: catImg
}

class Request extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.cancelRequest = this.cancelRequest.bind(this);
  }

  cancelRequest(_id) {
    fetch('/renter/cancel_request', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: _id })
    }).then(res => res.json()).then(resJson => {
      if (resJson.success) {
        this.props.fetchRequestList();
      } else {
        // TODO
      }
    });
  }

  render() {
    let { data, goToProperty, setModalState } = this.props;
    let { _id, formattedAddress, photos } = data.property[0];
    let openContactModal = () => setModalState(ModalState.VIEW_AGENT, hardCodeAgent);
    return (
      <div className="carousel-item">
        <div className="request-carousel-item-info">
          <div className="request-carousel-item-info-left">
            <p onClick={() => goToProperty(_id)}>{formattedAddress.split(',')[0]}</p>
            <img className="request-carousel-item-agent-profile-img" src={hardCodeAgent.img} onClick={openContactModal} />
            <p onClick={openContactModal}>{hardCodeAgent.name}</p>
          </div>
          <div className="request-carousel-item-image">
            {photos.length > 0 ? <img src={`/file/${_id}/photos/${photos[0]}`} /> : null}
          </div>
        </div>
        <div className="carousel-item-buttons">
          <button className="carousel-item-contact-button" onClick={openContactModal}>Contact</button>
          <button className="carousel-item-cancel-button" onClick={() => this.cancelRequest(data._id)}>Cancel</button>
        </div>
      </div>
    );
  }
}

class Application extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.cancelApplication = this.cancelApplication.bind(this);
  }

  cancelApplication(_id) {
    fetch('/renter/cancel_application', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: _id })
    }).then(res => res.json()).then(resJson => {
      if (resJson.success) {
        this.props.fetchApplicationList();
      } else {
        // TODO
      }
    });
  }

  render() {
    let { data, goToProperty } = this.props;
    let { status, property } = data;
    let { _id, formattedAddress, photos } = property[0];
    return (
      <div className="carousel-item">
        <p className="application-carousel-item-title" onClick={() => goToProperty(_id)}>{formattedAddress.split(',')[0]}</p>
        <div className="application-carousel-item-image">
          {photos.length > 0 ? <img src={`/file/${_id}/photos/${photos[0]}`} /> : null}
        </div>
        <div className="carousel-item-buttons">
          <button className="carousel-item-cancel-button" onClick={() => this.cancelApplication(data._id)}>Cancel</button>
        </div>
      </div>
    );
  }
}

class Carousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currIndex: 0
    };

    this.numDisplay = 3;

    this.nextSlide = this.nextSlide.bind(this);
    this.previousSlide = this.previousSlide.bind(this);
  }

  previousSlide() {
    const { currIndex } = this.state;
    let newIndex = currIndex > 0 ? currIndex - 1 : currIndex;
    this.setState({
      currIndex: newIndex
    });
  }

  nextSlide() {
    const { currIndex } = this.state;
    let newIndex = (currIndex + this.numDisplay) < this.props.items.length ? currIndex + 1 : currIndex;
    this.setState({
      currIndex: newIndex
    });
  }

  render() {
    let { currIndex } = this.state;
    let items = this.props.items.slice(currIndex, currIndex + this.numDisplay).map(item => item);
    while (items.length < this.numDisplay) {
      items.push(<div key={'mock' + items.length} className="carousel-item-mock"></div>);
    }
    let disabledStyle = {
      opacity: 0.2,
      cursor: 'not-allowed'
    };
    let leftStyle = currIndex === 0 ? disabledStyle : {};
    let rightStyle = (currIndex + this.numDisplay) >= this.props.items.length ? disabledStyle : {};

    return (
      <div className="carousel">
        <span className="slide-arrow glyphicon glyphicon-chevron-left" style={leftStyle} onClick={this.previousSlide}></span>

        <div className="carousel-item-container">
          {items}
        </div>

        <span className="slide-arrow glyphicon glyphicon-chevron-right" style={rightStyle} onClick={this.nextSlide}></span>
      </div>
    );
  }
}
