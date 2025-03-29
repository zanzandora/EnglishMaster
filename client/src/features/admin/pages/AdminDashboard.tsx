import React from 'react';
import { UserCard, RevenueCard } from '@components/common/UserCard';
import CountChart from '@components/admin/charts/CountChart';
import StudentGrowthChart from '@components/admin/charts/StudentGrowthChart';
import FinanceChart from '@components/admin/charts/FinanceChart';
import EventCalendar from '@components/admin/EventCalendar';
import Announcements from '@components/admin/Announcements';
import { useTranslation } from 'react-i18next';

const Admin: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className='p-4 flex gap-4 flex-col md:flex-row'>
        {/* LEFT */}
        <div className='w-full lg:w-2/3 flex flex-col gap-8'>
          {/* USER CARDS */}
          <div className='flex gap-4 justify-between flex-wrap'>
            <UserCard type={t('card.label.students')} />
            <UserCard type={t('card.label.teachers')} />
            <RevenueCard revenue={123456} />
          </div>
          {/* MIDDLE CHARTS */}
          <div className='flex gap-4 flex-col lg:flex-row'>
            {/* COUNT CHART */}
            <div className='w-full lg:w-1/3 h-[450px]'>
              <CountChart />
            </div>
            {/* STUDENT GROWTH CHART */}
            <div className='w-full lg:w-2/3 h-[450px]'>
              <StudentGrowthChart />
            </div>
          </div>
          <div className='w-full h-[500px]'>
            <FinanceChart />
          </div>
        </div>
        {/* RIGHT */}
        <div className='w-full lg:w-1/3 flex flex-col gap-8'>
          <EventCalendar />
          <Announcements />
        </div>
      </div>
    </>
  );
};

export default Admin;
