import React from 'react'

const AreaEditor = ({ title, onChange }) => {
  // TODO : auto height area
  return (
    <div className='mb-10'>
      <p className='text-lg font-bold pr-5'>
        {title}
      </p>
      {/* onChange만으로는 잘라내기/붙여넣기 이벤트를 감지할 수 없다. onBlur은 focus를 해제할 떄 발생하는 이벤트로, 이때도 한번 더 글자 체크를 수행해 줌으로서 문제를 해결한다. */}
      <textarea type='textarea' name={title} onChange={onChange} onBlur={onChange} className='w-full border-solid border-2 border-gray-500 tracking-normal text-slate-900'/>
    </div>
  )
}

export default AreaEditor;