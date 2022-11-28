import React from 'react'
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, Search, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';
import { useGapiContext, getCalendarList, createCalendar, getCalendarEvents, gapiConfig } from '../API/GAPI';

import { Header } from '../Components'

const Read = () => {
  const { gapi, setGapi, gapiLoggedIn, setgapiLoggedIn } = useGapiContext()
  const CALENDAR_NAME = gapiConfig.CALENDAR_NAME;
  var calendarId = '';
  var eventsData = [];
  // table format
  const eventsGrid = [
    {
      headerText: 'created',
      field: 'created',
      textAlign: 'Center',
      width: '120',
      editType: 'dropdownedit',
      textAlign: 'Center',
    },
    {
      headerText: 'summary',
      field: 'summary',
      textAlign: 'Center',
      width: '120',
      editType: 'dropdownedit',
      textAlign: 'Center',
    },
    {
      headerText: 'description',
      field: 'description',
      textAlign: 'Center',
      width: '120',
      editType: 'dropdownedit',
      textAlign: 'Center',
    },
    {
      headerText: 'start',
      field: 'start',
      textAlign: 'Center',
      width: '120',
      editType: 'dropdownedit',
      textAlign: 'Center',
    },
    {
      headerText: 'end',
      field: 'end',
      textAlign: 'Center',
      width: '120',
      editType: 'dropdownedit',
      textAlign: 'Center',
    },
  ];


  // load calendars to compose page
  getCalendarList(gapi, async (event) => {
      // things to do after getting lists
      event.items.map(item => {
        if (item.summary == CALENDAR_NAME) {
          console.log('calendarId =', item.id);
          getCalendarEvents(gapi, item.id, (response) => {
            response.items.map(a_event => {
              var data = {
                "created": a_event.created,
                "summary": a_event.summary,
                "description": a_event.description,
                "start": a_event.start.dateTime,
                "end": a_event.end.dateTime,
              };
              eventsData.push(data);
            });
            console.log(eventsData);
          });  //-> getCalendarEvents
        }
      });  //-> map
  });  //-> getCalendarList
  return (
    <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
      <Header category='Diary' title='Read' />
      {/* 표 세팅. 데이터는 json 형태로 받아옴*/}
      <GridComponent
        id='gridcomp'
        dataSource={eventsData}
        allowPaging  // page로 나누어 표시
        allowSorting // 정렬 가능
        Search
        toolbar={['Search']}  // 검색을 위한 툴바 제공
        width='auto'
      >
        {/* 컬럼 제목 표시 */}
        <ColumnsDirective>
          {/* 반복문으로 Json에서 데이터 받아와서 사용. dataSource와 item의 field에 맞게 알아서 세팅됨 */}
          {eventsGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        {/* 항목들 제일 아래에 페이지 및 기타 조작 버튼을 추가 */}
        <Inject services={[Search, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport]} />
      </GridComponent>
    </div>
  )
}

export default Read