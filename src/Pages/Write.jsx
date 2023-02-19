import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from "react-router-dom";

import { HtmlEditor, Image, Inject, Link, QuickToolbar, RichTextEditorComponent, Toolbar } from '@syncfusion/ej2-react-richtexteditor';
import { useGapiContext, gapiConfig } from '../API/GAPI';

import { Header, LineEditor, AreaEditor, SimpleButton, RadioButton, DateSelector } from '../Components';
import { parseJson } from '../API/JsonParser';
import { score_fields } from '../Data/configs';

// consts for gapi
const CALENDAR_NAME = gapiConfig.CALENDAR_NAME;

const Write = () => {
  const [summaryValue, setSummaryValue] = useState(null);
  
  const [descriptionValue, setDescriptionValue] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  
  const location = useLocation();
  const url_param = new URLSearchParams(window.location.search);
  
  const { isSignedIn, getEventById, getEventList, updateCalendarEvent, addCalendarEvent, getCalendarEvents, createCalendar, getCalendarList, gapiLogout, gapiLogin  } = useGapiContext()
  const infoRef = useRef(null);
  const [score, setScore] = useState({});
  
  // do once
  useEffect( () => {
    let newScore = {};
    score_fields.map(element => {
      newScore[element] = 50  // RadioButton 의 default 선택된 값
    });
    setScore(newScore);
  },[]);
  
  // things to do after login
  useEffect(() => {
    if (url_param.get("eventId")) {
      getEventById(url_param.get("eventId"), (a_event) => {
        var {metaData, body} = parseJson(a_event.description);
        setSummaryValue(a_event.summary);
        setDescriptionValue(body);
        setStartDate(a_event.start.dateTime);
        setSelectedDate(a_event.start.dateTime);
        if (metaData) {
          console.log(metaData);
          var newScore = { ...score };
          Object.entries(metaData).forEach(([key, value]) => {
            console.log(key, value, score);
            if (newScore.hasOwnProperty(key)) {
              newScore[key] = value;
            }
          });
          setScore(newScore);
        }
        console.log('event:', summaryValue, descriptionValue, selectedDate, score);
      });
    }
  }, [isSignedIn]);

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
    score[name] = value;
    console.log('score:', score);
    setScore(score);
  };

  // submit button
  const onSubmit = () => {
    
    // info 정보창 초기화
    setShowInfo('');
    console.log(infoRef.current);
    infoRef.current.style.transition = '';  // fade out
    infoRef.current.style.opacity = 1;
    console.log(infoRef.current);

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
      <Header category="Diary" title="Write"/>
      <LineEditor title='Summary' value={summaryValue} onChange={onTextChange}/>
      <DateSelector startDate={startDate} onDateChange={onDateChange}/>
      <AreaEditor title='Description' value={descriptionValue} onChange={onTextChange}/>
      {score && Object.entries(score).map(([key, value], index) => (
         <RadioButton key={index} name={key} value={value} onChange={onRadioChange}></RadioButton>
      ))}
      <SimpleButton onClick={onSubmit} color='white' bgColor='blue' text='Submit' borderRadius='10px' size='md'/>
      <p ref={infoRef} className='text-blue-600' style={{ opacity: 1, transition: "opacity 8s" }}>{showInfo}</p>
    </div>
  )
};

export default Write