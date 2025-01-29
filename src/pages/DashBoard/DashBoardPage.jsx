import React from 'react';
import Navbar from '../../components/Organs/Navbar';
import SideBar from '../../components/Organs/SideBar';
import DashBoard from '../../components/Organs/DashBoard';
function DashBoardPage() {


  return (
    <div className='flex'>

      <Navbar />
      <SideBar />
      <DashBoard/>
    </div>
  );
}

export default DashBoardPage;