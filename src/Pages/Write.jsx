import React from 'react'
import { HtmlEditor, Image, Inject, Link, QuickToolbar, RichTextEditorComponent, Toolbar } from '@syncfusion/ej2-react-richtexteditor';
import { useGapiContext, addCalendarEvent, getCalendarList, createCalendar } from '../API/GAPI';
import { Header, LineEditor, AreaEditor, SimpleButton, RadioButton } from '../Components'

// consts for gapi
const CALENDAR_NAME = 'C_DailyNote';

const Write = () => {
  var summary = '';
  var description = '';
  var calendarId = '';
  var score = {};
  const {gapi, setGapi, gapiLoggedIn, setgapiLoggedIn} = useGapiContext()

  // get input texts from html
  const onTextChange = (event) => {
    const {target: {name, value}} = event
    // console.log(name, value)
    
    if (name==="Summary") {
      console.log(summary)
      summary = value
    } else if (name === "Description") {
      console.log(description)
      description = value
    }
  };

  const onRadioChange = (name, value) => {
    score[name] = value;
    console.log('score:', score);
  };

  // submit button
  const onSubmit = () => {
    console.log(gapi);
    var prefix = JSON.stringify(score) + '\n';
    description = prefix + description;
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
      addCalendarEvent({
        gapi:gapi,
        summary:summary, 
        description:description, 
        calendarId
      }); // -> addCalendarEvent
    }); // -> getCalendarList
  };

  return (
    <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
      <Header category="Diary" title="Write"/>
      <LineEditor title='Summary' onChange={onTextChange}/>
      <AreaEditor title='Description' onChange={onTextChange}/>
      <RadioButton name="Today's mood" onChange={onRadioChange}></RadioButton>
      <SimpleButton onClick={onSubmit} color='white' bgColor='blue' text='Submit' borderRadius='10px' size='md'/>
    </div>
  )
};

export default Write