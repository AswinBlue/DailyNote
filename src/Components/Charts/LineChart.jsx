import React, { useEffect, useState } from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, Tooltip, DataLabel, StackingLineSeries } from '@syncfusion/ej2-react-charts';

const LineChart = ({height, width, color, data, xInterval, yInterval}) => {
    useEffect(() => {
        console.log("LineChartData:", data);
        setLineData(data);
    }, [data]);

    const [lineData, setLineData] = useState([]); // to rerender LineChart when 'data' is updated


    // const presetColor = ['blue', 'green', 'red', 'yellow', 'purple', 'orange', 'pink', 'gray', 'brown', 'teal']; // 10 preset is ready

    return (
        <ChartComponent
            id='charts'
            primaryXAxis={{ valueType: 'Double', labelFormat: '', visible: false }}
            primaryYAxis={{ title: 'Score', minimum: 0, maximum: 100, labelFormat: '{value}' }}
            width={width}
            hegiht={height}
        >
            <Inject services={[StackingLineSeries, Legend, Tooltip, DataLabel, Category]}/>
            <SeriesCollectionDirective>
                {Object.entries(lineData).map((item, idx) => (
                    <SeriesDirective
                        name={item[0]} // key of json
                        dataSource={item[1]} // value of json
                        xName='x'
                        yName='y' 
                        // height={height} 
                        width='2'
                        type='StackingLine' 
                        // fill={presetColor[idx]} // enable to use custom color
                        marker={{ visible: true }}
                        dashArray='5,1'
                        >
                            
                    </SeriesDirective>
                ))}
            </SeriesCollectionDirective>
        </ChartComponent>
    );
}

export default LineChart;