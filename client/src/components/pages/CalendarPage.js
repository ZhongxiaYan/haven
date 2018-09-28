import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarPage.css';

const CLIENT_ID = '86350647985-dn58p8o4te6kk05199m38p36s03pcdg5.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBL07U2mv0m4DMiESjIvmEZEn-jXbhgHak';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

const localizer = BigCalendar.momentLocalizer(moment)

export default class CalendarPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
    this.signInOrSetStatus = this.signInOrSetStatus.bind(this);
    this.onSignInStatusUpdate = this.onSignInStatusUpdate.bind(this);
    this.listUpcomingEvents = this.listUpcomingEvents.bind(this);
    this.eventStyleGetter = this.eventStyleGetter.bind(this);
  }

  componentDidMount() {
    console.log('component did mount', this.state)
    let auth2 = window.gapi.auth2;
    if (auth2) {
      this.signInOrSetStatus(auth2);
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
          this.signInOrSetStatus(window.gapi.auth2);
        });
      });
    }
  }

  signInOrSetStatus(auth2) {
    if (auth2.getAuthInstance().isSignedIn.get()) {
      // signed in already, don't need to do anything
      this.onSignInStatusUpdate(true);
    } else {
      // initialized but not signed in
      auth2.getAuthInstance().signIn().catch(() => console.error('Failed to sign in'));
    }
  }

  onSignInStatusUpdate(isSignedIn) {
    console.log('update with status', isSignedIn)
    if (isSignedIn) {
      this.listUpcomingEvents();
    } else {
      this.setState({ events: [] });
    }
  }

  listUpcomingEvents() {
    window.gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    }).then(response => {
      let getLocalDate = dateStr => {
        let date = new Date(dateStr);
        date.setTime(date.getTime() + 1000 * 60 * date.getTimezoneOffset())
        return date;
      }

      let events = response.result.items.map(item => (
        item.start.dateTime ? {
          title: item.summary,
          start: new Date(item.start.dateTime),
          end: new Date(item.end.dateTime),
          allDay: false
        } : {
            title: item.summary,
            start: getLocalDate(item.start.date),
            end: getLocalDate(item.end.date),
            allDay: true
          }
      ));
      this.setState({ events });
    });
  }

  eventStyleGetter(event, start, end, isSelected) {
    if (!event.resource) {
      return null;
    }
    let { original } = event.resource;
    let backgroundColor = original ? '#3174AD' : '#44BE8D';
    let borderColor = original ? '#265985' : '#39A978';
    let style = { backgroundColor, borderColor };
    return { style };
  }

  render() {
    console.log('render', this.state.events)
    return (
      <div id="calendar-main">
        <div id="calendar-agenda">

        </div>
        <div id="calendar-calendar" style={{ height: '700px' }}>
          <BigCalendar
            events={this.state.events}
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
