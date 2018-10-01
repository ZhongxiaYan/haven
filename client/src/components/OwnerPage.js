import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

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
            <Button style={{ marginLeft: '1%', marginTop: '1%' }} type="submit" onClick={() => this.setAddingProperty(true)}>Add New Property</Button>
          }
        </div>

        <div style={{marginTop: '1%', marginLeft: '1%'}}>
          Applications: <br></br>
        </div>
        
        <div style={{marginTop: '1%', marginLeft: '1%'}}>
          My Properties:
          {propertyList.map(data => <Property key={data._id} data={data} />)}
        </div>
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
