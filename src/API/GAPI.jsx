import React, { useState, createContext, useContext } from 'react';

const GapiContext = createContext();
export const useGapiContext = () => useContext(GapiContext);

// consts for gapi
const CALENDAR_CID = 'C_DailyNote';

export const GAPI = ({ children }) => {
  const [gapiLoaded, setGapiLoaded] = useState(false);  // gapi 객체 저장
  const [gapi, setGapi] = useState(window.gapi);  // gapi 객체 저장
  const [gapiLoggedIn, setgapiLoggedIn] = useState(false);  // 로그인 여부를 저장
  const [tokenClient, setTokenClient] = useState(null);  // gapi token 저장

  const initGapi = () => {
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID  // https://console.cloud.google.com/apis/credentials/oauthclient;
    const API_KEY = process.env.REACT_APP_GAPI_KEY  // https://console.developers.google.com/apis/credentials;
    const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    const SCOPES = "https://www.googleapis.com/auth/calendar.events";
  
    gapi.load('client:auth2', () => {
      console.log('gapi loaded')
  
      // init googla API
      // load google & gapi script
      const google_script = document.createElement("script");
      const gapi_script = document.createElement("script");
      google_script.src = "https://accounts.google.com/gsi/client";
      google_script.async = true;
      google_script.defer = true;
      gapi_script.src = "https://apis.google.com/js/api.js";
      gapi_script.async = true;
      gapi_script.defer = true;

      document.body.appendChild(gapi_script);
      document.body.appendChild(google_script);
  
      // after load script, set ready to sign in
      google_script.onload = async () => {
        // TODO : google is not defined 오류 해결
        const _tokenClient = await window.google.accounts.oauth2.initTokenClient({
          client_id : CLIENT_ID,
          scope: SCOPES
        });
        setTokenClient(_tokenClient);
      }
      
      gapi_script.onload = () => {
        gapi.load("client", 
          // Auth to google API
          gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: DISCOVERY_DOCS
          })
        );
      };
      
      // login
      if (!checkGapiIsLoggedIn()) {
        gapiLogin(gapi);
      }
      
      setGapiLoaded(true)
    }); // -> gapi.load
  }; // -> initGapi
  
  // TODO : 로그인 여부 확인
  const checkGapiIsLoggedIn = () => {
    return false;
  };
  
  // 로그인
  const gapiLogin = () => {
    if ( gapi === null || tokenClient == null) {
      console.log('api not loaded yet');
      return;
    }
    
    if (gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({prompt: ''});
    }
  };
  
  /* **********
  * 아래부터 실제 동작
  * **********/
 
 // init gapi client
 console.log('gapi is loaded :', gapiLoaded);
 if (!gapiLoaded) {
    initGapi();
  }
  
  return (
    <GapiContext.Provider
      value={({
          gapi,
          setGapi,
          gapiLoggedIn,
          setgapiLoggedIn,
          tokenClient,
          setTokenClient
      })}
    >
      {children}
    </GapiContext.Provider>
  )
};

/* 
  Update with your own Client Id and Api key 
*/
// TODO : map login into login button
// TODO : show limited page if not logged in (set login staste in context)


// TODO: compse getEvent function
export const addCalendarEvent = ({gapi, summary, location, description, start, end}) => {
  console.log('addCalendarEvent:', gapi, summary, location, description, start, end)
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
  if (gapi.client.getToken()) {
    var request = gapi.client.calendar.events.insert(
      {
        auth: gapi.auth2,
        calendarId: CALENDAR_CID,
        resource: event,
      },
      // call back function
      (error, response) => {
        if (error) {
          console.log("addEvent error:", error);
        }
        console.log("Event added:", response.data);
      }
    )
  }

  request.execute(event => {
    console.log(event)
  })
};

