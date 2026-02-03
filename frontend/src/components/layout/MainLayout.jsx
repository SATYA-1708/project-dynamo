import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../ui/Sidebar';
import Routes from '../../Routes';
import Icon from '../AppIcon';
import Header from '../ui/Header'

const MainLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    console.log('toggleSidebar function called in MainLayout. Current isSidebarOpen:', isSidebarOpen);
    setIsSidebarOpen(!isSidebarOpen);
  };



  const hideSidebar = location.pathname === '/login-register' || location.pathname === '/';
   const hideHeader = location.pathname === '/' || location.pathname === '/login-register';

  return (
    <>
      {!hideHeader && <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />} 
      {!hideSidebar && (
        <>
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </>
      )}
      <div className={`pt-0 ${!hideSidebar ? 'lg:ml-0' : ''} ${isSidebarOpen ? 'lg:ml-60' : 'ml-0'} transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]`}>
        <Routes />
      </div>
    </>
  );
};

export default MainLayout;