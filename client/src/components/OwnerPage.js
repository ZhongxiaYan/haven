import React, { Component } from 'react';

import NewPropertyForm from './NewPropertyForm';

export default class OwnerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      propertyList: []
    };

    this.setAddingProperty = this.setAddingProperty.bind(this);
    this.getPropertyList = this.getPropertyList.bind(this);
  }

  componentDidMount() {
    this.getPropertyList();
  }

  getPropertyList() {
    fetch('/owner/property_list', {
      method: 'GET',
      credentials: 'include'
    }).then(res => res.json()).then(resJson => {
      this.setState({ propertyList: resJson });
    });
  }

  setAddingProperty(addingProperty, updated) {
    this.setState({ addingProperty: addingProperty });
    if (updated) {
      this.getPropertyList();
    }
  }

  render() {
    let { addingProperty, propertyList } = this.state;
    return (
      <div>
        <div>
          {addingProperty ?
            <NewPropertyForm setAddingProperty={this.setAddingProperty} /> :
            <button type="button" onClick={() => this.setAddingProperty(true)}>Add New Property</button>
          }
        </div>

        Applications:

        My Properties:
        {propertyList.map(data => <Property key={data._id} data={data} />)}
      </div>
    )
  }
}

class Property extends Component {
  render() {
    let data = this.props.data;
    return <div>{JSON.stringify(data, null, 2)}</div>;
  }
}
