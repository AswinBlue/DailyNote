import React, { createContext, useContext, useState } from 'react';

// 특정 state 값을 하위 component들에게 recursive하게 전달하기 위해 제공되는 hook
// state 값을 공유할 대상을 ContextProvider component로 wrapping한다.
const StateContext = createContext();

const initialState = {
    chat: false,
    chart: false,
    userProfile: false,
    notification: false,
}

export const ContextProvider = ({ children }) => {
    const [activeMenu, setActiveMenu] = useState(true);

    return (
        <StateContext.Provider 
            value={({ 
                activeMenu: activeMenu,
                setActiveMenu: setActiveMenu,
            })}
        >
            {children}
        </StateContext.Provider>
    );
}

export const useStateContext = () => useContext(StateContext);