import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/educator/Navbar';
import SideBar from '../../components/educator/SideBar';
import Footer from '../../components/educator/Footer';
import { AppContext } from '../../context/AppContext';

const Educator = () => {
  const { isEducator } = useContext(AppContext);

  return (
    <div className='text-default min-h-screen bg-white flex flex-col'>
      <Navbar />
      <div className='flex flex-1'>
        {isEducator && <SideBar />}
        <div className='flex-1 min-w-0 p-4'>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Educator;
