import React from 'react';

var gapi = window.gapi
/* 
  Update with your own Client Id and Api key 
*/
var CLIENT_ID = process.env.REACT_APP_CLIENT_ID  // https://console.cloud.google.com/apis/credentials/oauthclient
var API_KEY = process.env.REACT_APP_GAPI_KEY  // https://console.developers.google.com/apis/credentials
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
var SCOPES = "https://www.googleapis.com/auth/calendar.events"

// TODO : map login into login button
// TODO : show limited page if not logged in (set login staste in context)
export const init = () => {
  gapi.load('client:auth2', () => {
    console.log('loaded client')
    
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
  })
}

export const login = () => {
  gapi.auth2.getAuthInstance().signIn()
}

var sample_event = {
  'summary': 'Awesome Event!',
  'location': '800 Howard St., San Francisco, CA 94103',
  'description': 'Really great refreshments',
  'start': {
    'dateTime': '2020-06-28T09:00:00-07:00',
    'timeZone': 'America/Los_Angeles'
  },
  'end': {
    'dateTime': '2020-06-28T17:00:00-07:00',
    'timeZone': 'America/Los_Angeles'
  },
  'recurrence': [
    'RRULE:FREQ=DAILY;COUNT=2'
  ],
  'attendees': [
    {'email': 'lpage@example.com'},
    {'email': 'sbrin@example.com'}
  ],
  'reminders': {
    'useDefault': false,
    'overrides': [
      {'method': 'email', 'minutes': 24 * 60},
      {'method': 'popup', 'minutes': 10}
    ]
  }
}

// TODO: compse getEvent function

export const addEvent = ({summary, location, description, start, end}) => {
  var event = {
    'summary': {summary},
    'location': {location},
    'description': {description},
    'start': {
      'dateTime': '',  // TODO : set time
      'timeZone': ''
    },
    'end': {
      'dateTime': '',
      'timeZone': ''
    }
  }

  var request = gapi.client.calendar.events.insert({
    'calendarId': 'primary',
    'resource': event,
  })

  request.execute(event => {
    console.log(event)
    window.open(event.htmlLink)
  })

}

        

/*
    Uncomment the following block to get events
*/
/*
// get events
gapi.client.calendar.events.list({
  'calendarId': 'primary',
  'timeMin': (new Date()).toISOString(),
  'showDeleted': false,
  'singleEvents': true,
  'maxResults': 10,
  'orderBy': 'startTime'
}).then(response => {
  const events = response.result.items
  console.log('EVENTS: ', events)
})
*/