import React, { Component } from 'react';
import { Button, Panel, Glyphicon } from 'react-bootstrap';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

import './HomePage.css';

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      propertyList: [],
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
    let { propertyList, hoveredProperty } = this.state;
    return (
      <div id="home-main" className="color-background">
        <PropertySearchForm setPropertyList={propertyList => this.setState({propertyList})}/>
        <div id="home-display">
          <div id="home-property-list">
            {propertyList.map((data, i) => <PropertyCard key={i} data={data} history={this.props.history} setHoveredProperty={this.setHoveredProperty} />)}
          </div>
          <GoogleMapComponent propertyList={propertyList} hoveredProperty={hoveredProperty} />
        </div>
      </div>
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
    fetch('/renter/property_list?' + new URLSearchParams(paramPairs), {
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
    let { history, data, setHoveredProperty } = this.props;
    let { _id, numBedrooms, numBathrooms, area, formattedAddress, openHouse, rent, video, photos } = data;
    return (
      <div className="home-card" onClick={() => (history.push(`/renter/${_id}`))} onMouseEnter={() => setHoveredProperty(true, _id)} onMouseLeave={() => setHoveredProperty(false, _id)}>
        <video className="home-card-image-big" controls>
          <source src={video ? `/file/${_id}/video/${video}` : null} />
        </video>
        <div className="home-card-container-image">
          {photos.slice(0, 2).map(photo => <img key={photo} src={`/file/${_id}/photos/${photo}`} />)}
        </div>
        <Panel className="home-card-panel">
          <Panel.Body>
            <p>{formattedAddress}</p>
            <p>{numBedrooms} Br / {numBathrooms} Ba, {area} Sq Ft</p>
            <p>${rent} / Month</p>
            <p>Open House {new Date(openHouse).toLocaleDateString()}</p>
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}

const MapComponent = withScriptjs(withGoogleMap(({ defaultCenter, propertyList, hoveredProperty }) =>
  <GoogleMap defaultZoom={15} defaultCenter={defaultCenter}>
    {propertyList.map(property => <Marker key={property._id} position={property.location} opacity={property._id === hoveredProperty ? 1 : 0.5} />)}
  </GoogleMap>
));

class GoogleMapComponent extends Component {
  render() {
    let { propertyList, hoveredProperty } = this.props;
    if (propertyList.length === 0) {
      return null;
    }
    let locs = propertyList.map(prop => prop.location);
    let defaultCenter = {
      lat: locs.map(loc => loc.lat).reduce((a, b) => a + b, 0) / locs.length,
      lng: locs.map(loc => loc.lng).reduce((a, b) => a + b, 0) / locs.length
    }

    return (
      <MapComponent
        defaultCenter={defaultCenter}
        hoveredProperty={hoveredProperty}
        propertyList={propertyList}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBL07U2mv0m4DMiESjIvmEZEn-jXbhgHak&v=3.exp&libraries=geometry,dr
awing,places"
        containerElement={<div id="home-maps-container-element" />}
        loadingElement={<div id="home-maps-loading-element" />}
        mapElement={<div id="home-maps-map-element" />}
      />
    );
  }
}
