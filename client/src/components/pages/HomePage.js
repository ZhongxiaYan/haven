import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';

import Context from '../Context';

import './HomePage.css';

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            propertyList: []
        };
        this.getPropertyList = this.getPropertyList.bind(this);
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

    render() {
        let { propertyList } = this.state;
        return (
            <Context.Consumer>
                {({ history, setModalState }) => (
                    <div id="home-main" className="color-background">
                        <div id="home-property-list">
                            {propertyList.map((data, i) => <PropertyCard key={i} data={data} setModalState={setModalState} history={this.props.history} />)}
                        </div>
                        <div id="home-property-map">
                        </div>
                    </div>
                )}
            </Context.Consumer>
        );
    }
}

class PropertyCard extends Component {
    render() {
        let { history, data } = this.props;
        let { _id, numBedrooms, numBathrooms, area, formattedAddress, openHouse, rent } = data;
        return (
            <div className="home-card" onClick={() => (history.push(`/renter/${_id}`))}>
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
