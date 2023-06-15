import React, { useEffect, useRef, useState } from 'react'
import { useGapiContext, gapiConfig } from '../API/GAPI';
import { useNavigate } from 'react-router-dom';
import { parseJson } from '../API/JsonParser';
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, Month, Year, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { score_field_prefix } from '../Data/configs';
import { Header } from '../Components';
import { MdRefresh } from 'react-icons/md';

const Calendar = () => {
  const { isSignedIn, getCalendarEvents, getCalendarList, deleteEvent } = useGapiContext()
  const CALENDAR_NAME = gapiConfig.CALENDAR_NAME;
  const [eventsData, setEventsData] = useState([]);
  const navigate = useNavigate();
  const scheduleRef = useRef();

  useEffect(() => {
    loadData();
  }, [isSignedIn]);

  const loadData = () => {
    if (!isSignedIn) {
      // do when logged in
      return;
    }
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
                var {metaData, body} = parseJson(a_event.description);
                var data = {
                  "Subject": a_event.summary,
                  "StartTime": a_event.start.dateTime,
                  "EndTime": a_event.end.dateTime,
                  "Description": body,
                  "CategoryColor": '#1aaa55',
                  "eventId": a_event.id,
                };
                if (metaData) {
                  Object.entries(metaData).forEach(([key, value]) => {
                    if (key.startsWith(score_field_prefix)) {
                      data[key] = metaData[key];
                    }
                  });
                }
                totalData.push(data);
              });
              console.log(totalData);
              setEventsData(totalData);
            });  //-> getCalendarEvents
          }
        });  //-> map
    });  //-> getCalendarList
  };
  
  // const onPopupBodyClick = (event) => {
  //   navigate('/write?eventId='+event.data.eventId); // redirect
  // }
  // const onPopupHeaderClick = (event) => {
  //   console.log('PopupHeader click')
  // }

  // const headerTemplate = (props) => {
  //   return (
  //     <div className="e-popup-header">
  //       <div class="e-header-icon-wrapper">
  //         <button class="e-edit e-control e-btn e-lib e-flat e-round e-small e-icon-btn" title="Edit" disabled="">
  //           <span class="e-btn-icon e-icons e-edit-icon"></span>
  //         </button>
  //         <button class="e-delete e-control e-btn e-lib e-flat e-round e-small e-icon-btn" title="Delete" disabled="">
  //           <span class="e-btn-icon e-icons e-delete-icon"></span>
  //         </button>
  //         <button class="e-close e-control e-btn e-lib e-flat e-round e-small e-icon-btn" title="Close">
  //           <span class="e-btn-icon e-icons e-close-icon"></span>
  //         </button>
  //       </div>
  //       <div class="e-subject-wrap">
  //         <div class="e-subject e-text-ellipsis" title="updates">{props.Subject}</div>
  //       </div>
  //     </div>
  //   );
  // }

  // const contentTemplate = (props) => {
  //   console.log(props.StartTime.toISOString().substring(0, 16));
  //   console.log(props.EndTime.toISOString().substring(0, 16));
  //   return (
  //     <div className="e-popup-content">
  //       {props.elementType === 'cell' ? (
  //         <div className="e-cell-content">
  //         </div>
  //       ) : (
  //         <div className="e-cell-content">
  //           <div className="e-date-time">
  //             <div className="e-date-time-icon e-icons"></div>
  //             <div className="e-description-details e-text-ellipsis">
  //               <div className="e-date-time-details e-text-ellipsis">{props.StartTime.toISOString().substring(0, 16)} ~ {props.EndTime.toISOString().substring(0, 16)}</div>
  //             </div>
  //           </div>
  //           <div className="e-description">
  //             <div className="e-description-icon e-icons"></div>
  //             <div className="e-description-details e-text-ellipsis">{props.Description}</div>
  //           </div>

  //           {score_fields.forEach(element => {
  //             <div className="e-description">
  //               <div className="e-chevron-down-fill-icon e-icons"></div>
  //               <div className="e-description-details e-text-ellipsis">{element} : {props[element]}</div>
  //             </div>
  //           })}
  //         </div>
  //       )}
  //     </div>
  //   );
  // }
  
  return (
    <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
      <Header category="App" title="Calendar" />
      {/* refresh button */}
      <div className='flex justify-end'>
        <button className='flex justify-center w-5 h-5 m-3 rounded-md border-solid border-2 border-slate-400 '
          onClick={() => {
            console.log('refresh schedule');
            if (scheduleRef.current) {
              loadData();
              // scheduleRef.current.refresh();
            }
          }
        }>
          <MdRefresh/>
        </button>
      </div>
      <ScheduleComponent
        ref={scheduleRef}
        height='50em'
        eventSettings={{ dataSource: eventsData }}
        // cellClick={(event) => {
        //   console.log('cellClick:', event);
        // }}
        // eventClick={(event) => {
        //   console.log('eventClick:', event);
        //   // navigate('/write?eventId='+event.event.eventId); // redirect
        // }}
        popupOpen={(args) => {
          console.log('popup:', args);
          // Customize the create popup
          if (args.type === "ViewEventInfo") {
            // full-screen popup
            args.cancel = false; // Cancel the default popup
          } else if (args.type === "Editor") {
            args.cancel = true; // Cancel the default popup
            if (args.data.eventId) {
              navigate('/write?eventId='+args.data.eventId); // redirect
            } else if (args.data.StartTime) {
              navigate('/write?startTime='+args.data.StartTime); // redirect
            }
          } else if (args.type === "QuickInfo") {
            // args.isContentEditable = true;
            // let content = args.element.querySelector('#QuickDialog_dialog-content'); 
          } else if (args.type === "DeleteAlert") {
            console.log('args.element:', args.element);
            let button = args.element.querySelector('.e-quick-dialog-delete'); 
            console.log('button:', button);
            if (button) {
              button.addEventListener('click', () => {
                deleteEvent(args.data.eventId, 
                  () => {
                    console.log('event deleted');
                    if (scheduleRef.current) {
                      console.log(scheduleRef.current);
                      let records = scheduleRef.current.getCurrentViewEvents(); 
                      console.log(records);
                      let newEventsData = [...eventsData];
                      eventsData.map((item, idx) => {
                        console.log(item.eventId , args.data.eventId)
                        if (item.eventId == args.data.eventId) {
                          newEventsData.splice(idx, 1); // remove item by index
                          console.log('delete', idx);
                          // scheduleRef.current.deleteEvent(idx);
                        }
                      }) // -> map
                      setEventsData(newEventsData);
                      scheduleRef.current.refresh();
                    }
                  }
                )
              });
            }
          }
        }}
        
        // quickInfoTemplates={{
          // header: PopupHeader(this, onPopupHeaderClick),
          // content: PopupBody(this, onPopupBodyClick),
        // }}
        // selectedDate={new Date(2021, 0, 10)}
      >
        {/* tab setting */}
        <ViewsDirective>
          {/* <ViewDirective option='Day' interval={7} displayName='Day' startHour='00:00' endHour='24:00' timeScale={{ enable: true, slotCount: 6 }}/> */}
          <ViewDirective option='Week' interval={1} displayName='Week' showWeekend={true} timeScale={{ enable: true, slotCount: 6 }}/>
          <ViewDirective option='Month' isSelected={true} showWeekNumber={true}/>
          <ViewDirective option='Year' showWeekNumber={true}/>
        </ViewsDirective>
        <Inject services={[Week, Month, Year]}/>
      </ScheduleComponent>
    </div>
  )
}

export default Calendar