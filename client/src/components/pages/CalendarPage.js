import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarPage.css';

const CLIENT_ID = '86350647985-dn58p8o4te6kk05199m38p36s03pcdg5.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBL07U2mv0m4DMiESjIvmEZEn-jXbhgHak';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

const localizer = BigCalendar.momentLocalizer(moment)

export default class CalendarPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      googleEvents: []
    };
    this.fetchEvents = this.fetchEvents.bind(this);
    this.signInOrSetStatus = this.signInOrSetStatus.bind(this);
    this.onSignInStatusUpdate = this.onSignInStatusUpdate.bind(this);
    this.listUpcomingEvents = this.listUpcomingEvents.bind(this);
    this.eventStyleGetter = this.eventStyleGetter.bind(this);
  }

  componentDidMount() {
    if (window.gapi.auth2) {
      this.signInOrSetStatus();
    } else {
      // initialize then sign in
      window.gapi.load('client:auth2', () => {
        window.gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(() => {
          window.gapi.auth2.getAuthInstance().isSignedIn.listen(this.onSignInStatusUpdate);
          this.signInOrSetStatus();
        });
      });
    }
    this.fetchEvents();
  }

  fetchEvents() {
    fetch('/renter/request_list', {
      method: 'GET',
      credentials: 'include'
    }).then(res => res.json()).then(resJson => {
      let events = resJson.map(request => {
        let { formattedAddress, openHouse } = request.property;
        let shortAddr = formattedAddress.split(',')[0];
        let event = {
          start: new Date(openHouse.start),
          end: new Date(openHouse.end),
          allDay: false
        };
        if (request.agent) {
          event['title'] = `Agent going to open house for ${shortAddr}`;
          event['resource'] = { origin: 'agent' };
        } else {
          event['title'] = `Open house for ${shortAddr}`;
          event['resource'] = { origin: 'user' };
        }
        return event;
      });
      this.setState({ events });
    });
  }

  signInOrSetStatus() {
    let auth2 = window.gapi.auth2;
    if (auth2.getAuthInstance().isSignedIn.get()) {
      // signed in already, don't need to do anything
      this.onSignInStatusUpdate(true);
    } else {
      // initialized but not signed in
      auth2.getAuthInstance().signIn().catch(() => console.error('Failed to sign in'));
    }
  }

  onSignInStatusUpdate(isSignedIn) {
    if (isSignedIn) {
      this.props.setLogoutAction('calendar', this.signOut);
      this.listUpcomingEvents();
    } else {
      this.props.setLogoutAction('calendar', null);      
      this.setState({ googleEvents: [] });
    }
  }

  signOut() {
    window.gapi.auth2.getAuthInstance().signOut().then(() => {
      console.log('Signed out of Google Calendar');
    });
  }

  listUpcomingEvents() { // TODO list the right amount, right now it just grabs 200 events and displays on a calendar
    window.gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 200,
      'orderBy': 'startTime'
    }).then(response => {
      let getLocalDate = dateStr => {
        let date = new Date(dateStr);
        date.setTime(date.getTime() + 1000 * 60 * date.getTimezoneOffset())
        return date;
      }

      let googleEvents = response.result.items.map(item => (
        item.start.dateTime ? {
          title: item.summary,
          start: new Date(item.start.dateTime),
          end: new Date(item.end.dateTime),
          allDay: false,
          resource: { origin: 'google' }
        } : {
            title: item.summary,
            start: getLocalDate(item.start.date),
            end: getLocalDate(item.end.date),
            allDay: true,
            resource: { origin: 'google' }
          }
      ));
      this.setState({ googleEvents });
    });
  }

  eventStyleGetter(event, start, end, isSelected) {
    if (!event.resource) {
      return null;
    }
    let { origin } = event.resource;
    const originColors = {
      'google': {
        backgroundColor: '#3174AD',
        borderColor: '#265985'
      },
      'user': {
        backgroundColor: '#44BE8D',
        borderColor: '#39A978'
      },
      'agent': {
        backgroundColor: '#F48F42',
        borderColor: '#EF8A3D'
      }
    };
    return { style: originColors[origin] };
  }

  render() {
    let { events, googleEvents } = this.state;
    return (
      <div id="calendar-main" className="color-background">
        <div id="calendar-agenda">
          <div>
            <h4 style={{fontFamily: 'AppleGothic'}}>Today's Agenda</h4>
            {events.map(event => {
              return (
                <div className="calendar-agenda-entry" key={event.title}>
                  <div className="calendar-agenda-circle" style={this.eventStyleGetter(event).style}></div>
                  <div className="calendar-agenda-entry-text">
                    <p className="calendar-agenda-time">{event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p>{event.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div id="calendar-calendar">
          <BigCalendar
            events={googleEvents.concat(events)}
            localizer={localizer}
            min={new Date(0, 0, 0, 8, 0, 0, 0)}
            max={new Date(0, 0, 0, 20, 0, 0, 0)}
            views={['day', 'week', 'month']}
            popup
            onSelectEvent={event => (null)}
            eventPropGetter={this.eventStyleGetter}
          />
        </div>
      </div>
    );
  }
}
