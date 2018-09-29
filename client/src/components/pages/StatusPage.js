import React, { Component } from 'react';

import InfiniteCarousel from 'react-leaf-carousel';
import './StatusPage.css';

export default class StatusPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestList: [],
      applicationList: []
    };
    this.getRequestList = this.getRequestList.bind(this);
    this.getApplicationList = this.getApplicationList.bind(this);
    this.goToProperty = this.goToProperty.bind(this);
  }

  componentDidMount() {
    this.getRequestList();
    this.getApplicationList();
  }

  getRequestList() {
    fetch('/renter/request_list', {
      method: 'GET',
      credentials: 'include'
    }).then(res => res.json()).then(resJson => {
      this.setState({ requestList: resJson });
    });
  }

  getApplicationList() {
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
    console.log(requestList)
    return (
      <div id="status-page" className="color-background">
        <h3>Upcoming Agent Visits</h3>
        <Carousel items={requestList.map(data => <Request key={data._id} data={data} goToProperty={this.goToProperty} />)} />

        <h3>Outstanding Applications</h3>
        {/* {applicationList.map(data => <Application key={data._id} data={data} />)} */}
      </div>
    )
  }
}

import catImg from '../../images/cat.jpg';
const hardCodeAgent = {
  name: 'Cat',
  phone: '510-532-1683',
  description: 'Cat has been working with us for three years. Previously she had thirty years of experience as an agent.',
  profile: 'https://www.linkedin.com/in/catherine-wu-703ba399/',
  img: catImg
}

class Request extends Component {
  render() {
    let { data, goToProperty } = this.props;
    let { _id, formattedAddress, photos } = data.property[0];
    return (
      <div className="carousel-item">
        <div className="carousel-item-info">
          <div>
            <p onClick={() => goToProperty(_id)}>{formattedAddress.split(',')[0]}</p>
            <img className="carousel-item-profile-img" src={hardCodeAgent.img} />
            <p>{hardCodeAgent.name}</p>
          </div>
          {photos.length > 0 ?
            <img className="carousel-item-image" src={`/file/${_id}/photos/${photos[0]}`} />
            :
            <img className="carousel-item-image" />
          }
        </div>
        <div className="carousel-item-buttons">
          <button className="carousel-item-contact-button">Contact</button>
          <button className="carousel-item-cancel-button">Cancel</button>
        </div>
      </div>
    );
  }
}

class Application extends Component {
  render() {
    let { _id, formattedAddress, video } = this.props.data.property[0];
    return (
      <div>
        {formattedAddress}
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
    let newIndex = currIndex < this.prop.items.length - 1 ? currIndex + 1 : currIndex;

    this.setState({
      currIndex: newIndex
    });
  }

  render() {
    let { currIndex } = this.state;
    let items = this.props.items.slice(currIndex, this.numDisplay).map(item => item);
    while (items.length < this.numDisplay) {
      items.push(<div className="carousel-item-mock"></div>);
    }
    return (
      <div className="carousel">
        <span class="slide-arrow glyphicon glyphicon-chevron-left" onClick={this.previousSlide}></span>

        <div className="carousel-item-container">
          {items}
        </div>

        <span class="slide-arrow glyphicon glyphicon-chevron-right" onClick={this.previousSlide}></span>
      </div>
    );
  }
}
