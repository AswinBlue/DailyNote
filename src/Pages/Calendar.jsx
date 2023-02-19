import React, { useEffect, useState } from 'react'
import { useGapiContext, gapiConfig } from '../API/GAPI';


import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, Month, Year, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { Header } from '../Components';
const Calendar = () => {
  const { isSignedIn, getEventById, getEventList, updateCalendarEvent, addCalendarEvent, getCalendarEvents, createCalendar, getCalendarList, gapiLogout, gapiLogin  } = useGapiContext()
  const CALENDAR_NAME = gapiConfig.CALENDAR_NAME;
  const [eventsData, setEventsData] = useState([]);
  // 최초 1회만 재 랜더링하도록 useEffect 사용
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // load calendars to compose page
    getCalendarList(async (event) => {
        // things to do after getting lists
        event.items.map(item => {
          if (item.summary == CALENDAR_NAME) {
            var totalData = [];
            console.log('calendarId =', item.id);
            getCalendarEvents(item.id, (response) => {
              response.items.map(a_event => {
                // TODO : 데이터 더 세분화 하기
                var data = {
                  "Subject": a_event.summary,
                  "StartTime": a_event.start.dateTime,
                  "EndTime": a_event.end.dateTime,
                  "Description": a_event.description,
                  "CategoryColor": '#1aaa55',
                };
                totalData.push(data);
              });
              console.log(totalData);
              setEventsData(totalData);
            });  //-> getCalendarEvents
          }
        });  //-> map
    });  //-> getCalendarList
  };

  return (
    // TODO : refresh 버튼 생성
    // TODO : 받아올 날짜 설정
    // TODO : 클릭했을 때 write로 redirect 되도록 / 혹은 설정 팝업 뜨지 않도록
    <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
      <Header category="App" title="Calendar" />
      <ScheduleComponent
        height='50em'
        eventSettings={{ dataSource: eventsData }}
        // selectedDate={new Date(2021, 0, 10)}
      >
         <ViewsDirective>
          {/* <ViewDirective option='Day' interval={7} displayName='Day' startHour='00:00' endHour='24:00' timeScale={{ enable: true, slotCount: 6 }}/> */}
          <ViewDirective option='Week' interval={1} displayName='Week' showWeekend={true} isSelected={true} timeScale={{ enable: true, slotCount: 6 }}/>
          <ViewDirective option='Month' showWeekNumber={true} readonly={true}/>
          <ViewDirective option='Year' showWeekNumber={true} readonly={true}/>
        </ViewsDirective>
        <Inject services={[Week, Month, Year, Resize, DragAndDrop]}/>
      </ScheduleComponent>
    </div>
  )
}

export default Calendar