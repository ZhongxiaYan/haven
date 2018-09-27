import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

import Context from '../Context';

import './HomePage.css';

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      propertyList: [],
      hoveredProperty: null
    };
    this.getPropertyList = this.getPropertyList.bind(this);
    this.setHoveredProperty = this.setHoveredProperty.bind(this);
  }

  componentDidMount() {
    this.getPropertyList();
  }

  getPropertyList() {
    fetch('/renter/property_list', {
      method: 'GET',
      credentials: 'include'
    }).then(res => res.json()).then(resJson => {
      this.setState({ propertyList: resJson });
    }).catch(err => {
      console.error(err);
    });
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
      <Context.Consumer>
        {({ setModalState }) => (
          <div id="home-main" className="color-background">
            <div id="home-property-list">
              {propertyList.map((data, i) => <PropertyCard key={i} data={data} setModalState={setModalState} history={this.props.history} setHoveredProperty={this.setHoveredProperty} />)}
            </div>
            <GoogleMapComponent propertyList={propertyList} hoveredProperty={hoveredProperty} />
          </div>
        )}
      </Context.Consumer>
    );
  }
}

class PropertyCard extends Component {
  render() {
    let { history, data, setHoveredProperty } = this.props;
    let { _id, numBedrooms, numBathrooms, area, formattedAddress, openHouse, rent } = data;
    return (
      <div className="home-card" onClick={() => (history.push(`/renter/${_id}`))} onMouseEnter={() => setHoveredProperty(true, _id)} onMouseLeave={() => setHoveredProperty(false, _id)}>
        <img className="home-card-image-big" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" />
        <div className="home-card-container-image">
          <img src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" />
          <img src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" />
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
