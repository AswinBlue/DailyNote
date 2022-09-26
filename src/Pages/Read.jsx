import React from 'react'
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';

import { ordersData, contextMenuItems, ordersGrid } from '../Data/dummy';
import { Header } from '../Components'

const Read = () => {
  return (
    <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
      <Header category='Page' title='Read'/>
      {/* 표 세팅. 데이터는 json 형태로 받아옴*/}
      <GridComponent id='gridcomp' dataSource={ordersData}>
        {/* 컬럼 제목 표시 */}
        <ColumnsDirective>
          {/* 반복문으로 Json에서 데이터 받아와서 사용. dataSource와 item의 field에 맞게 알아서 세팅됨 */}
          {ordersGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
      </GridComponent>
    </div>
  )
}

export default Read