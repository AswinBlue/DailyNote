import React, { useState, useEffect, createContext, useContext, useRef } from 'react';

const GapiContext = createContext();
export const gapiConfig = {
  "CALENDAR_NAME": 'C_DailyNote',
  "GOOGLE_LOGIN_BUTTON_ID": "googleProfileDiv",
};

export const useGapiContext = () => useContext(GapiContext);


export const GAPI = ({ children }) => {
  const gapi = useRef(null);  // gapi 객체 참조
  const google = useRef(null);  // gsi 객체 참조
  const tokenClient = useRef(null); // token 객체
  const [isSignedIn, setIsSignedIn] = useState(false);  // 화면 refresh 시에도 token을 저장하기 위해 tokenResponse를 저장

  // init gapi client, 최초 1회만 실행
  useEffect(() => {
    if (gapi.current === null || google.current === null) {
      console.log('initGapi');
      initGapi();
    }
  }, []);

  
  // load google apis by adding script, and login
  const initGapi = async () => {
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID  // https://console.cloud.google.com/apis/credentials/oauthclient;
    const API_KEY = process.env.REACT_APP_GAPI_KEY  // https://console.developers.google.com/apis/credentials;
    const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    const SCOPES = "https://www.googleapis.com/auth/calendar.events";

    // load google & gapi script

    const google_script = document.createElement("script");
    google_script.src = "https://accounts.google.com/gsi/client";
    google_script.async = true;
    google_script.defer = true;
    
    const gapi_script = document.createElement("script");
    gapi_script.src = "https://apis.google.com/js/api.js";
    gapi_script.async = true;
    gapi_script.defer = true;

    let google_script_check = new Promise((resolve) => {
      google_script.onload = async () => {
        // REFS: google is not defined 오류 : html에서는 google.으로 참조하였지만, react에서는 window.google. 으로 참조한다.
        console.log('google.accounts.oauth2', window.google.accounts.oauth2)
        if (tokenClient.current === null) {
          tokenClient.current = await window.google.accounts.oauth2.initTokenClient({
            client_id : CLIENT_ID,
            scope: SCOPES,
            // requestAccessToken 동작 이후 발생할 callback 함수 설정
            callback: (tokenResponse) => {
              console.log('tokenResponse:', tokenResponse);
              setIsSignedIn(tokenResponse.access_token);
            }
          });

          console.log('tokenClient initiated:', tokenClient.current);
        } // -> if tokenClient

        // :: google ID 로 로그인하는 방법 (api 사용하려면 token이 필요하여 아래 내용은 미사용)
        // if (google.current === null) {
        //   google.current = window.google;
        //   google.current.accounts.id.initialize({
        //     client_id : CLIENT_ID,
        //     scope: SCOPES,
        //     callback : (data) => console.log(data)
        //   });

        //   console.log('google initiated:', google.current);

        //   const googleLoginDiv = document.getElementById(gapiConfig.GOOGLE_LOGIN_BUTTON_ID);
        //   window.google.accounts.id.prompt();
        //   google.current.accounts.id.renderButton(googleLoginDiv, { 
        //     type: "standard",
        //     theme: "outline", 
        //     size: "medium"
        //   });
        // } // -> if google

        resolve();
      } // -> onload
    });
    
    let gapi_script_check = new Promise((resolve) => {
      gapi_script.onload = () => {
        if (gapi.current === null) {
          window.gapi.load("client", 
          // callback
          async () => {
            // Auth to google API
            await window.gapi.client.init({
              apiKey: API_KEY,
              discoveryDocs: DISCOVERY_DOCS,
            });
            gapi.current = window.gapi;
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
    gapiLogin(tokenClient, isSignedIn);
  }; // -> initGapi

  return (
    <GapiContext.Provider
      value={({
          gapi,
          google,
          tokenClient,
          isSignedIn,
          setIsSignedIn,
      })}
    >
      {children}
    </GapiContext.Provider>
  )
};

// 로그인, token client를 통해 access token을 받아옴
export const gapiLogin = (tokenClient, isSignedIn) => {
  if (tokenClient.current === null) {
      console.log('gapiLogin: api not loaded yet');
    return;
  }

  // if (gapi.current.client.getToken() === null) {
  if (isSignedIn === null) {
    tokenClient.current.requestAccessToken({prompt: 'consent'});
    console.log('gapiLogin: login with new session')
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.current.requestAccessToken({prompt: ''});
    console.log('gapiLogin: use existing session');
  }
};

export const gapiLogout = (gapi, google, setIsSignedIn) => {
  if ( gapi.current === null || google.current === null) {
    console.log('gapiLogin: api not loaded yet');
    return;
  }

  const token = gapi.current.client.getToken();
  if (token !== null) {
    google.current.accounts.oauth2.revoke(token.access_token);
    gapi.current.client.setToken('');
    setIsSignedIn(null);
    console.log('gapi logged out');
  }
}

/* 
  Update with your own Client Id and Api key 
*/

// TODO : map login into login button

// TODO : show limited page if not logged in (set login staste in context)
/*
<calendar object sample>
{
    "kind": "calendar#calendarListEntry",
    "etag": "\"---\"",
    "id": "---@group.calendar.google.com",
    "summary": "C_DailyNote",
    "timeZone": "UTC",
    "colorId": "17",
    "backgroundColor": "#9a9cff",
    "foregroundColor": "#000000",
    "selected": true,
    "accessRole": "owner",
    "defaultReminders": [],
    "conferenceProperties": {
        "allowedConferenceSolutionTypes": [
            "hangoutsMeet"
        ]
    }
}
*/ 
export const getCalendarList = (gapi, callback) => {
  if (gapi.current) {
    var request = gapi.current.client.calendar.calendarList.list();
    request.execute(event => {
      console.log(event);
      callback(event);
    });
  }
  else {
    console.log("getCalendarList:", 'gapi not loaded');
  }
};

export const createCalendar = (gapi, name, callback) => {
  if (gapi.current) {
    var request = gapi.current.client.calendar.calendars.insert({summary: name});
    request.execute(event => {
      console.log(event)
      callback(event);
    });
  }
  else {
    console.log("createCalendar:", 'gapi not loaded');
  }
}

/*
<event object sample>
{
 "kind": "calendar#events",
 "etag": "\"--\"",
 "summary": "C_DailyNote",
 "updated": "2022-11-28T10:56:02.736Z",
 "timeZone": "UTC",
 "accessRole": "owner",
 "defaultReminders": [],
 "nextSyncToken": "--",
 "items": [
  {
   "kind": "calendar#event",
   "etag": "\"--\"",
   "id": "--",
   "status": "confirmed",
   "htmlLink": "--",
   "created": "2022-05-24T09:52:55.000Z",
   "updated": "2022-05-24T14:21:40.742Z",
   "summary": "summary",
   "description": "{\"mood\":null,\"description\":\"\",\"summary\":\"summary\"}",
   "creator": {
    "email": "--"
   },
   "organizer": {
    "email": "--@group.calendar.google.com",
    "displayName": "C_DailyNote",
    "self": true
   },
   "start": {
    "dateTime": "2022-05-23T15:00:00Z",
    "timeZone": "Asia/Seoul"
   },
   "end": {
    "dateTime": "2022-05-23T16:00:00Z",
    "timeZone": "Asia/Seoul"
   },
   "iCalUID": "--@google.com",
   "sequence": 0,
   "reminders": {
    "useDefault": true
   },
   "eventType": "default"
  },

  ...
  ]
}
  */
export const getCalendarEvents = (gapi, calendarId, callback) => {

  if (gapi.current.client.getToken()) {
    console.log('getCalendarEvent:', calendarId);
    var request = gapi.current.client.calendar.events.list({
        'calendarId': calendarId
      });
      
      request.execute(event => {
        console.log(event)
        callback(event);
      });
  } else {
    console.log("addCalendarEvent: token is null");
  }
};

export const addCalendarEvent = async ({
  gapi, summary='', location='', description='', 
  start= new Date().toISOString(),
  end= new Date().toISOString(), 
  calendarId}) => {

  var result = false;

  if (start === end)
  {
    end.setMinutes(start.getMinutes() + 30);
    end = end.toISOString();
  }

  console.log('addCalendarEvent:', summary, location, description, start, end, calendarId);
  var event = {
    'summary': summary,
    // 'location': {location},  // TODO : set location
    'description': description,
    'start': {
      'dateTime': start,  // TODO : set time
      'timeZone': ''
    },
    'end': {
      'dateTime': end,
      'timeZone': ''
    }
  }

  if (gapi.current.client.getToken()) {
    await new Promise((resolve) => {
      var request = gapi.current.client.calendar.events.insert(
        {
          calendarId: calendarId,
          resource: event,
        }
      );
    
      request.execute(event => {
        console.log(event)
        if (event.status == 'confirmed') {
          console.log(event.status);
          result = true;
          resolve();
        }
      })
    }, 10000); // -> promise

    console.log(result);

  } else {
    console.log("addCalendarEvent: token is null");
  }

  console.log('addCalendarEvent result', result);
  return result;
};

export const updateCalendarEvent = async ({
  gapi, summary, location, description, 
  start, end, calendarId, eventId}) => {

  var result = false;

  if (start === end)
  {
    end.setMinutes(start.getMinutes() + 30);
    end = end.toISOString();
  }

  console.log('updateCalendarEvent:', summary, location, description, start, end, calendarId, eventId);
  var event = {
    'summary': summary,
    // 'location': {location},  // TODO : set location
    'description': description,
    'start': {
      'dateTime': start,  // TODO : set time
      'timeZone': ''
    },
    'end': {
      'dateTime': end,
      'timeZone': ''
    }
  }

  if (gapi.current.client.getToken()) {
    await new Promise((resolve) => {
      var request = gapi.current.client.calendar.events.update(
        {
          calendarId: calendarId,
          eventId: eventId,
          resource: event,
        }
      );
    
      request.execute(event => {
        console.log(event)
        if (event.status == 'confirmed') {
          console.log(event.status);
          result = true;
          resolve();
        }
      })
    }, 10000); // -> promise

    console.log(result);

  } else {
    console.log("updateCalendarEvent: token is null");
  }

  console.log('updateCalendarEvent result', result);
  return result;
};

export const getEventList = (gapi, callback) => {
  // load calendars to compose page
  getCalendarList(gapi, async (calendars) => {
      // things to do after getting lists
      calendars.items.map(item => {
        if (item.summary == gapiConfig.CALENDAR_NAME) {
          console.log('calendarId =', item.id);
          getCalendarEvents(gapi, item.id, (events) => {
            callback(events);
          });  //-> getCalendarEvents
        }
      });  //-> map
  });  //-> getCalendarList
};

export const getEventById = (gapi, eventId, callback) => {
  // load calendars to compose page
  getCalendarList(gapi, async (event) => {
      // things to do after getting lists
      event.items.map(item => {
        if (item.summary == gapiConfig.CALENDAR_NAME) {
          // console.log('calendarId =', item.id);
          getCalendarEvents(gapi, item.id, (response) => {
            response.items.map(a_event => {
              // console.log('event:', a_event);
              if (a_event.id == eventId) {
                callback(a_event);
              }
            });
          });  //-> getCalendarEvents
        }
      });  //-> map
  });  //-> getCalendarList
};
