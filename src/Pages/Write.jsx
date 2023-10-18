import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from "react-router-dom";

import { Button } from "@syncfusion/ej2-buttons";
import { MouseEventArgs } from "@syncfusion/ej2-base";
import { useGapiContext, gapiConfig } from '../API/GAPI';

import { Header, LineEditor, AreaEditor, SimpleButton, RadioButton, DateSelector, EditableList } from '../Components';
import { parseJson } from '../API/JsonParser';
import { score_field_prefix, score_field_default } from '../Data/configs';

// consts for gapi
const CALENDAR_NAME = gapiConfig.CALENDAR_NAME;

const Write = () => {
  const [summaryValue, setSummaryValue] = useState(null);
  
  const [descriptionValue, setDescriptionValue] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); //  dateSelector에서 선택한 날짜 데이터
  const [startDate, setStartDate] = useState(null); // 초기 날짜를 dateSelector에 전달하기위한 변수
  
  const location = useLocation();
  const url_param = new URLSearchParams(window.location.search);
  
  const { isSignedIn, getEventById, getEventList, updateCalendarEvent, addCalendarEvent, getCalendarEvents, createCalendar, getCalendarList, gapiLogout, gapiLogin  } = useGapiContext()
  const infoRef = useRef(null);
  const [score, setScore] = useState({});
  
  // things to do after login
  useEffect(() => {
    if (!parseUrl()) {
      // url 파싱할 내용이 없다면, 신규 event를 위해 기존 정보 load
      loadData();
    }
  }, [isSignedIn]);

  useEffect(() => {
    // TODO: reload RadioButton when score changes
    console.log('reload' + JSON.stringify(score, null, 2));
  }, [score]); // score

  /**
   * load calendar data from gapi, take scoreField
   */
  const loadData = () => {
    getEventList((events) => {
      console.log('events:', events);
      var newScore = { ...score};
      events.items.map(a_event => {
        var {metaData, body} = parseJson(a_event.description);
        if (metaData) {
          Object.entries(metaData).forEach(([key, value]) => {
            if (key.startsWith(score_field_prefix)) {
              // 이전에 사용한 항목이 있었는지 체크, 기본점수(50) 부여
              newScore[key] = 50;
            }
          });
        }
      });
      console.log('[write] loadData newScore:', newScore);
      setScore(newScore);
    });
  };
  const parseUrl = () => {
    if (url_param.get("eventId")) {
      getEventById(url_param.get("eventId"), (a_event) => {
        var {metaData, body} = parseJson(a_event.description);
        setSummaryValue(a_event.summary);
        setDescriptionValue(body);
        setStartDate(a_event.start.dateTime);
        setSelectedDate(a_event.start.dateTime);
        if (metaData) {
          console.log(metaData);
          var newScore = { ...score }; // deep copy score
          // for all key,value in json object
          Object.entries(metaData).forEach(([key, value]) => {
            newScore[key] = value;
          });
          setScore(newScore);
        }
        console.log('event:', summaryValue, descriptionValue, selectedDate, score);
      });
      return true;
    } else if (url_param.get("startTime")) {
      let startTime = new Date(url_param.get("startTime"));
      console.log('startTime:', startTime);
      setSelectedDate(startTime);
      setStartDate(startTime);
      return true;
    }
    else {
      return false;
    }
  };
  
  // get input texts from html
  const onTextChange = (event) => {
    const {target: {name, value}} = event
    // console.log(name, value)
    
    if (name==="Summary") {
      // console.log(summaryValue)
      setSummaryValue(value);
    } else if (name === "Description") {
      // console.log(descriptionValue)
      setDescriptionValue(value);
    }
  };

  const onDateChange = (dateTime) => {
    console.log('onDateChange:', dateTime);
    setSelectedDate(dateTime);
  };

  const onRadioChange = (name, value) => {
    if (score.hasOwnProperty(name)) {
      score[name] = value;
      console.log('score:', score);
      setScore(score);
    }
  };

  // submit button
  const onSubmit = () => {
    // info 정보창 초기화
    setShowInfo('');
    infoRef.current.style.transition = '';  // fade out
    infoRef.current.style.opacity = 1;
    
    if (!isSignedIn) {
      // do only when logged in
      setShowInfo('Login first');
      infoRef.current.style.transition = 'opacity 8s';  // fade out
      infoRef.current.style.opacity = 0;  // fade out
      return;
    }

    var calendarId = '';
    var prefix = JSON.stringify(score) + '\n';
    var description = prefix + descriptionValue;

    // check CALENDAR_NAME exist. if not, create one
    getCalendarList(async (event) => {
      await new Promise((resolve) => {
        // things to do after getting lists
        event.items.map(item => {
          if (item.summary == CALENDAR_NAME) {
            calendarId = item.id;
            console.log('calendarId =', calendarId);
            resolve();
          }
        });
        // if calendar not found
        if (calendarId == '') {
          console.log('calendar not found, create one');
          createCalendar(CALENDAR_NAME, (event) => {
            calendarId = event.id;
            console.log('calendarId =', calendarId);
            resolve();
          }); // -> createCalendar
        }
      }); // -> promise

      console.log('eventId:', url_param.get("eventId"));
      if (url_param.get("eventId")) {
        // update event
        var result = updateCalendarEvent(summaryValue, location, description, 
          selectedDate, selectedDate, calendarId, url_param.get("eventId"));  // -> updateCalendarEvent

        // if success, show info data
        if (result) {
          setSummaryValue('');
          setDescriptionValue('');
          setShowInfo('');
          console.log('submitted');
          setShowInfo('submitted');
        } else {
          console.log('failed');
          setShowInfo('Something wrong. Please try again');
        }
        infoRef.current.style.transition = 'opacity 8s';  // fade out
        infoRef.current.style.opacity = 0;  // fade out
      }
      else {
        // add new event to calendar
        var result = addCalendarEvent(summaryValue, null, description, selectedDate, selectedDate, calendarId); // -> addCalendarEvent

        // if success, show info data
        if (result) {
          setSummaryValue('');
          setDescriptionValue('');
          setShowInfo('');
          console.log('submitted');
          setShowInfo('submitted');
        } else {
          console.log('failed');
          setShowInfo('Something wrong. Please try again');
        }
        infoRef.current.style.transition = 'opacity 8s';  // fade out
        infoRef.current.style.opacity = 0;  // fade out
      }
    }); // -> getCalendarList
  };

  return (
    <div className='m-10 p-10 bg-white rounded-3xl'>
      <Header category={process.env.REACT_APP_PAGE_NAME} title="Write"/>
      <LineEditor title='Summary' value={summaryValue} onChange={onTextChange}/>
      <DateSelector startDate={startDate} onDateChange={onDateChange}/>
      <AreaEditor title='Description' value={descriptionValue} onChange={onTextChange}/>
      {/* // TODO: 점수 항목 추가할수 있게 */}
      {/* {score && Object.entries(score).map(([key, value], index) => {
          // remove score_field_prefix from key
          key = key.slice(score_field_prefix.length);
          return <RadioButton key={index} name={key} value={value} onChange={onRadioChange}></RadioButton>
      })} */}
      <EditableList listData={score} rowComponent={RadioButton}></EditableList>
      <SimpleButton onClick={onSubmit} color='white' bgColor='blue' text='Submit' borderRadius='10px' size='md'/>
      <p ref={infoRef} className='text-blue-600' style={{ opacity: 1, transition: "opacity 8s" }}>{showInfo}</p>
    </div>
  )
};

export default Write