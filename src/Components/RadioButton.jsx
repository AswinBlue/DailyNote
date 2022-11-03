import { cloneArray } from '@syncfusion/ej2/pdfviewer';
import React, { useState, useEffect } from 'react'
import { MdMoodBad } from "react-icons/md";

const RadioButton = ({name, onChange}) => {
  // TODO : useState 사용하여 radio버튼 선택시 화면 갱신되도록 설정
  const radioChange = (e) => {
    var newStatus = cloneArray(checkStatus);
    newStatus.map((item, idx) => {
      if (item.name === e.target.name) {
        item.checked = 'checked';
      } else {
        item.checked = false;
      }
    });
    console.log(newStatus);
    setCheckStatus(newStatus);
    onChange(name, e.target.value);
  }
  
  const [checkStatus, setCheckStatus] = useState([
  // var checkStatus = [
    {type:'radio', value:'0', disabled:'', name:'worst', checked:'', onChange:radioChange},
    {type:'radio', value:'25', disabled:'', name:'bad', checked:'', onChange:radioChange},
    {type:'radio', value:'50', disabled:'', name:'normal', checked:'checked', onChange:radioChange},
    {type:'radio', value:'75', disabled:'', name:'good', checked:'', onChange:radioChange},
    {type:'radio', value:'100', disabled:'', name:'best', checked:'', onChange:radioChange},
  ]);
    
  useEffect(() => {
    console.log('status:', checkStatus);
  }, [checkStatus]);

  return (
    <div className='pb-5'>
      <label className='text-lg font-bold pr-5'>{name}</label>
      {checkStatus.map((item) => (
        <p className='inline pr-5'>
          <input className='mr-1' {...item}/>
          <label>{item.name}</label>
        </p>
      ))}
      
      {/* <CiFaceMeh/> */}
      {/* <CiFaceSmile/> */}
    </div>
  )
};

export default RadioButton