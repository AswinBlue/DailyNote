import React, { useEffect, useState } from 'react'
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, Search, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';
import { useGapiContext, getEventList, gapiConfig } from '../API/GAPI';
import { parseJson } from '../API/JsonParser';
import { Header } from '../Components'
import { score_fields } from '../Data/configs';


const Read = () => {
  const { gapi, setGapi, isSignedIn, setIsSignedIn } = useGapiContext()
  const CALENDAR_NAME = gapiConfig.CALENDAR_NAME;
  const [eventsData, setEventsData] = useState([]);
  // table format
  const [eventsGrid, setEventsGrid] = useState([
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
  ]);

  // set grid of the table
  useEffect(() => {
    score_fields.forEach(element => {
      eventsGrid.push(
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
      console.log('eventsGrid:', eventsGrid);
      setEventsGrid(eventsGrid);
    }, []);
    
  // 로그인 후 1회만 재 랜더링하도록 useEffect 사용
  useEffect(() => {
    getEventList(gapi, (events) => {
      console.log('events:', events);
      var totalData = [];
      events.items.map(a_event => {
        var {metaData, body} = parseJson(a_event.description);
        console.log('metaData:', metaData);
        var data = {
          "summary": a_event.summary,
          "description": body,
          "start": a_event.start.dateTime,
        };

        if (metaData) {
          score_fields.forEach(element => {
            data[element] = metaData[element];
          });
        }
        totalData.push(data);
      });
      console.log('totalData:', totalData);
      setEventsData(totalData);
    });
  }, [isSignedIn]);

  

  return (
    // TODO : refresh 버튼 생성
    // TODO : 받아올 날짜 설정
    <div className='m-10 p-10 bg-white rounded-3xl'>
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
          {console.log("gridData", eventsGrid)}
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