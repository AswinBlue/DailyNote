import React from 'react'

const LineEditor = ({ title, onChange }) => {
  return (
    <div className='flex mb-10'>
      <p className='text-lg font-bold pr-5'>
        {title}
      </p>
      <input onChange={onChange} name={title} className='w-full border-solid border-b-2 border-b-gray-500 tracking-normal text-slate-900'/>
    </div>
  )
}

export default LineEditor;