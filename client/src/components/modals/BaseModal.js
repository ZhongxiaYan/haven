import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

import { ModalState } from '../../enums';

export default class BaseModal extends Component {
  render() {
    let { title, body, footer, setModalState } = this.props;
    return (
      <Modal show={true} onHide={() => setModalState(ModalState.NONE)}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {body}
        </Modal.Body>
        <Modal.Footer>
          {footer}
        </Modal.Footer>
      </Modal>
    );
  }
}
