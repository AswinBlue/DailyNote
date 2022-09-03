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
  const { activeMenu } = useStateContext();
  return (
    <div>
      <BrowserRouter>
        <div className='flex relative dark:bg-main-dark-bg'>
          <div className="fixed right-4 bottom-4 z-50">
            <TooltipComponent content="Settings" position="Top">
              <button type="button" className="text-3xl p-3 hover:drop-shadow-xl text-white hover:bg-light-gray rounded-full" style={{ background:'blue'}}>
                <FiSettings/>
              </button>
            </TooltipComponent>
          </div>

          {activeMenu ? (
            <div className='w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white'>
              <Sidebar></Sidebar>
            </div>
          ) : (
            <div className='w-0 dark:bg-secondary-dark-bg'>
              <Sidebar></Sidebar>
            </div>
          )}
          <div className={`
            dark:bg-main-bg bg-main-bg min-h-screen w-full ${activeMenu ? 'md:ml-72' : 'flex-2'}
          `}>
            <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full'>
              <Navbar/>
            </div>

            <div>
              <Routes>
                <Route path="/" element={<P.Record />} />
                <Route path="/record" element={<P.Record />}/>
                <Route path="/calendar" element={<P.Calendar />}/>

                <Route path="/read" element={<P.Read />} />
                <Route path="/write" element={<P.Write />} />
                <Route path="/kanban" element={<P.Kanban />} />
                <Route path="/editor" element={<P.Editor />} />
                <Route path="/color_picker" element={<P.ColorPicker />} />

                <Route path="/line" element={<P.Line />} />
                <Route path="/area" element={<P.Area />} />
                <Route path="/bar" element={<P.Bar />} />
                <Route path="/pie" element={<P.Pie />} />
                <Route path="/pyramid" element={<P.Pyramid />} />
                <Route path="/stacked" element={<P.Stacked />} />
                <Route path="/color_mapping" element={<P.ColorMapping />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
