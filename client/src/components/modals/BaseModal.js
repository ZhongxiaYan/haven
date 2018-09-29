import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

import { ModalState } from '../../enums';

export default class BaseModal extends Component {
  render() {
    let { title, body, footer, setModalState } = this.props;
    return (
      <Modal style={{ margin: 'auto', marginTop: '5%' }} show={true} onHide={() => setModalState(ModalState.NONE)}>
        <Modal.Header style={{ width: '344px', margin: 'auto' }}>
          <Modal.Title style={{ width: '344px', margin: 'auto' }}>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ width: '344px', margin: 'auto' }}>
          {body}
        </Modal.Body>
        <Modal.Footer style={{ width: '344px', margin: 'auto' }}>
          {footer}
        </Modal.Footer>
      </Modal>
    );
  }
}
