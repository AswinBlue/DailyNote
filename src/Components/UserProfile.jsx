import React, { useEffect, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import SimpleButton from './SimpleButton';
import { useGapiContext, gapiConfig } from '../API/GAPI';

import { useStateContext } from '../Contexts/ContextProvider';
import loginIcon from '../Data/icons/btn_google_signin_light_normal_web.png';

import { userProfileData } from '../Data/dummy';

const UserProfile = ({ avatar }) => {
    const { isSignedIn, gapiLogout, gapiLogin, userProfile } = useGapiContext()
    const { isClicked, setIsClicked } = useStateContext();

    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userImage, setUserImage] = useState(null);

    useEffect(() => {
        // gapiRenderLoginButton();
    }, []) // 최초 1회

    useEffect(() => {
        // rerender when login status change
    }, [isSignedIn])

    useEffect(() => {
       setUserName(userProfile.name);
       setUserEmail(userProfile.email);
       setUserImage(userProfile.image);
    }, [userProfile]);    

    return (
        <div className="nav-item absolute border-1 shadow-md right-1 top-16 bg-white dark:bg-[#525252] p-4 rounded-lg">
            {/* HEAD: title & close button */}
            <div className="flex justify-between items-center w-full">
                {/* title */}
                <p className="font-semibold text-lg dark:text-gray-200">{isSignedIn ? "" : "Sign in"}</p>
                {/* close button */}
                <SimpleButton
                    icon={<MdOutlineCancel />}
                    color="rgb(156, 163, 175)"
                    bgHoverColor="light-gray"
                    size="2xl"
                    borderRadius="50%"
                    onClick={() => setIsClicked(false)}
                />
            </div>
            {/* BODY: userIcon & name & so on ... */}
            {console.log(isSignedIn)}
            {isSignedIn ? (
                // if logged in, show user data
                <div>
                    {/* row1: use icon & user name */}
                    <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
                        <img
                            className="rounded-full h-24 w-24"
                            referrerpolicy="no-referrer"
                            src={userImage}
                        />
                        <div>
                            <p className="font-semibold text-xl dark:text-gray-200"> {userName} </p>
                            {/* <p className="text-gray-500 text-sm dark:text-gray-400">  {userRole}   </p> */}
                            <p className="text-gray-500 text-sm font-semibold dark:text-gray-400"> {userEmail} </p>
                        </div>
                    </div>
                    {/* row2: user data */}
                    {/* <div>
                        {userProfileData.map((item, index) => (
                            <div key={index} className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
                                <button
                                    type="button"
                                    style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                                    className=" text-xl rounded-lg p-3 hover:bg-light-gray"
                                >
                                    {item.icon}
                                </button>

                                <div>
                                    <p className="font-semibold dark:text-gray-200 ">{item.title}</p>
                                    <p className="text-gray-500 text-sm dark:text-gray-400"> {item.desc} </p>
                                </div>
                            </div>
                        ))}
                    </div> */}
                    <div className="mt-5">
                        <SimpleButton
                            bgColor="blue"
                            color="white"
                            text="Logout"
                            borderRadius="10px"
                            width="full"
                            onClick={() => {gapiLogout()}}
                        />
                    </div>
                </div>
            ) : (
                // if not logged in, show login button
                <>
                <button 
                    className='flex items-center justify-center w-52'
                    onClick={() => {gapiLogin()}}
                    >
                    <img className="w-fit" src={loginIcon} alt="Login"/>
                </button>
                {/* if use googleId
                <div id={gapiConfig.GOOGLE_LOGIN_BUTTON_ID}/> 
                */}
                </>
            )}
        </div>

    );
}

export default UserProfile;