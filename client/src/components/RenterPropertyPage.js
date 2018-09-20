import React, { Component } from 'react';

export default class RenterPropertyPage extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            info: null
        };
    }

    componentDidMount() {
        this.getProperty();
    }

    getProperty() {
        fetch('/renter/property/' + this.props.match.params.propertyId, {
            method: 'GET',
            credentials: 'include'
        }).then(res => res.json()).then(resJson => {
            console.log(resJson);
            this.setState({ info: resJson });
        });
    }

    render() {
        let { info } = this.state;
        if (!info) {
            return null;
        }
        return (
            <div>
                <Property data={info} />
            </div>
        );
    }
}

class Property extends Component {
    render() {
        let data = this.props.data;
        return <div>{JSON.stringify(data, null, 2)}</div>;
    }
}
