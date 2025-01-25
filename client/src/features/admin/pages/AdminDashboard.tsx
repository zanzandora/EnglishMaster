import React from 'react';
import UserCard from '@components/common/UserCard';
const Admin: React.FC = () => {
  return (
    <>
      <div className='p-4 flex gap-4 flex-col md:flex-row'>
        {/* LEFT */}
        <div className='w-full lg:w-2/3 flex flex-col gap-8'>
          {/* USER CARDS */}
          <div className='flex gap-4 justify-between flex-wrap'>
            <UserCard type='student' />
            <UserCard type='teacher' />
            <UserCard type='parent' />
            <UserCard type='staff' />
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
