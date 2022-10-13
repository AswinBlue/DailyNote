import { BsCurrencyDollar } from 'react-icons/bs';
import { GoPrimitiveDot } from 'react-icons/go';
import { IoIosMore } from 'react-icons/io';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

import { Stacked, Pie, SwitchButton, LineChart, StackedChart, SparkLineChart } from '../Components';
import { earningData, medicalproBranding, recentTransactions, weeklyStats, dropdownData, SparklineAreaData, ecomPieChartData } from '../Data/dummy';
import { useStateContext } from '../Contexts/ContextProvider';

const Record = () => {
  return (
    <div className='mt-12'>
      {/* 1열 */}
      <div className='flex flex-wrap lg:flex-nowrap justify-center'>
        {/* 제목, 설명과 다운로드 버튼 */}
        <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center'>
          <div className='flex justify-between items-center'>
            <div>
              <p className='font-bold text-gray-400'>title</p>
              <p className='text-2xl'>description</p>
            </div>
          </div>
          <div className='mt-6'>
            <SwitchButton color='white' bgColor='blue' text='Download' borderRadius='10px' size='md'/>
          </div>
        </div>
        {/* 필요한 내용 json으로 작성, 반복문으로 표시 */}
        <div className='flex m-3 flex-wrap justify-start gap-1 items-center'>
          {earningData.map((item) => (
            <div
              key={item.title}
              className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl'
            >
              <button type="button" style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                className='text-2xl opacity-0.9 rounded-fulll p-4 hover:ring-1 ring-gray-100 hover:drop-shadow-xl'>
                  {item.icon}
                </button>
                <p className='mt-3'>
                  <span className='text-lg font-semibold'>
                    {item.amount}
                  </span>
                  <span className={`text-sm text-${item.pcColor} ml-2`}>
                    {item.percentage}
                  </span>
                </p>
                <p className='text-sm text-gray-400 mt-1'>
                  {item.title}
                </p>

            </div>
          ))}
        </div>
      </div>

      {/* 2열 */}
      <div className='flex gap-10 flex-wrap justify-center'>
        <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-3 rounded-2xl md:w-789'>
          {/* 가로 제목들 */}
          <div className='flex justify-between'>
            <p className='font-semibold text-xl'>Recent</p>
            <div className='flex items-center gap-4'>
              <p className='flex items-center gap-2 text-gray-600hover:drop-shadow-xl'>
                <span><GoPrimitiveDot/></span>
                <span>item1</span>
                <span>item2</span>
              </p>
            </div>
          </div>

          {/* 본문 표시 영역 */}
          <div className='mt-10 flex gap-10 flex-nowrap justify-center'>
            <div className='border-r-1 border-color m-4 pr-10'>
              {/* body1 */}
              <div>
                <p>
                  <span className='text-3xl font-semibold'>
                    data1
                  </span>
                  <span className='p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs'>
                    data1-1
                  </span>
                </p>
                <p className='text-gray-500 mt-1'>
                  data1-2
                </p>
              </div>
              {/* body2 */}
              <div className='mt-8'>
                <p>
                  <span className='text-3xl font-semibold'>
                    data2
                  </span>
                  <span className='p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs'>
                    data2-1
                  </span>
                </p>
                <p className='text-gray-500 mt-1'>
                  data2-2
                </p>
              </div>
              {/* chart 1 */}
              <div className='mt-5'>
                <SparkLineChart 
                  currentColor='blue'
                  id='line-sparkLine'
                  type='Line'
                  height='80px'
                  width='250px'
                  data={SparklineAreaData}
                  color='blue'
                />
              </div>
              {/* download button */}
              <div className='mt-10'>
                <SwitchButton
                  color='white'
                  bgColor='blue'
                  text='Download'
                  borderRadius='10px'
                />
              </div>
            </div>
            {/* chart 2 */}
            <div>
              <StackedChart
                width='320px'
                height='360px'
              />
            </div>
          </div>
          
        </div>
      </div>

    </div>
  )
}

export default Record