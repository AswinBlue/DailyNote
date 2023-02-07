import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from "react-router-dom";

import { HtmlEditor, Image, Inject, Link, QuickToolbar, RichTextEditorComponent, Toolbar } from '@syncfusion/ej2-react-richtexteditor';
import { useGapiContext, addCalendarEvent, getCalendarList, createCalendar, gapiConfig, getCalendarEvents } from '../API/GAPI';
import { Header, LineEditor, AreaEditor, SimpleButton, RadioButton, DateSelector } from '../Components'

// consts for gapi
const CALENDAR_NAME = gapiConfig.CALENDAR_NAME;

const Write = () => {
  const [summaryValue, setSummaryValue] = useState(null);
  const [descriptionValue, setDescriptionValue] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const location = useLocation();
  const { param_eventId } = new URLSearchParams(location.search);
  // TODO : erase this
  // sample : vsv58mq7ps61c13vvqrn7i57i0

  const {gapi, setGapi, isSignedIn, setIsSignedIn} = useGapiContext()
  const infoRef = useRef(null);

  const score_fields = ["Today's mood"];
  var score = {};
  score_fields.forEach(element => {
    score[element] = "50"  // RadioButton 의 default 선택된 값
  });

  // things to do first
  useEffect(() => {
    if (param_eventId) {
      loadData();
    }
  }, [isSignedIn])
  
  

  // get input texts from html
  const onTextChange = (event) => {
    const {target: {name, value}} = event
    
    // console.log(name, value)
    
    if (name==="Summary") {
      console.log(summaryValue)
      setSummaryValue(value);
    } else if (name === "Description") {
      console.log(descriptionValue)
      setDescriptionValue(value);
    }
  };

  const onDateChange = (selectedDate) => {
    console.log('onDateChange:', selectedDate);
  };

  const onRadioChange = (name, value) => {
    score[name] = value;
    console.log('score:', score);
  };

  // submit button
  // TODO: submit 버튼 클릭시 팝업 호출 및 중복 적용 안되도록 수정
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
    getCalendarList(gapi, async (event) => {
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
          createCalendar(gapi, CALENDAR_NAME, (event) => {
            calendarId = event.id;
            console.log('calendarId =', calendarId);
            resolve();
          }); // -> createCalendar
        }
      }); // -> promise

      // add new event to calendar
      var result = addCalendarEvent({
        gapi:gapi,
        summary:summaryValue, 
        description:descriptionValue, 
        calendarId
      }); // -> addCalendarEvent
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
      infoRef.current.style.transition = 'opacity 5s';  // fade out
      infoRef.current.style.opacity = 0;  // fade out
    }); // -> getCalendarList
  };

  const loadData = () => {
    // load calendars to compose page
    getCalendarList(gapi, async (event) => {
        // things to do after getting lists
        event.items.map(item => {
          if (item.summary == CALENDAR_NAME) {
            console.log('calendarId =', item.id);
            getCalendarEvents(gapi, item.id, (response) => {
              response.items.map(a_event => {
                if (a_event.items.id == param_eventId) {
                  console.log('event:', a_event.summary, a_event.description)
                  setSummaryValue(a_event.summary);
                  setDescriptionValue(a_event.description);
                }
              });
            });  //-> getCalendarEvents
          }
        });  //-> map
    });  //-> getCalendarList
  }

  return (
    <div className='m-10 p-10 bg-white rounded-3xl'>
      <Header category="Diary" title="Write"/>
      <LineEditor title='Summary' value={summaryValue} onChange={onTextChange}/>
      <DateSelector onDateChange={onDateChange}/>
      <AreaEditor title='Description' value={descriptionValue} onChange={onTextChange}/>
      {score_fields.map((element, index) => {
        console.log('radiobutton', element);
        return <RadioButton name={element} onChange={onRadioChange}></RadioButton>
      })}
      <SimpleButton onClick={onSubmit} color='white' bgColor='blue' text='Submit' borderRadius='10px' size='md'/>
      <p ref={infoRef} className='text-gray-500' style={{ opacity: 1, transition: "opacity 5s" }}>{showInfo}</p>
    </div>
  )
};

export default Write