import React from 'react'
import { HtmlEditor, Image, Inject, Link, QuickToolbar, RichTextEditorComponent, Toolbar } from '@syncfusion/ej2-react-richtexteditor';
import { Header, LineEditor, AreaEditor, SimpleButton } from '../Components'
import { useGapiContext, addCalendarEvent, getCalendarList, createCalendar } from '../API/GAPI';

// consts for gapi
const CALENDAR_NAME = 'C_DailyNote';

const Write = () => {
  var summary = '';
  var description = '';
  var calendarId = '';
  const {gapi, setGapi, gapiLoggedIn, setgapiLoggedIn} = useGapiContext()

  // get input texts from html
  const onChange = (event) => {
    const {target: {name, value}} = event
    // console.log(name, value)
    
    if (name==="Summary") {
      console.log(summary)
      summary = value
    } else if (name === "Description") {
      console.log(description)
      description = value
    }
  }

  // submit button
  const onClick = () => {
    console.log(gapi)

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
      addCalendarEvent({gapi:gapi, summary:summary, description:description, calendarId});
    }); // -> getCalendarList

  }


  return (
    <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
      <Header category="Diary" title="Write"/>
      <LineEditor title='Summary' onChange={onChange}/>
      <AreaEditor title='Description' onChange={onChange}/>
      <SimpleButton onClick={onClick} color='white' bgColor='blue' text='Submit' borderRadius='10px' size='md'/>
    </div>
  )
};

export default Write