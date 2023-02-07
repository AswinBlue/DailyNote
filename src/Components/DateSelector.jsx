import { formatString } from "@syncfusion/ej2/gantt";
import React, { useState } from "react";

/**
 * 
 * @param {function} onDateChange : handler which is called when date changes
 * @returns 
 */
const DateSelector = ({onDateChange}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);

  function handleDateChange(event) {
    setSelectedDate(new Date(event.target.value));
    onDateChange(selectedDate);
  }

  function toggleDropdown() {
    setShowDropdown(!showDropdown);
  }

  return (
    <div className="flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-gray-700 dark:text-gray-200  m-2 justify-end">
      <button onClick={toggleDropdown} className="border-solid border-b-2 border-b-gray-500 tracking-normal text-slate-900">
        {selectedDate != 'Invalid Date' ? selectedDate.toLocaleString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        }) : 'Select Date'}
      </button>
      
        {showDropdown && selectedDate && (
          <div style={{ position: "absolute" }}>
            {selectedDate != 'Invalid Date' ?
              <input
                type="datetime-local"
                value={selectedDate.toISOString().substr(0, 16)}
                onChange={handleDateChange}
              /> :
              <input
                type="datetime-local"
                value=''
                onChange={handleDateChange}
              />
            }
          </div>
        )}
    </div>
  );
}

export default DateSelector;