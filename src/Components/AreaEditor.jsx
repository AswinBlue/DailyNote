import React from 'react'

const AreaEditor = ({ title, onChange }) => {
  // TODO : auto height area
  return (
    <div className='mb-10'>
      <p className='text-lg font-bold pr-5'>
        {title}
      </p>
      <textarea type='textarea' name={title} onChange={onChange} className='w-full border-solid border-2 border-gray-500 tracking-normal text-slate-900'/>
    </div>
  )
}

export default AreaEditor;