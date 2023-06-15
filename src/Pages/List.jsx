import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, Search, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';
import { useGapiContext, gapiConfig } from '../API/GAPI';
import { MdDateRange, MdOutlineCancel, MdModeEditOutline, MdDelete, MdDescription, MdRefresh } from 'react-icons/md';

import { parseJson } from '../API/JsonParser';
import { Header, Popup} from '../Components'
import { score_field_prefix, list_table_grid } from '../Data/configs';


const List = () => {
  const { isSignedIn, getEventList, getCalendarEvents, getCalendarList, deleteEvent } = useGapiContext()
  const CALENDAR_NAME = gapiConfig.CALENDAR_NAME;
  const [eventsData, setEventsData] = useState([]);
  // table format
  const [eventsGrid, setEventsGrid] = useState();
  const [showPopup, setshowPopup] = useState(false);
  const [clickedRecord, setClickedRecord] = useState(null);
  const [scoreFields, setScoreFields] = useState([]);
  const navigate = useNavigate();

  
  // 로그인 후 1회만 재 랜더링하도록 useEffect 사용
  useEffect(() => {
    loadData();
    setGrid();
  }, [isSignedIn]);
  
  useEffect(() => {}, [eventsData]); // to refresh after delete
  
  // set grid of the table
  const setGrid = () => {
    var grid = [...list_table_grid];
    scoreFields.forEach(element => {
      grid.push(
        {
          headerText: element,
          field: element,
          textAlign: 'Center',
          width: '120',
          editType: 'dropdownedit',
          textAlign: 'Center',
        },
      );
    });
    console.log('eventsGrid:', grid);
    setEventsGrid(grid);
  };

  const loadData = () => {
    getEventList((events) => {
      console.log('events:', events);
      var totalData = [];
      var newScoreFields = [];
      events.items.map(a_event => {
        var {metaData, body} = parseJson(a_event.description);
        // console.log('metaData:', metaData);
        var data = {
          "eventId": a_event.id,
          "summary": a_event.summary,
          "description": body,
          "start": a_event.start.dateTime,
        };

        if (metaData) {
          Object.entries(metaData).forEach(([key, value]) => {
            if (key.startsWith(score_field_prefix)) {
              data[key] = metaData[key];
              newScoreFields.push(key);
            }
          });
        }
        totalData.push(data);
      });
      console.log('totalData:', totalData);
      setScoreFields(newScoreFields);
      setEventsData(totalData);
    });
  };

  return (
    // TODO : 받아올 날짜 설정
    // TODO: 지우고 화면 refresh
    <div className='m-10 p-10 bg-white rounded-3xl'>
      {clickedRecord && (
        <Popup visible={showPopup}>
          {/* popup header */}
          <div className="flex justify-between border-b-2 border-slate-500 mb-7 mt-3 pl-2 pr-2">
            {/* popup title */}
            <div className='text-xl text-black font-bold'>
              {clickedRecord.summary}
            </div>
            {/* button row */}
            <div className='flex w-24 justify-between gap-1'>
              <button className='rounded-xl p-2 bg-gray-100' onClick={() => {
                navigate('/write?eventId=' + clickedRecord.eventId); // redirect
              }}>
                <MdModeEditOutline />
              </button>
              <button className='rounded-xl p-2 bg-gray-100' onClick={() => {
                deleteEvent(clickedRecord.eventId, 
                  () => {
                    let newEventsData = [...eventsData];
                    eventsData.map((item, idx) => {
                      // console.log(item.eventId , clickedRecord.eventId)
                      if (item.eventId == clickedRecord.eventId) {
                        newEventsData.splice(idx, 1); // remove item by index
                        console.log('delete', idx);
                        // scheduleRef.current.deleteEvent(idx);
                      }
                    }) // -> map
                    console.log('events', eventsData, newEventsData);
                    setEventsData(newEventsData);
                    setClickedRecord(null);
                    setshowPopup(false);
                    console.log('event deleted');
                  }
                );
              }}>
                <MdDelete />
              </button>
              <button className='rounded-xl p-2 bg-gray-100' onClick={() => setshowPopup(false)}>
                <MdOutlineCancel />
              </button>
            </div>
          </div>
          {/* popup body */}
          <div className='flex-col'>
            <div className='flex gap-3'><MdDateRange />{clickedRecord.start.substring(0, 10)}</div>
            <div className='flex gap-3'><MdDescription />{clickedRecord.description}</div>
          </div>
        </Popup>
      )}

      <Header category={process.env.REACT_APP_PAGE_NAME} title='List' />
      {/* refresh button */}
      <button className='flex justify-center w-5 h-5 m-3 rounded-md border-solid border-2 border-slate-400 '
          onClick={() => {
            console.log('refresh schedule');
            loadData();
          }
        }>
        <MdRefresh/>
      </button>
      {/* 표 세팅. 데이터는 json 형태로 받아옴*/}
      <GridComponent
        id='gridcomp'
        dataSource={eventsData}
        allowPaging  // page로 나누어 표시
        allowSorting // 정렬 가능
        Search
        toolbar={['Search']}  // 검색을 위한 툴바 제공
        width='auto'
        recordClick={
          (record) => {
            console.log("recordClick", record);
            setshowPopup(true);
            setClickedRecord(record.rowData);
          }
        }
      >
        {/* 컬럼 제목 표시 */}
        <ColumnsDirective>
          {/* 반복문으로 Json에서 데이터 받아와서 사용. dataSource와 item의 field에 맞게 알아서 세팅됨 */}
          {eventsGrid ? eventsGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
            )) : (
              <div className='text-blue-500'>Login First</div>
            )
          }
        </ColumnsDirective>
        {/* 항목들 제일 아래에 페이지 및 기타 조작 버튼을 추가 */}
        <Inject services={[Search, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport]} />
      </GridComponent>
    </div>
  )
}

export default List