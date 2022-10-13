import React from 'react'
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, Search, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';

import { ordersData, contextMenuItems, ordersGrid } from '../Data/dummy';
import { Header } from '../Components'

const Read = () => {
  return (
    <div className='m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl'>
      <Header category='Page' title='Read'/>
      {/* 표 세팅. 데이터는 json 형태로 받아옴*/}
      <GridComponent 
        id='gridcomp'
        dataSource={ordersData}
        allowPaging  // page로 나누어 표시
        allowSorting // 정렬 가능
        toolbar={['Search']}  // 검색을 위한 툴바 제공
        width='auto'
      >
        {/* 컬럼 제목 표시 */}
        <ColumnsDirective>
          {/* 반복문으로 Json에서 데이터 받아와서 사용. dataSource와 item의 field에 맞게 알아서 세팅됨 */}
          {ordersGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        {/* 항목들 제일 아래에 페이지 및 기타 조작 버튼을 추가 */}
        <Inject services={[Search, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport]}/>
      </GridComponent>
    </div>
  )
}

export default Read