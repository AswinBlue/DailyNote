import React from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, Tooltip, DataLabel, LineSeries } from '@syncfusion/ej2-react-charts';

const LineChart = ({id, name, type, height, width, color, currentColor, data}) => {
    const marker = { visible: true, width: 10, height: 10, border: { width: 2, color: {color} } };
    return (
        <ChartComponent id={id}>
        <Inject services={[LineSeries, Legend, Tooltip, DataLabel, Category]}/>
        <SeriesCollectionDirective>
            <SeriesDirective dataSource={data} xName='x' yName='y' height={height} width={width} name={name} type={type} fill={currentColor}>
            </SeriesDirective>
        </SeriesCollectionDirective>
        </ChartComponent>
    );
}

export default LineChart;