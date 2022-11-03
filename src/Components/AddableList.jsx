import React from 'react'

// list 형태가 와야 한다.
const AddableList = ({items, onClick}) => {
  return (
    <div className='flex mb-10'>
        {items.map((item) => (
          // name
          <div>
            <p className='text-lg font-bold pr-5'></p>
          </div>
          // score
        ))}
    </div>

  )
};

export default AddableList;