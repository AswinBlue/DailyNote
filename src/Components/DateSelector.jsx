import { select } from "@syncfusion/ej2/base";
import React, { useEffect, useState } from "react";

/**
 * 
 * @param {function} onDateChange : handler which is called when date changes
 * @returns 
 */
const DateSelector = ({startDate, onDateChange}) => {

  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
      console.log('startdate:', startDate);
      if (startDate) {
        setSelectedDate(startDate);
      }
    }, [startDate]); 
  
  function handleDateChange(event) {
    console.log('handleDateChange:\n', event.target.value, '\n',
      new Date(event.target.value).toISOString(), '\n',
      new Date(event.target.value).getTimezoneOffset(), '\n',
      );
    setSelectedDate(event.target.value);
    onDateChange(selectedDate);
  }

  /*
   * in <input tpye='datetime-local'>, when you pick a time, time is converted as UTC 0
   * to show your local time, subtract timezone offset before apply to 'input' tag
   */
  const utcTimeToLocalTime = (dateTime) => {
    var date = new Date(dateTime);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    const result = date.toISOString().substring(0, 16);
    console.log('utcTimeToLocalTime:\n', date.toISOString().substring(0, 16));
    return result;
  }

  return (
    <div className="flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-gray-700 dark:text-gray-200  m-2 justify-end">
      
      <div style={{ position: "absolute" }}>
        {selectedDate ?
          <input
            type="datetime-local"
            value={utcTimeToLocalTime(selectedDate)}
            onChange={handleDateChange}
          /> :
          <input
            type="datetime-local"
            value=''
            onChange={handleDateChange}
          />
        }
      </div>
    </div>
  );
}

export default DateSelector;