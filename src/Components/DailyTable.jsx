import React, { useEffect, useState } from "react";

const DailyTable = ({eventList}) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [chart, setChart] = useState(null);
  const [chosenX, setChosenX] = useState(-1);
  const [chosenY, setChosenY] = useState(-1);
  const [toolTip, setToolTip] = useState('');
  
  useEffect(() => {
    parseEventList();
  }, [eventList]);

  useEffect(() => {
    generateChart();
  }, [attendanceData]);
  

  useEffect(() => {}, [chosenX, chosenY, toolTip]);
  
  // make attendanceData from eventlist
  const parseEventList = () => {
    var today = new Date();
    today.setHours(23, 59, 59, 999);

    var newAttendanceData = Array.from({length: 366}, () => false)  // list with 366 'false's
    console.log('parseEventList:', eventList);
    if (eventList) {
      eventList.forEach(a_event => {
        const target = new Date(a_event.start)
        let differenceInMs = today.getTime() - target.getTime();
        let differenceInDays = Math.floor(differenceInMs / 1000 / 60 / 60 / 24);
        
        // only keep 1 year of data
        if (differenceInDays <= 365) {
          let index = 365 - differenceInDays;
          newAttendanceData[index] = true;
        }
      });
      console.log('parseEventList:', newAttendanceData);
      setAttendanceData(newAttendanceData);
    }
  }

  const setTooltipPosition = (idx, day)  => {
    let x = -1;
    let y = -1;
    if (idx >= 0) {
      x = Math.floor(idx / 7);
      y = idx % 7
    }
    setChosenX(x);
    setChosenY(y);
    setToolTip(day);
    // console.log('setTooltipPosition', x, y);
  };

  const generateChart = () => {
    /*
    const today = new Date();
    const date364DaysAgo = new Date(today.setDate(today.getDate() - 364));
    const dayOfWeek = date364DaysAgo.getDay();
    */
    // 364 days before today has same day of week as today
    let today = new Date()
    const dayOfWeek = today.getDay();
    
    let newChart = [];
    for (let i = 0; i < 53 * 7; i++) {
      let day = new Date(today)
      day.setDate(today.getDate() - 365 + i)
      day = day.toLocaleDateString()
      newChart.push(
        <button
          key={i}
          // data-tooltip={new Date(today.setDate(today.getDate() - 364 - dayOfWeek + i)).toISOString().substring(0,16)}
          data-tooltip={day}
          onMouseOver={() => setTooltipPosition(i, day)}
          // onMouseOut={() => setTooltipPosition(-1)}
          className={
            "w-3 h-3 hover:border-cyan-700 border-2 rounded-sm col-span-1 row-span-1 " +
            ((dayOfWeek > i || i >= 365 + dayOfWeek) ? (" invisible border-0") : (attendanceData[i + 1 - dayOfWeek] ? "bg-blue-500" : "bg-gray-400"))
          }
        />
      );
    }
    console.log('generateChart:', newChart);
    setChart(newChart);
  };

  // 7 by 53 grid, expand column first
  return (
    <div className="relative">
      <div className="flex w-fit">
        <div className="flex-col font-bold text-gray-400">
          <div className="w-10 h-3 mr-2 text-xs">SUN</div>
          <div className="w-10 h-3 mr-2 text-xs">MON</div>
          <div className="w-10 h-3 mr-2 text-xs">TUE</div>
          <div className="w-10 h-3 mr-2 text-xs">WED</div>
          <div className="w-10 h-3 mr-2 text-xs">THU</div>
          <div className="w-10 h-3 mr-2 text-xs">FRI</div>
          <div className="w-10 h-3 mr-2 text-xs">SAT</div>
        </div>
        <div className="grid w-800 grid-cols-54 grid-rows-7 grid-flow-col gap-0">
          {chart && chart.map((square) => {
            return square;
          })}
        </div>
        <div className="w-12"/>
      </div>
      <text className={"rounded-md bg-white text-xs absolute border-blue-300 py-0.5 px-1 pointer-events-none z-20" + ((chosenX < 0 || chosenY < 0) ? "invisible" : "border-2")}
       style={{ top: 12 + chosenY * 12, left: 40 + chosenX * 14.8 }}
       x={chosenX} y={chosenY} dy="0.25em">{toolTip}</text>
    </div>
  );
};

export default DailyTable;
