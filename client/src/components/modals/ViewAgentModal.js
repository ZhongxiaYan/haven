import React, { Component } from 'react';

import BaseModal from './BaseModal';

import './ViewAgentModal.css';

export default class ViewAgentModal extends Component {
  renderBody() {
    let { name, description, profile, phone, img } = this.props.modalData;
    return (
      <div id="view-agent-modal">
        <img src={img}></img>
        <p>{description} You may refer to her <a href={profile} target="_blank">profile</a> for additional information.</p>
        <p>Feel free to contact Agent {name} at {phone}!</p>
      </div>
    );
  }

  render() {
    let { modalData } = this.props;
    return <BaseModal title={`Agent ${modalData.name}`} body={this.renderBody()} {...this.props} />;
  }
}

