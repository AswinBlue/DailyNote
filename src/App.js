import React from 'react';
import logo from './logo.svg';
import './App.css';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';

import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

function App() {

  var gapi = window.gapi
  /* 
    Update with your own Client Id and Api key 
  */
  var CLIENT_ID = ""
  var API_KEY = ""
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
  var SCOPES = "https://www.googleapis.com/auth/calendar.events"

  const activeMenu = false;

  const handleClick = () => {
    gapi.load('client:auth2', () => {
      console.log('loaded client')

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })

      gapi.client.load('calendar', 'v3', () => console.log('bam!'))

      gapi.auth2.getAuthInstance().signIn()
      .then(() => {
        
        var event = {
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

        var request = gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': event,
        })

        request.execute(event => {
          console.log(event)
          window.open(event.htmlLink)
        })
        

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
    

      })
    })
  }


  return (
    <div>
      <BrowserRouter>
        <div className='flex relative dark:bg-main-dark-bg'>
          <div className="fixed right-4 bottom-4 z-50">
            <TooltipComponent content="Settings" position="Top">
              <button type="button" className="text-3xl p-3 hover:drop-shadow-xl text-white hover:bg-light-gray rounded-full" style={{ background:'blue'}}>
                <FiSettings/>
              </button>
            </TooltipComponent>
          </div>

          {activeMenu ? (
            <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white'>
              <Sidebar></Sidebar>
            </div>
          ) : (
            <div className='w-0 dark:bg-secondary-dark-bg'>
              <Sidebar></Sidebar>
            </div>
          )}
          <div className={
            `dark:bg-main-bg bg-main-bg min-h-screen w-full' ${activeMenu ? 'md:ml-72' : 'flex-2'}`
          }>
            <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
              <Navbar></Navbar>
            </div>
          </div>

          <div>
            <Routes>
              <Route path="/" element="Calendar Dashboard"/>
              <Route path="/dashboard" element="Clendar Dashboard"/>

              <Route path="/write" element="Write"/>
              <Route path="/read" element="Read"/>


              <Route path="/kanban" element="Kanban"/>
              <Route path="/editor" element="Editor"/>
              <Route path="/calendar" element="Calendar"/>
              <Route path="/kanban" element="Kanban"/>

              <Route path="/line" element="Line"/>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
