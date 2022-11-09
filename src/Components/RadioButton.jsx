import { cloneArray } from '@syncfusion/ej2/pdfviewer';
import React, { useState, useEffect } from 'react'

const RadioButton = ({name, onChange}) => {
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
  
  // useState 사용하여 radio버튼 선택시 화면 갱신되도록 설정
  const [checkStatus, setCheckStatus] = useState([
    {type:'radio', key:'0', value:'0', disabled:'', name:'worst', checked:''},
    {type:'radio', key:'25', value:'25', disabled:'', name:'bad', checked:''},
    {type:'radio', key:'50', value:'50', disabled:'', name:'normal', checked:'checked'},
    {type:'radio', key:'75', value:'75', disabled:'', name:'good', checked:''},
    {type:'radio', key:'100', value:'100', disabled:'', name:'best', checked:''},
  ]);
    
  return (
    <div className='pb-5'>
      <label className='text-lg font-bold pr-5'>{name}</label>
      {checkStatus.map((item) => (
        <p className='inline pr-5'>
          {/* onChange 함수 포인터는 json 형태로 담을 수 없어서 직접 입력함 */}
          <input className='mr-1' onChange={radioChange} {...item}/>
          <label>{item.name}</label>
        </p>
      ))}
    </div>
  )
};

export default RadioButton