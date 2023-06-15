import React, { useEffect } from 'react';
import { SparklineComponent, Inject, SparklineTooltip } from '@syncfusion/ej2-react-charts';

const SparkLineChart = ({id, type, height, width, color, currentColor, data}) => {
    useEffect(() => {}, [data]);
    
    try{
        return (
            <SparklineComponent
            id={id}
            height={height}
            width={width}
            lineWidth={1}
            valueType="Numeric"
            fill={color}
            border={{color:currentColor, width:2}}
            dataSource={data}
            xName='x'
            yName='y'
            type={type}
            tooltipSettings={{
                visible:true,
                format: 'x: ${x}, y: ${y}',
                trackLineSettings: { visible:true }
            }}
            >
            {/* <Inject services={[SparklineTooltip]} /> */}
            </SparklineComponent>
        )
    } catch (error) {
        console.error('An error occurred while rendering the SparklineComponent:', error);
        return null // empty component when error occur
    }

}

export default SparkLineChart