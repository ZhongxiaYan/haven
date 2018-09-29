import React, { Component, Fragment } from 'react';
import { Jumbotron, Button, Panel, Glyphicon } from 'react-bootstrap';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

import Context from '../Context';
import { AuthenticationState, ModalState } from '../../enums';

import './HomePage.css';

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      properties: [],
      hoveredProperty: null
    };
    this.setHoveredProperty = this.setHoveredProperty.bind(this);
  }

  setHoveredProperty(isHover, propertyId) {
    if (isHover) {
      this.setState({ hoveredProperty: propertyId });
    } else {
      if (propertyId === this.state.hoveredProperty) {
        this.setState({ hoveredProperty: null });
      }
    }
  }

  render() {
    let { properties, mapLocation, mapBounds, hoveredProperty } = this.state;
    return (
      <Context.Consumer>
        {({ authState, setModalState }) => {
          let isLoggedIn = authState !== AuthenticationState.NOT_LOGGED_IN;
          let handlePropertyClick = (_id) => {
            if (isLoggedIn) this.props.history.push(`/renter/${_id}`);
            else setModalState(ModalState.LOGIN);
          }
          return (
            <Fragment>
              {isLoggedIn ? null : (
                <Jumbotron>
                  <h1>Haven</h1>
                  <p>This site helps you find your dream apartment in minimal time. Browse our listings, schedule back to back home visits, and request a sub-in if you're too busy. When you find the place you love, sign up to one-click apply {'<3'} </p>
                </Jumbotron>
              )}
              <div id="home-main" className="color-background">
                <PropertySearchForm setPropertyList={({ properties, mapLocation, mapBounds }) => this.setState({ properties, mapLocation, mapBounds })} />
                <div id="home-display">
                  <div id="home-property-list">
                    {properties.map((data, i) => <PropertyCard key={i} data={data} handlePropertyClick={() => handlePropertyClick(data._id)} setHoveredProperty={this.setHoveredProperty} />)}
                  </div>
                  <GoogleMapComponent properties={properties} mapLocation={mapLocation} mapBounds={mapBounds} hoveredProperty={hoveredProperty} />
                </div>
              </div>
            </Fragment>
          );
        }}
      </Context.Consumer>
    );
  }
}

class PropertySearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {}

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchProperties = this.fetchProperties.bind(this);
  }

  componentDidMount() {
    this.fetchProperties({});
  }

  fetchProperties(paramPairs) {
    fetch('/preview/property_list?' + new URLSearchParams(paramPairs), {
      method: 'GET',
      credentials: 'include'
    }).then(res => res.json()).then(resJson => {
      this.props.setPropertyList(resJson);
    }).catch(err => {
      console.error(err);
    });
  }

  handleChange(event) {
    let { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    this.fetchProperties(Object.entries(this.state).filter(([key, value]) => value !== ''));
    event.preventDefault();
  }

  render() {
    let { neighborhood, numBedrooms, numBathrooms, maxRent } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <input className="input-text" type="text" name="neighborhood" value={neighborhood} placeholder="What neighborhood are you interested in?" onChange={this.handleChange} />
        <input className="input-number" type="number" min="0" step="1" name="numBedrooms" value={numBedrooms} placeholder="# of bedrooms" onChange={this.handleChange} />
        <input className="input-number" type="number" min="0" step="1" name="numBathrooms" value={numBathrooms} placeholder="# of bathroom" onChange={this.handleChange} />
        <input className="input-number" type="number" min="0" step="1" name="maxRent" value={maxRent} placeholder="Max rent ($ / month)" onChange={this.handleChange} />
        <Button type="submit"><Glyphicon glyph="search" /></Button>
      </form>
    );
  }
}

class PropertyCard extends Component {
  render() {
    let { data, handlePropertyClick, setHoveredProperty } = this.props;
    let { _id, numBedrooms, numBathrooms, area, formattedAddress, openHouse, rent, video, photos } = data;
    return (
      <div className="home-card" onClick={handlePropertyClick} onMouseEnter={() => setHoveredProperty(true, _id)} onMouseLeave={() => setHoveredProperty(false, _id)}>
        {video === null ? <div className="home-card-video"></div> :
          <video className="home-card-video" controls preload="none">
            <source src={`/file/${_id}/video/${video}`} />}
          </video>
        }
        <div className="home-card-container-image">
          {photos.slice(0, 2).map(photo => <img key={photo} src={`/file/${_id}/photos/${photo}`} />)}
        </div>
        <Panel className="home-card-panel">
          <Panel.Body>
            <p>{formattedAddress}</p>
            <p>{numBedrooms} Br / {numBathrooms} Ba, {area} Sq Ft</p>
            <p>${rent} / Month</p>
            <p>Open House {new Date(openHouse.start).toLocaleDateString()}</p>
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}

const MapComponent = withScriptjs(withGoogleMap(({ defaultCenter, bounds, properties, hoveredProperty }) =>
  <GoogleMap ref={map => map && map.fitBounds(bounds)} defaultZoom={15} defaultCenter={defaultCenter}>
    {properties.map(property => <Marker key={property._id} position={property.location} opacity={property._id === hoveredProperty ? 1 : 0.5} />)}
  </GoogleMap>
));

class GoogleMapComponent extends Component {
  render() {
    let { properties, mapLocation, mapBounds, hoveredProperty } = this.props;
    if (properties.length === 0) {
      return null;
    }

    return (
      <MapComponent
        defaultCenter={mapLocation}
        bounds={mapBounds}
        hoveredProperty={hoveredProperty}
        properties={properties}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBL07U2mv0m4DMiESjIvmEZEn-jXbhgHak&v=3.exp&libraries=geometry,drawing,places"
        containerElement={<div id="home-maps-container-element" />}
        loadingElement={<div id="home-maps-loading-element" />}
        mapElement={<div id="home-maps-map-element" />}
      />
    );
  }
}
