import React, { Children } from 'react';

/**
 * wrapper of items to arrang in vertical row
 */
const VerticalRowListItem = ({ children }) => {
    return (
        <div className='flex flex-col md:flex-row overflow-x-auto border-b-1 border-b-gray-300 m-4 pr-10 pb-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl'>
            {/* make it adaptive for screen size */}
            {Children.map(children, child => {
                {/* if width is wide enough for multiple column, apply multiple column style */}
                return (
                    <div className='w-fill border-0 border-l-1 border-gray-300 rounded-xl m-4 pl-10'>
                        {child}
                    </div>
                );
            })}
        </div>
    );

};

export default VerticalRowListItem;