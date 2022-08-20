import React from 'react';

import { useEffect, useState } from 'react';
import { BrowserRouter, Router, Routes } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Link, NavLink } from 'react-router-dom';
import { SiGooglecalendar } from 'react-icons/si';
import { MdOutlineCancel } from 'react-icons/md';

import { sidebarMenu } from '../Data/SidebarMenu';
import { useStateContext } from '../Contexts/ContextProvider';

function Sidebar() {
    const { activeMenu, setActiveMenu } = useStateContext();
    const activeLinkStyle = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2 bg-black';
    const defaultLinkStyle = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';
    
    return (
        <div className='ml-3 h-screen overflow-auto md:overflow-hidden md:hover:overflow-auto pb-10'>
            {activeMenu && (
                <>
                    <div className='flex justify-between items-center'>
                        <Link to="/" onClick={() => {
                            setActiveMenu(false);
                        }}
                        className='items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900'
                    >
                            <SiGooglecalendar/>
                            <span>Calendar</span>
                        </Link>

                        <TooltipComponent content='Menu' position='BottomCenter'>
                            <button type='button' 
                                onClick={() => {
                                    setActiveMenu((prev) => !prev);
                                }} 
                                className='text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden'
                            >
                                <MdOutlineCancel/>
                            </button>
                        </TooltipComponent>
                    </div>
                    <div className='mt-10'>
                        {sidebarMenu.map((item) => (
                            <div key={item.title}>
                                <p className='text-gray-400 m-3 mt-4 uppercase'>
                                    {item.title}
                                </p>
                                {item.links.map((link) => (
                                    <NavLink to={`/${link.name}`}
                                        key={link.name} 
                                        onClick={()=>{}}
                                        className={({ isActive }) => (
                                            isActive ? activeLinkStyle : defaultLinkStyle
                                        )}
                                    >
                                        {link.icon}
                                        <span className='capitalize'>
                                            {link.name}
                                        </span>
                                    </NavLink>
                                ))}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default Sidebar;