import React, { createContext, useContext, useState } from 'react';

// 특정 state 값을 하위 component들에게 recursive하게 전달하기 위해 제공되는 hook
// state 값을 공유할 대상을 ContextProvider component로 wrapping한다.
const StateContext = createContext();

// navBar button clicked status
const initialState = {
    userProfile: false,
}

export const ContextProvider = ({ children }) => {
    const [activeMenu, setActiveMenu] = useState(true); // active state of sidebar menu
    const [isClicked, setIsClicked] = useState(initialState); // click state of navbar menu
    const [screenSize, setScreenSize] = useState(0);

    // handle whether navbar is clicked
    const handleClick = (clicked) => {
        setIsClicked({...initialState, [clicked]:(!isClicked[clicked])}); // switch value of key 'clicked'
    }

    return (
        <StateContext.Provider 
            value={({
                activeMenu,
                setActiveMenu,
                isClicked,
                setIsClicked,
                handleClick,
                screenSize,
                setScreenSize,
            })}
        >
            {children}
        </StateContext.Provider>
    );
}

export const useStateContext = () => useContext(StateContext);