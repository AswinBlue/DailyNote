import { BsCurrencyDollar } from 'react-icons/bs';
import { GoPrimitiveDot } from 'react-icons/go';
import { IoIosMore } from 'react-icons/io';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

import { Stacked, Pie, SwitchButton, LineChart, StackedChart, lineChart, DailyTable, VerticalRowListItem } from '../Components';
import { earningData, medicalproBranding, recentTransactions, weeklyStats, dropdownData, lineAreaData, ecomPieChartData } from '../Data/dummy';
import { useStateContext } from '../Contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';

import { useGapiContext, gapiConfig } from '../API/GAPI';

import { useEffect, useState } from 'react';
import { parseJson } from '../API/JsonParser';
import { score_field_prefix, dashboard_config } from '../Data/configs';

const DashBoard = () => {
  const navigate = useNavigate();
  
  const { screenSize, setScreenSize } = useStateContext();
  const { isSignedIn, getEventById, getEventList, updateCalendarEvent, addCalendarEvent, getCalendarEvents, createCalendar, getCalendarList, gapiLogout, gapiLogin  } = useGapiContext()
  const CALENDAR_NAME = gapiConfig.CALENDAR_NAME;
  const [eventList, setEventList] = useState(null);
  const [lineChartData, setLineChartData] = useState([]);
  const [stackedChartData, setStackedChartData] = useState([]);

  useEffect(() => {
    console.log("screenSize:", screenSize);
  }, [screenSize]);

  
  // 최초 1회만 재 랜더링하도록 useEffect 사용
  useEffect(() => {
    if (!isSignedIn) {
      return;
    }
    getEventList((element) => {
      // 날짜별로 정렬
      var newEventList = [];
      var score_fields = [];
      /*
        lineChartData = {"Today's mood":[ { "x": 1667952000000, "y": "50" }, { "x": 1669593600000, "y": "75" }, { "x": 1669593600000, "y": "75" }, { "x": 1670198400000, "y": "25" }, { "x": 1670198400000, "y": "50" }, { "x": 1675209600000, "y": "75" }, { "x": 1675209600000, "y": "50" }, { "x": 1675209600000, "y": "50" }, { "x": 1675209600000, "y": "50" }, { "x": 1675900800000, "y": "50" }, { "x": 1676073600000, "y": "75" }, { "x": 1676332800000, "y": "75" } ]}
      */
      var newLineChartData = {};
      element.items.forEach((a_event, idx) => {
        var {metaData, body} = parseJson(a_event.description);
        var data = {
          "summary": a_event.summary,
          "description": body,
          "start": a_event.start.dateTime,
        };
        
        // if 'metaData' field exist
        if (metaData) {
          // find key starting with 'stackedChartData'
          console.log('meta:', metaData);
          Object.entries(metaData).forEach(([originalKey, value]) => {
            if (originalKey.startsWith(score_field_prefix)) {
              var key = originalKey.slice(score_field_prefix.length); // remove prefix from 'key'
              if (!score_fields.includes(key)) { // add if not already exist, must not have duplicated item
                score_fields.push(key); // to make list of key starting with 'score_field_prefix'
              }
              var currentData = null;
              // if key exist, use already created list
              if (newLineChartData.hasOwnProperty(key)) {
                currentData = newLineChartData[key];
              }
              // create new empty list
              else {
                newLineChartData[key] = [];
                currentData = newLineChartData[key];
              }
              let date = new Date(a_event.start.dateTime.substring(0,10))
              data[key] = metaData[originalKey];

              // format date as 'YYYY-MM-DD'
              // var _year = date.getFullYear();
              // var _month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
              // var _date = String(date.getDate()).padStart(2, '0'); // Months are 0-based
              // var formattedDate = `${_year}-${_month}-${_date}`;

              currentData.push({x:(date.getTime()), y:parseInt(metaData[originalKey])});
              // console.log('newLineChartData', newLineChartData);
            }
          });
        }
        newEventList.push(data);
      }); // -> forEach
        
      console.log("eventList:", newEventList);
      /* 
        stackedChartData = [{data:[{x:'one',y:100} dataName:'name1', {x:'two',y:200}]}, {data:[{x:'one',y:0}, {x:'two',y:250}], dataName:'name2'}]
      */
      let newStackedChartData = Array(score_fields.length + 1).fill(null).map(() => ({data:[]}));
      let accum_data = {};
      newEventList.forEach(element => {
        let date = new Date(element.start);
        let month = date.toLocaleString('default', { month: 'long' });
        
        // create new array in dictionary if not exist
        if (!accum_data.hasOwnProperty(month)) {
          accum_data[month] = Array(score_fields.length + 1).fill(0); // [count, accumedscore1, accumedscore2, ...]
        }
        
        accum_data[month][0] += 1; // count
        // scores
        score_fields.forEach((fieldName, idx) => {
          // if data exist, calculate
          if (element[fieldName]) {
            accum_data[month][idx + 1] += parseInt(element[fieldName]);
          }
        });
      }); // -> forEach
      
      console.log('accum:', accum_data);

      // push data
      for (const key in accum_data) {
        if (accum_data[key]) {
          accum_data[key].forEach((value, idx) => {
            let average = accum_data[key][0];
            if (accum_data[key][0] > 0 && idx > 0) {
              average = value / accum_data[key][0];
            }
            newStackedChartData[idx].data.push({x:key, y: (average)}); // average data (sum / count)
            // console.log('stackedChartData:', newStackedChartData);
          }); // -> datasetLineChartDataforEach
        }
      }
      
      newStackedChartData[0]['dataName'] = 'count';
      score_fields.forEach((fieldName, idx) => {
        newStackedChartData[idx + 1]['dataName'] = fieldName;
      });
      
      setEventList(newEventList);
      setLineChartData(newLineChartData);
      setStackedChartData(newStackedChartData);
    }); // -> getEventList
  }, [isSignedIn]);

  useEffect(() => {console.log('lineChartData:', lineChartData)}, [lineChartData]);
  useEffect(() => {console.log('stackedChartData:', stackedChartData)}, [stackedChartData]);

  return (
    // <div className='mt-12 min-w-fit flex flex-col items-start flex-grow'>
    // <div className='mt-12 items-start flex-grow w-fit'>
    <div className='m-10 p-10 bg-white overflow-y-auto rounded-3xl'>
      
      {/* 1행 */}
      <VerticalRowListItem>
        {/* 제목, 설명, 7by53 차트, 버튼 */}
        <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-full w-fit rounded-xl p-3 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center'>
          <div className='flex justify-between items-center mb-3'>

            <div>
              <p className='font-bold text-gray-400'>Dialy archives</p>
              <p className='text-2xl'>Your memories</p>
            </div>
          </div>

          <DailyTable eventList={eventList}></DailyTable>

          <div className='mt-6'>
            <SwitchButton color='white' bgColor='blue' text='View Calendar' borderRadius='10px' size='md' onClick={() => navigate("/calendar")}/>
          </div>
        </div>

        {/*  필요한 내용 json으로 작성, 반복문으로 표시
        <div className='flex m-3 flex-wrap justify-start gap-1 items-center'>
          {earningData.map((item) => (
            <div
              key={item.title}
              className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl'
            >
              <button type="button" style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className='text-2xl opacity-0.9 rounded-fulll p-4 hover:ring-1 ring-gray-100 hover:drop-shadow-xl'>
                  {item.icon}
                </button>
                <p className='mt-3'>
                  <span className='text-lg font-semibold'>
                    {item.amount}
                  </span>
                  <span className={`text-sm text-${item.pcColor} ml-2`}>
                    {item.percentage}
                  </span>
                </p>
                <p className='text-sm text-gray-400 mt-1'>
                  {item.title}
                </p>

            </div>
          ))}
        </div> 
        */}
      </VerticalRowListItem>

      {/* 2행 */}
      <VerticalRowListItem>
        {/* 1열 */}
        <div class='title'>
          {/* 제목들 */}
          <div className='flex justify-between'>
            <p className='font-semibold text-2xl m-3'>Daily scores</p>
            <div className='flex items-center gap-4'>
              <p className='flex items-center gap-2 text-gray-600hover:drop-shadow-xl'>
                {/* <span><GoPrimitiveDot/></span>
                <span>moods</span> */}
              </p>
            </div>
          </div>

          {/* 그래프 표시 영역 */}
          <div className='flex gap-10'>
            <div className='flex flex-col justify-center'>
              {/* body1 */}
              <div>
                <p>
                  {/* <span className='text-xl font-semibold'>
                    moods
                  </span> */}
                  {/* <span className='p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs'>
                    data1-1
                  </span> */}
                </p>
                {/* <p className='text-gray-500 mt-1'>
                  your daily moods
                </p> */}
              </div>
              {/* body2 */}
              {/* <div className='mt-8'>
                <p>
                  <span className='text-3xl font-semibold'>
                    data2
                  </span>
                  <span className='p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs'>
                    data2-1
                  </span>
                </p>
                <p className='text-gray-500 mt-1'>
                  data2-2
                </p>
              </div> */}
              {/* chart 1 */}
              {/* TODO: make key-selector screen, and let user select the key */}
              <div className='mt-5 w-fit h-fit border-b-1 border-l-1 border-slate-700 max-w-xl'>
                {lineChartData &&
                  <LineChart
                    height={dashboard_config.lineChart.height}
                    width={dashboard_config.lineChart.width}
                    data={lineChartData}
                    color='#558055'
                    xInterval={6} // epoch time에서 10분 단위
                    yInterval={5}
                  />
                }
              </div>
            </div>
            {/* download button */}
            {/* <div className='mt-10'>
              <SwitchButton
                color='white'
                bgColor='blue'
                text='Download'
                borderRadius='10px'
              />
            </div> */}
          </div>
        </div>

        {/* 2열 */}
        <div class='graph'>
          {/* 제목들 */}
          <div className='flex justify-between pb-5'>
            <p className='font-semibold text-2xl m-3'>Monthly average</p>
          </div>
          {/* chart 2 */}
          <div className='pb-10 pr-10'>
            {stackedChartData &&
              <StackedChart
                width={dashboard_config.stackedChart.width}
                height={dashboard_config.stackedChart.height}
                data={stackedChartData}
              />
            }
          </div>
        </div>
      </VerticalRowListItem>
    </div>
  )
}

export default DashBoard