import React, { useEffect, useState } from 'react';

import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { AiOutlineMenu } from 'react-icons/ai';
import { BsChatLeft } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';
import { Chat, Notification, UserProfile } from '.';
import { useStateContext } from '../Contexts/ContextProvider';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { useGapiContext, gapiConfig } from '../API/GAPI';
import { sidebar_active_threshold } from '../Data/configs';


const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
    <TooltipComponent
        content={title}
        position="BottomCenter"
    >
        <button type='button' onClick={customFunc}
            style={{ color }}
            className='relative text-xl rounded-full p-3 hover:bg-light-gray'
        >
            <span style={{ background: dotColor }}
                className='absolute inline-flex rounded-full h-2 w-2 right-2 top-2'
            />
            {icon}
        </button>
    </TooltipComponent>
);

function Navbar() {
    const { activeMenu, setActiveMenu, isClicked, setIsClicked, handleClick, screenSize, setScreenSize } = useStateContext();
    const { userProfile } = useGapiContext()
    const [userName, setUserName] = useState(null);
    const [userImage, setUserImage] = useState(null);
    
    useEffect(() => {
        setUserName(userProfile.name);
        setUserImage(userProfile.image);
     }, [userProfile]);   

    return (
        <div className='flex justify-between p-2 mx-6 relative w-auto'>
            {/* sideBar open button / visible when side bar is closed */}
            {!activeMenu ? (
                <NavButton 
                    title='Menu' 
                    customFunc={() => {
                        setActiveMenu((prev) => !prev);
                    }}
                    icon={<AiOutlineMenu />}
                    color='blue'
                />) : (<p></p>)} {/* flex justify-between으로 profile을 우측 정렬하기 위해 비어있는 항목을 남겨둔다 */}
            
            {/* icons in navbar */}
            <div className='flex'>
                {/* <NavButton 
                    title='chat' 
                    customFunc={() => {
                        handleClick('chat')
                    }}
                    icon={<BsChatLeft />}
                    color='blue'
                /> */}
                {/* <NavButton 
                    title='Notification' 
                    customFunc={() => {
                        handleClick('notification')
                    }}
                    icon={<RiNotification3Line />}
                    color='blue'
                /> */}

                {/* TODO: google login 버튼으로 변경, 로그인 로그아웃 가능하도록 */}
                <TooltipComponent
                    content="Profile"
                    position="BottomCenter"
                >
                    <div
                        className='flex items-center gap-2 cursor-pointer p-1 hover:bg-lightt-gray rounded-lg'
                        onClick={() => {
                                handleClick('userProfile');
                            }
                        }
                    >
                        {userImage ? (
                            <img className='rounded-full w-8 h-8' src={userImage} alt="image"/>
                          ) : (
                            <CgProfile className='rounded-full w-8 h-8'></CgProfile>
                        )}
                        
                        <p>
                            <span className='text-gray-400 text-14'>{userName ? userName : "login"}</span>
                        </p>
                        <MdKeyboardArrowDown className='text-gray-400 text-14' />
                    </div>

                </TooltipComponent>

                {/* 클릭시 nav bar에 해당 내용 표시 */}
                {/* {isClicked.chat && <Chat/>}
                {isClicked.notification && <Notification/>} */}
                {isClicked.userProfile && <UserProfile/>}
                <div className='flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg'>
                    <NavButton 
                        title='UserProfile' 
                        customFunc={() => {
                            handleClick('userProfile')
                        }}
                    />
                </div>
            </div>
        </div>
    )
}


export default Navbar