import { BsCurrencyDollar } from 'react-icons/bs';
import { GoPrimitiveDot } from 'react-icons/go';
import { IoIosMore } from 'react-icons/io';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

import { Stacked, Pie, SwitchButton, LineChart, StackedChart, SparkLineChart, DailyTable } from '../Components';
import { earningData, medicalproBranding, recentTransactions, weeklyStats, dropdownData, SparklineAreaData, ecomPieChartData } from '../Data/dummy';
import { useStateContext } from '../Contexts/ContextProvider';

import { useGapiContext, gapiConfig, getEventList } from '../API/GAPI';
import { useEffect, useState } from 'react';
import { parseJson } from '../API/JsonParser';
import { score_fields } from '../Data/configs';

const DashBoard = () => {
  const { gapi, setGapi, isSignedIn, setIsSignedIn } = useGapiContext()
  const CALENDAR_NAME = gapiConfig.CALENDAR_NAME;
  const [eventList, setEventList] = useState(null);
  const [sparkLineData, setSparkLineData] = useState([]);
  const [stackedChartData, setStackedChartData] = useState([]);
  
  // 최초 1회만 재 랜더링하도록 useEffect 사용
  useEffect(() => {
    if (!isSignedIn) {
      return;
    }
    getEventList(gapi, (element) => {
      // 날짜별로 정렬
      var newEventList = [];
      var newSparkLineData = [];
      element.items.forEach((a_event, idx) => {
        var {metaData, body} = parseJson(a_event.description);
        var data = {
          "summary": a_event.summary,
          "description": body,
          "start": a_event.start.dateTime,
        };
        
        if (metaData) {
          score_fields.forEach(fieldName => {
            let date = new Date(a_event.start.dateTime.substring(0,10))
            if (metaData[fieldName]) {
              data[fieldName] = metaData[fieldName];
              newSparkLineData.push({x:date.getTime(), y:metaData[fieldName]});
            }
          });
        }
        newEventList.push(data);
      }); // -> forEach
        
        
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

      // push data
      for (const key in accum_data) {
        if (accum_data[key]) {
          accum_data[key].forEach((value, idx) => {
            let average = accum_data[key][0];
            if (accum_data[key][0] > 0 && idx > 0) {
              average = value / accum_data[key][0];
            }
            newStackedChartData[idx].data.push({x:key, y: (average)}); // average data (sum / count)
            console.log('stackedChartData:', newStackedChartData);
          }); // -> forEach
        }
      }
      
      newStackedChartData[0]['dataName'] = 'count';
      score_fields.forEach((fieldName, idx) => {
        newStackedChartData[idx + 1]['dataName'] = fieldName;
      });
      
      console.log('stackedChartData:', newStackedChartData);

      setEventList(newEventList);
      setSparkLineData(newSparkLineData);
      setStackedChartData(newStackedChartData);
    }); // -> getEventList
  }, [isSignedIn]);

  useEffect(() => {console.log('sparkLineData:', sparkLineData)}, [sparkLineData]);
  

  return (
    <div className='mt-12 min-w-fit flex flex-col items-start'>
      {/* 1열 */}
      <div className='flex gap-10 w-fit'>
        {/* 제목, 설명, 7by53 차트, 버튼 */}
        <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-full w-full rounded-xl p-3 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center'>
          <div className='flex justify-between items-center mb-3'>

            <div>
              <p className='font-bold text-gray-400'>Dialy archives</p>
              <p className='text-2xl'>Days you recorded</p>
            </div>
          </div>

          <DailyTable eventList={eventList}></DailyTable>

          <div className='mt-6'>
            <SwitchButton color='white' bgColor='blue' text='View Calendar' borderRadius='10px' size='md'/>
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
      </div>

      {/* 2열 */}
      <div className='flex gap-10 flex-wrap justify-center'>
        <div className='flex bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 rounded-2xl'>
          {/* 가로 제목들 */}
          <div className='flex justify-between'>
            <p className='font-semibold text-xl m-3'>Daily scores</p>
            <div className='flex items-center gap-4'>
              <p className='flex items-center gap-2 text-gray-600hover:drop-shadow-xl'>
                {/* <span><GoPrimitiveDot/></span>
                <span>moods</span> */}
              </p>
            </div>
          </div>

          {/* 그래프 표시 영역 */}
          <div className='mt-10 flex gap-10 justify-center'>
            <div className='flex flex-col justify-center border-r-1 border-color m-4 pr-10'>
              {/* body1 */}
              <div>
                <p>
                  <span className='text-3xl font-semibold'>
                    moods
                  </span>
                  {/* <span className='p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs'>
                    data1-1
                  </span> */}
                </p>
                <p className='text-gray-500 mt-1'>
                  your daily moods
                </p>
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
              <div className='mt-5 w-fit h-fit border-b-1 border-l-1 border-slate-700'>
                <SparkLineChart 
                  currentColor='blue'
                  id='line-sparkLine'
                  type='Line'
                  height='120px'
                  width='250px'
                  data={sparkLineData}
                  color='blue'
                  lineWidth={1}
                  board
                  tooltipSettings={{
                    visible:false,
                    trackLineSettings: {
                        visible:false
                    }
                  }}
                  
                />
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
            {/* chart 2 */}
            <div>
              <StackedChart
                width='320px'
                height='360px'
                data={stackedChartData}
              />
            </div>
          </div>
          
        </div>
      </div>

    </div>
  )
}

export default DashBoard