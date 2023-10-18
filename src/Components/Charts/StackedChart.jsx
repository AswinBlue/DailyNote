import React, { useEffect, useState } from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, StackingColumnSeries, Tooltip } from '@syncfusion/ej2-react-charts';
import { stackedCustomSeries, stackedPrimaryXAxis, stackedPrimaryYAxis } from '../../Data/dummy';


/**
 * 
 * @param {array} data  : arrays like [{data:[{x:'one',y:100} dataName:'name1', {x:'two',y:200}]}, {data:[{x:'one',y:0}, {x:'two',y:250}], dataName:'name2'}]
 *                        maximum 10 kind of data can be handled
 * @returns 
*/
const StackedChart = ({ width, height, data}) => {
    const [stackData, setStackData] = useState([]);
    // const presetColor = ['blue', 'green', 'red', 'yellow', 'purple', 'orange', 'pink', 'gray', 'brown', 'teal']; // 10 preset is ready
    const stackedPrimaryYAxis = {
        lineStyle: { width: 0 },
        minimum: 0,
        maximum: 100,
        interval: 10,
        majorTickLines: { width: 0 },
        majorGridLines: { width: 1 },
        minorGridLines: { width: 1 },
        minorTickLines: { width: 0 },
        labelFormat: '{value}',
    };

    useEffect(() => {
        if (data) {
            // data.slice(presetColor.length); // cut into maximum length

            let stackData = data.map((element, idx) => {
                /*
                if (idx >= presetColor.length) {
                    return;
                }
                */
               
                return {
                    dataSource: element.data,
                    xName: 'x',
                    yName: 'y',
                    name: element.dataName,
                    type: 'StackingColumn',
                    // background: presetColor[idx], // enalbe if use custom color
                };
            });
            console.log('refined stackedChart data:', stackData);
            setStackData(stackData);
        }
    }, [data]);
    
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
                {stackData.map((item, index) => (
                    // item 으로 받은 데이터(json) 전체를 인자로 전달, key와 value를 그대로 사용
                    <SeriesDirective key={index} {...item} />
                ))}
            </SeriesCollectionDirective>
        </ChartComponent>
    );
}

export default StackedChart;