import React, { useState, useEffect, createContext, useContext, useRef } from 'react';

const GapiContext = createContext();
export const useGapiContext = () => useContext(GapiContext);

// consts for gapi
const CALENDAR_CID = 'C_DailyNote';

export const GAPI = ({ children }) => {
  const [gapiLoggedIn, setgapiLoggedIn] = useState(false);  // 로그인 여부를 저장
  const gapi = useRef(null);  // gapi 객체 참조
  const tokenClient = useRef(null);  // gapi token 참조

  const initGapi = async () => {
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID  // https://console.cloud.google.com/apis/credentials/oauthclient;
    const API_KEY = process.env.REACT_APP_GAPI_KEY  // https://console.developers.google.com/apis/credentials;
    const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    const SCOPES = "https://www.googleapis.com/auth/calendar.events";

    // load google & gapi script
    const google_script = document.createElement("script");
    const gapi_script = document.createElement("script");
    google_script.src = "https://accounts.google.com/gsi/client";
    google_script.async = true;
    google_script.defer = true;
    gapi_script.src = "https://apis.google.com/js/api.js";
    gapi_script.async = true;
    gapi_script.defer = true;

    let google_script_check = new Promise((resolve) => {
      google_script.onload = async () => {
        // REFS: google is not defined 오류 : html에서는 google.으로 참조하였지만, react에서는 window.google. 으로 참조한다.
        if (tokenClient.current === null) {
          tokenClient.current = await window.google.accounts.oauth2.initTokenClient({
            client_id : CLIENT_ID,
            scope: SCOPES
          });
          // setTokenClient(_tokenClient);
          console.log('tokenClient initiated:', tokenClient.current);
          resolve();
        } // -> if tokenClient
      } // -> onload
    });
    
    let gapi_script_check = new Promise((resolve) => {
      gapi_script.onload = () => {
        if (gapi.current === null) {
          gapi.current = window.gapi;
          gapi.current.load("client", 
          // callback
          async () => {
            // Auth to google API
            await gapi.current.client.init({
              apiKey: API_KEY,
              discoveryDocs: DISCOVERY_DOCS
            });
            // setGapi(window.gapi);
            console.log('gapi initiated:', gapi.current);
            resolve();
          } // -> callback
          ); // -> gapi.load
        } // -> if gapi
      } // -> onload
    });
      
    document.body.appendChild(gapi_script);
    document.body.appendChild(google_script);
    
    // wait untill all scripts are loaded
    // REFS: async 함수 안에서 Promise로 비동기 함수들 생성 후 await Promise.all 함수로 모두 완료됨을 체크
    await Promise.all([gapi_script_check, google_script_check]);
    // login
    console.log('login status =', gapiLoggedIn);
    if (gapiLoggedIn === false) {
      setgapiLoggedIn(gapiLogin(gapi));
    }
  }; // -> initGapi
    
  // 로그인
  const gapiLogin = () => {
    if ( gapi.current === null || tokenClient.current === null) {
        console.log('gapiLogin: api not loaded yet');
      return false;
    }
    
    if (gapi.current.client.getToken() === null) {
      tokenClient.current.requestAccessToken({prompt: 'consent'});
      console.log('gapiLogin: login with new session')
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.current.requestAccessToken({prompt: ''});
      console.log('gapiLogin: use existing session')
    }
    return true;
  };
  
  /* **********
  * 아래부터 실제 동작
  * **********/
 
  // init gapi client
  if (gapi.current === null || tokenClient.current === null) {
    console.log('initGapi: gapi not loaded');
    initGapi();
  }
  
  return (
    <GapiContext.Provider
      value={({
          gapi,
          gapiLoggedIn,
          setgapiLoggedIn,
          tokenClient,
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
  console.log('addCalendarEvent:', summary, location, description, start, end)
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

  if (gapi.current.client.getToken()) {
    var request = gapi.current.client.calendar.events.insert(
      {
        auth: gapi.current.auth2,
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
    
    request.execute(event => {
      console.log(event)
    })
  } else {
    console.log("addCalendarEvent: token is null");
  }
};

