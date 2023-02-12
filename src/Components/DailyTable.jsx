import React, { useEffect, useState } from "react";

const DailyTable = ({eventList}) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [chart, setChart] = useState(null);
  
  useEffect(() => {
    parseEventList();
    generateChart();
  }, [eventList]);
  
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
        if (differenceInDays < 365) {
          let index = 365 - differenceInDays;
          newAttendanceData[index] = true;
        }
      });
      console.log('parseEventList:', newAttendanceData);
      setAttendanceData(newAttendanceData);
    }
  }

  const generateChart = () => {
    let newChart = [];
    for (let i = 0; i < 53; i++) {
      for (let j = 0; j < 7; j++) {
        newChart.push(
          <button
            key={i * 7 +  j}
            x={j}
            y={i}
            className={
              "w-3 h-3 hover:border-cyan-700 border-2 rounded-sm col-span-1 row-span-1 " +
              (attendanceData[i * 7 + j] ? "bg-blue-500" : "bg-gray-400") + 
              (i * 7 + j >= 365 ? " invisible border-0" : "")
            }
          />
        );
      }
    }
    console.log('generateChart:', newChart);
    setChart(newChart);
  };

  // 7 by 53 grid, expand column first
  return (
    <div className="flex">
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
        {chart && chart.map((sqiare) => {
          return sqiare;
        })}
      </div>
    </div>
  );
};

export default DailyTable;
