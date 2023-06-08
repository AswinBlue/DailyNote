import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const GapiContext = createContext();
export const gapiConfig = {
  "CALENDAR_NAME": 'C_DailyNote',
  "GOOGLE_LOGIN_BUTTON_ID": "googleProfileDiv",
};

export const useGapiContext = () => useContext(GapiContext);

export const GAPI = ({ children }) => {
  const navigate = useNavigate();
  // google api constants
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID  // https://console.cloud.google.com/apis/credentials/oauthclient;
  const SCOPE = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
  const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  const USER_PROFILE_REQUEST_URL = `https://www.googleapis.com/oauth2/v3/userinfo`;
  // 새로고침에도 저장할 내용들은 useRef 사용하여 저장
  const gapi = useRef(null);  // gapi 객체 참조
  const tokenClient = useRef(null); // token 객체
  const accessToken = useRef(null);  // 화면 refresh 시에도 token을 저장하기 위해 tokenResponse를 저장
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({});

  // init gapi client, 최초 1회만 실행
  useEffect(() => {
    if (gapi.current === null || window.google === null) {
      console.log('initGapi');
      initGapi();
    }
  }, []);

  // 로그인 상태 갱신
  useEffect(() => {
    // console.log('loginStatus:', accessToken.current);
    if (accessToken.current) {
      setIsSignedIn(true);
    } else {
      setIsSignedIn(false);
    }
  }, [accessToken.current]);
  
  const initTokenClient = async () => {
    // console.log('google.accounts.oauth2', window.google.accounts.oauth2)
    if (tokenClient.current === null) {
      tokenClient.current = await window.google.accounts.oauth2.initTokenClient({
        // TODO: check it works in mobile
        client_id : CLIENT_ID,
        redirect_uri : process.env.REACT_APP_HOME_PAGE + "/login",
        scope: SCOPE,
        ux_mode: 'redirect', // redirect 모드, 별도 정의 없을시 기본 팝업
        // requestAccessToken 동작 이후 발생할 callback 함수 설정
        callback: (tokenResponse) => {
          console.log('tokenResponse:', tokenResponse);
          if (tokenResponse.error) {
            console.log('tokenError:', tokenResponse.error);
          } else {
            // when login success
            if (accessToken.current != tokenResponse.access_token) {
              accessToken.current = tokenResponse.access_token;
              getUserProfileData(tokenResponse.access_token);
            }
            setIsSignedIn(true);
          }
        }
      });
      console.log('tokenClient initiated:', tokenClient.current);
    } // -> if tokenClient
  }
  
  // load google apis by adding script, and login
  const initGapi = async () => {
    
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
        // google calendar api 사용하기 위한 토큰
        await initTokenClient();
        
        // Google ID  로그인 사용
        // await window.google.accounts.id.initialize({
        //   client_id: CLIENT_ID,
        //   scope: SCOPE,
        //   callback: () => {
        //     console.log('GOOGLE ID LOGGED IN');
        //   }
        // });

        resolve();
      } // -> onload
    });
    
    let gapi_script_check = new Promise((resolve) => {
      gapi_script.onload = () => {
        // initGapi
        if (gapi.current === null) {
          window.gapi.load("client", 
          // callback
          async () => {
            // Auth to google API
            await window.gapi.client.init({
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
    gapiLogin();
  }; // -> initGapi

  // googleId 사용시
  // const gapiRenderLoginButton = () => {
  //   if (!window.google) {
  //     return;
  //   }

  //   const btn = document.getElementById(gapiConfig.GOOGLE_LOGIN_BUTTON_ID);
  //   // window.google.accounts.id.prompt()
  //   console.log(btn, 'on');
  //   new Promise((resolve) => {
  //     window.google.accounts.id.renderButton(btn,
  //       { theme: "outline", size: "large" }  // customization attributes
  //     ).then(() => {
  //       console.log('button rendered');
  //       resolve();
  //     })
  //   });
  //   console.log('button rendered2');
  // };
  
  const getUserProfileData = (accessToken) => {
    new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', USER_PROFILE_REQUEST_URL);
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
        xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
        xhr.onreadystatechange = () => {
          if (xhr.readyState !== 4) {
            return;
          }
          const response = JSON.parse(xhr.responseText);
          if (xhr.status === 200) {
            resolve(response);
          } else {
            reject(xhr, response);
          }
        };
        xhr.send(null);
    }).then(
      (response) => {
        const newProfile = {
          "email": response.email,
          "image":response.picture,
          "name": response.name,
        };
        console.log('newProfile:', newProfile);
        setUserProfile(newProfile);
      },
      (errorMessage) => {
        console.log(errorMessage);
      }
    );
} 

  // 로그인, token client를 통해 access token을 받아옴
  const gapiLogin = () => {
    if (!tokenClient.current || !gapi.current) {
        console.log('gapiLogin: api not loaded yet', tokenClient.current);
      return;
    }

    // if (gapi.current.client.getToken() === null) {
    // if (gapi.current.client.getToken() === null) {
    //   tokenClient.current.requestAccessToken({prompt: 'consent'});
    //   tokenClient.current.requestAccessToken({prompt: 'consent'});
    //   console.log('gapiLogin: login with new session')
    // } else 
    {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.current.requestAccessToken({prompt: ''});
      // console.log('gapiLogin: use existing session');
    }
  };

  const gapiLogout = () => {
    if (gapi.current === null || window.google === null) {
      console.log('gapiLogout: api not loaded yet', gapi.current, window.google);
      return;
    }

    if (!accessToken.current) {
      console.log('not logged in yest');
    }

    const token = gapi.current.client.getToken();
    console.log(token);
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token,
        (done) => {
          gapi.current.client.setToken('');
          accessToken.current = null;
          setIsSignedIn(false);
          console.log('logout');
          navigate("/"); // navigate to home
        }
      );
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
  const getCalendarList = (callback) => {
    if (gapi.current) {
      var request = gapi.current.client.calendar.calendarList.list();
      request.execute(event => {
        console.log(event);
        if (!event) {
          return;
        }
        callback(event);
      });
    }
    else {
      console.log("getCalendarList:", 'gapi not loaded');
    }
  };

  const deleteEvent = (eventId, callback) => {
    // load calendars to compose page
    getCalendarList(async (calendars) => {
      if (!calendars.items) {
        return;
      }
      // things to do after getting lists
      calendars.items.map(item => {
        if (!item) {
          return;
        }
        if (item.summary == gapiConfig.CALENDAR_NAME) {
          console.log('calendarId =', item.id);
          gapi.current.client.calendar.events.delete({
            "calendarId": item.id,
            "eventId": eventId,
          }).then((response) => {
            // Handle the results here (response.result has the parsed body).
            callback(response);
          }, (err) => {
            callback(callback);
          });
        }
      }); // -> map
    });  //-> getCalendarList
  };

  const createCalendar = (name, callback) => {
    if (gapi.current) {
      var request = gapi.current.client.calendar.calendars.insert({summary: name});
      request.execute(event => {
        if (!event) {
          return;
        }
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
  const getCalendarEvents = (calendarId, callback) => {

    if (gapi.current.client.getToken()) {
      console.log('getCalendarEvent:', calendarId);
      var request = gapi.current.client.calendar.events.list({
          'calendarId': calendarId
        });
        
        request.execute(event => {
          console.log(event);
          if (!event) {
            return;
          }
          callback(event);
        });
    } else {
      console.log("addCalendarEvent: token is null");
    }
  };

  const addCalendarEvent = async (
    summary='', location='', description='', 
    start= new Date().toISOString(),
    end= new Date().toISOString(), 
    calendarId) => {

    var result = false;
    
    if (start === end)
    {
      var s = new Date(start);
      var e = new Date(end);
      e.setMinutes(s.getMinutes() + 30);
      end = e.toISOString();
    }
    console.log(summary, location, description, start, end, calendarId);

    console.log('addCalendarEvent:', summary, location, description, start, end, calendarId);
    var event = {
      'summary': summary,
      // 'location': {location},  // TODO : set location
      'description': description,
      'start': {
        'dateTime': start,
        'timeZone': ''
      },
      'end': {
        'dateTime': end,
        'timeZone': ''
      }
    }

    if (gapi.current.client.getToken()) {
      await new Promise((resolve, reject) => {
        var request = gapi.current.client.calendar.events.insert(
          {
            calendarId: calendarId,
            resource: event,
          }
        ).then((response) => {
          // Handle the results here (response.result has the parsed body).
          console.log(response);
          result = true;
          resolve();
        }, (err) => {
          console.log(err);
          reject();
        });
      }, 10000); // -> promise
    } else {
      // not logged in
      console.log("addCalendarEvent: token is null");
    }
    console.log('addCalendarEventResult:', result);
    return result;
  };

  const updateCalendarEvent = async (
    summary, location, description, 
    start, end, calendarId, eventId) => {

    var result = false;

    if (start === end)
    {
      var s = new Date(start);
      var e = new Date(end);
      e.setMinutes(s.getMinutes() + 30);
      end = e.toISOString();
    }

    console.log('updateCalendarEvent:', summary, location, description, start, end, calendarId, eventId);
    var event = {
      'summary': summary,
      // 'location': {location},  // TODO : set location
      'description': description,
      'start': {
        'dateTime': start,
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

  const getEventList = (callback) => {
    // load calendars to compose page
    getCalendarList(async (calendars) => {
        if (!calendars.items) {
          return;
        }
        // things to do after getting lists
        calendars.items.map(item => {
          if (!item) {
            return;
          }
          if (item.summary == gapiConfig.CALENDAR_NAME) {
            console.log('calendarId =', item.id);
            getCalendarEvents(item.id, (events) => {
              if (!events) {
                return;
              }
              callback(events);
            });  //-> getCalendarEvents
          }
        });  //-> map
    });  //-> getCalendarList
  };

  const getEventById = (eventId, callback) => {
    // load calendars to compose page
    getCalendarList(async (event) => {
        if (!event.items) {
          return;
        }
        // things to do after getting lists
        event.items.map(item => {
          if (!event) {
            return;
          }
          if (item.summary == gapiConfig.CALENDAR_NAME) {
            // console.log('calendarId =', item.id);
            getCalendarEvents(item.id, (response) => {
              if (!response) {
                return;
              }
              response.items.map(a_event => {
                if (!a_event) {
                  return;
                }
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

  return (
    <GapiContext.Provider
      value={({
          isSignedIn,
          getEventById,
          getEventList,
          updateCalendarEvent,
          addCalendarEvent,
          getCalendarEvents,
          createCalendar,
          deleteEvent,
          getCalendarList,
          gapiLogout,
          gapiLogin,
          userProfile,
      })}
    >
      {children}
    </GapiContext.Provider>
  )
};