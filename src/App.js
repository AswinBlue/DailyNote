import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Navbar, Sidebar, Footer } from './Components';
import * as C from './Components';
import * as P from './Pages';
import { useStateContext } from './Contexts/ContextProvider';

import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

function App() {
  const { activeMenu, screenSize, setScreenSize } = useStateContext();
      
  // check window size whenever rerendered
  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth); // function which set screenSize as window size
      console.log(window.innerWidth);
    }
    handleResize();
    window.addEventListener('resize', handleResize); // track 'resize' options with 'handleResize' function
    return (() => window.removeEventListener('resize', handleResize));
  }, []);

  const load_kakao_adfit = () => {
    /*
        <ins class="kakao_ad_area" style="display:none;"
          data-ad-unit = "DAN-93U06CmtLr4v8SGg"
          data-ad-width = "320"
          data-ad-height = "50"></ins>
        <script type="text/javascript" src="//t1.daumcdn.net/kas/static/ba.min.js" async></script>
    */
    var ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.setAttribute('data-ad-width', '320');
    ins.setAttribute('data-ad-height', '50');
    ins.setAttribute('data-ad-unit', 'DAN-93U06CmtLr4v8SGg');
    document.querySelector('#advertise').appendChild(ins);
    
    var script = document.createElement('script');
    ins.style = "display:none; width:100%;";
    script.async = 'true';
    script.type = "text/javascript";
    script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    document.querySelector('#advertise').appendChild(script);
  }

  // useEffect(() => {
  //   setScreenSize(window.innerWidth);
  //   console.log("screenSize:", screenSize, window.innerWidth);
  // }, []); // only once

  useEffect(() => {
    document.title = process.env.REACT_APP_PAGE_NAME;
    load_kakao_adfit();
  }, []);
  
  return (
    <div className='transform scale-50 md:scale-75 lg:scale-90 xl:scale-100'>
      {/* 전체 화면구성 */}
      <div className='flex relative dark:bg-main-dark-bg'>
        {/* 우측 하단에 고정으로 떠있는 버튼 */}
        {/*
          <div className="fixed right-4 bottom-4 z-50">
          <TooltipComponent content="Settings" position="Top">
            <button type="button" className="text-3xl p-3 hover:drop-shadow-xl text-white hover:bg-light-gray rounded-full" style={{ background:'blue'}}>
              <FiSettings/>
            </button>
          </TooltipComponent>
        </div> 
        */}

        {/* sidebar 설정 */}
        {activeMenu ? (
          <div className='w-72 fixed sidebar h-full dark:bg-secondary-dark-bg bg-white'>
            <Sidebar></Sidebar>
          </div>
        ) : (
          <div className='w-0 dark:bg-secondary-dark-bg'>
            <Sidebar></Sidebar>
          </div>
        )}

        {/* 메인 화면 */}
        <div className={`
          dark:bg-main-bg bg-main-bg min-h-screen w-full ${activeMenu ? 'md:ml-72' : 'flex-2'}
        `}>

          {/* navigation bar */}
          <div className='static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
            <Navbar/>
          </div>
            
          {/* url별로 다르게 표시할 화면 */}
          <div>
            <Routes>
              <Route path="/" element={<P.DashBoard />} />
              <Route path={"/" + process.env.REACT_APP_PAGE_NAME} element={<P.DashBoard />} />
              <Route path="/dashboard" element={<P.DashBoard />}/>
              <Route path="/calendar" element={<P.Calendar />}/>
              <Route path="/list" element={<P.List />} />
              <Route path="/write" element={<P.Write />} />
              <Route path="/*" element={<P.DashBoard />} />
            </Routes>
          </div>
          <div id='advertise'></div>  {/* 광고 배너 */}
        </div>
      </div>
    </div>
  );
}

export default App;
