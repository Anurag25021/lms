import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets, dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/student/Loading';

const Dashboard = () => {
  const { currency } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setDashboardData(dummyDashboardData);
    };
    fetchDashboardData();
  }, []);

  return dashboardData ? (
    <div className='min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <div className='space-y-5 w-full'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full'>
          {[
            { icon: assets.patients_icon, value: dashboardData.enrolledStudentsData.length, label: 'Total Enrollments' },
            { icon: assets.appointments_icon, value: dashboardData.totalCourses, label: 'Total Courses' },
            { icon: assets.earning_icon, value: `${currency}${dashboardData.totalEarnings}`, label: 'Total Earnings' }
          ].map((item, index) => (
            <div 
              key={index} 
              className='flex flex-col items-center justify-between shadow-card border border-blue-500 p-6 rounded-md min-h-[150px] text-center flex-1'
            >
              <img src={item.icon} alt={item.label} className="w-12 h-12" />
              <p className='text-2xl font-medium text-gray-600'>{item.value}</p>
              <p className='text-base text-gray-500'>{item.label}</p>
            </div>
          ))}
        </div>
        <div>
          <h2 className='pb-4 text-lg font-medium'>Latest Enrollments</h2>
          <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
            <table className='table-fixed md:table-auto w-full overflow-hidden'>
              <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left '>
                <tr>
                  <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>#</th>
                  <th className='px-4 py-3 font-semibold'>Student Name</th>
                  <th className='px-4 py-3 font-semibold'>Course Title</th>
                </tr>
              </thead>
              <tbody className='text-sm text-gray-500'>
                {dashboardData.enrolledStudentsData.map((item, index) => (
                  <tr key={index} className='border-b border-gray-500/20'>
                    <td className='px-4 py-3 text-center hidden sm:table-cell'>{index + 1}</td>
                    <td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
                      <img src={item.student.imageUrl} alt="Profile" className='w-9 h-9 rounded-full'/>
                      <span className='truncate'>{item.student.name}</span>
                    </td>
                    <td className='px-4 py-3 truncate'>{item.courseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : <Loading />;
};

export default Dashboard;
