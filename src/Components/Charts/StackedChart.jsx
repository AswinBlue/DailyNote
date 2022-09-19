import React from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, StackingColumnSeries, Tooltip } from '@syncfusion/ej2-react-charts';
import { stackedCustomSeries, stackedPrimaryXAxis, stackedPrimaryYAxis } from '../../Data/dummy';

const StackedChart = ({ width, height }) => {

    return (
        <ChartComponent
            width={width}
            hegiht={height}
            id="chart"
            primaryXAxis={stackedPrimaryXAxis}
            primaryYAxis={stackedPrimaryYAxis}
            chartArea={{ border: {width:0} }}
            tooltip={{ enable: true }}
        >
            <Inject
                services={[Legend, Category, StackingColumnSeries, Tooltip]}
            />
            <SeriesCollectionDirective>
                {/* dummy 데이터에서 가져온 json을 순회하며 component 생성 */}
                {stackedCustomSeries.map((item, index) => (
                    // item 으로 받은 데이터(json) 전체를 인자로 전달, key와 value를 그대로 사용
                    <SeriesDirective key={index} {...item} />
                ))}
            </SeriesCollectionDirective>
        </ChartComponent>
    )
}

export default StackedChart