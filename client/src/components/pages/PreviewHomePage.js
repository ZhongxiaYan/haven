import React, { Component, Fragment } from 'react';
import { Jumbotron, Panel } from 'react-bootstrap';

import Context from '../Context';
import { ModalState } from '../../enums';

import './PreviewHomePage.css';

export default class PreviewHomePage extends Component {
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
        fetch('/preview/property_list', {
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
                {({ setModalState }) => (
                    <Fragment>
                        <Jumbotron>
                            <h1>Haven</h1>
                            <p>This site helps you find your dream apartment in minimal time. Browse our listings, schedule back to back home visits, and request a sub-in if you're too busy. When you find the place you love, sign up to one-click apply {'<3'} </p>
                        </Jumbotron>
                        <div id="preview-main" className="color-background">
                            {propertyList.map((data, i) => <PreviewCard key={i} data={data} setModalState={setModalState} />)}
                        </div>
                    </Fragment>
                )}
            </Context.Consumer>
        );
    }
}

class PreviewCard extends Component {
    render() {
        let { data, setModalState } = this.props;
        let { numBedrooms, numBathrooms, area, city, state, zipCode, openHouseTime, rent } = data;
        return (
            <div className="preview-card" onClick={() => setModalState(ModalState.LOGIN)}>
                <img className="preview-image" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" /> <br />
                <Panel>
                    <Panel.Body>
                        <p>{city}, {state} {zipCode}</p>
                        <p>{numBedrooms} Br / {numBathrooms} Ba, {area} Sq Ft</p>
                        <p>${rent} / Month</p>
                        <p>Open House {openHouseTime}</p>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
}
