import React, { Component, Fragment } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import { AuthenticationState, ModalState } from '../enums';

import './NavBar.css';

export default class NavBar extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout() {
    fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include'
    }).then(res => {
      window.location.replace('/');
    });
  }

  render() {
    let { user, authState, setModalState } = this.props;
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/" style={{ fontFamily: 'AppleGothic' }}>Haven</Link>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav bsStyle="tabs" pullRight>
          {{
            [AuthenticationState.NOT_LOGGED_IN]: (
              <Fragment>
                <NavItem eventKey="1">
                  Login to request unlisted properties!
                </NavItem>
                <NavItem eventKey="2" onSelect={() => setModalState(ModalState.LOGIN)}>
                  Login
                </NavItem>
              </Fragment>
            ),
            [AuthenticationState.NEED_INFO]: (
              <NavItem eventKey="1" onSelect={() => setModalState(ModalState.BASIC_INFO)}>
                Complete Profile
              </NavItem>
            ),
            [AuthenticationState.FULL]: (
              <Fragment>
                <NavItem eventKey="1" onSelect={() => setModalState(ModalState.LINK_REQUEST)}>
                  Don't see what you want?
                </NavItem>
                <LinkContainer to="/home">
                  <NavItem eventKey="2">
                    <Glyphicon glyph="home" />
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/status">
                  <NavItem eventKey="3">
                    <Glyphicon glyph="th-list" />
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/calendar">
                  <NavItem eventKey="4">
                    <Glyphicon glyph="calendar" />
                  </NavItem>
                </LinkContainer>
                <NavDropdown eventKey="5" id="user-dropdown" title={user.name || ''}>
                  <MenuItem eventKey="5.1" onSelect={() => setModalState(ModalState.BASIC_INFO)}>Basic Info</MenuItem>
                  <MenuItem divider />
                  <MenuItem eventKey="5.2" onSelect={this.logout}>Logout</MenuItem>
                </NavDropdown>
              </Fragment>
            )
          }[authState]}
        </Nav>
      </Navbar>
    );
  }
}
