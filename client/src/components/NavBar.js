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
      this.props.fetchUser();
    });
  }

  render() {
    let { user, authState, setModalState } = this.props;
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Haven</Link>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav bsStyle="tabs" pullRight>
          {{
            [AuthenticationState.NOT_LOGGED_IN]: (
              <NavItem eventKey="1" onClick={() => setModalState(ModalState.LOGIN)}>
                Login
              </NavItem>
            ),
            [AuthenticationState.NEED_INFO]: (
              <NavItem eventKey="1" onClick={() => setModalState(ModalState.BASIC_INFO)}>
                Complete Profile
              </NavItem>
            ),
            [AuthenticationState.FULL]: (
              <Fragment>
                <LinkContainer to="/status">
                  <NavItem eventKey="1">
                    <Glyphicon glyph="th-list" />
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/calendar">
                  <NavItem eventKey="2">
                    <Glyphicon glyph="calendar" />
                  </NavItem>
                </LinkContainer>
                <NavDropdown eventKey="3" id="user-dropdown" title={user.name || ''}>
                  <MenuItem eventKey="3.1" onSelect={() => setModalState(ModalState.BASIC_INFO)}>Basic Info</MenuItem>
                  <MenuItem divider />
                  <MenuItem eventKey="3.2" onSelect={this.logout}>Logout</MenuItem>
                </NavDropdown>
              </Fragment>
            )
          }[authState]}
        </Nav>
      </Navbar>
    );
  }
}
