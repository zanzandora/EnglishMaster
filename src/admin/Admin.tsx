import React from 'react'
import Header from './bar/Header'

const Admin: React.FC = () => {
  return (
    <div>
      {/* HEADER */}
      <Header />

      {/* BODY START */}
      <div className='flex w-full h-full mt-20'>

        {/* SHORTCUTS */}
        <div className='flex flex-row gap-20 mx-auto'>
          <div className='flex flex-col w-80 h-40 bg-white shadow-xl rounded-xl'>
            <div className='flex w-full h-full border-2 border-gray-400 rounded-xl'>
              <span className='mx-auto text-2xl font-semibold'>Học viên</span>
            </div>
          </div>
          <div className='flex flex-col w-80 h-40 bg-white shadow-xl rounded-xl'>
            <div className='flex w-full h-full border-2 border-gray-400 rounded-xl'>
              <span className='mx-auto text-2xl font-semibold'>Giảng viên</span>
            </div>
          </div>
          <div className='flex flex-col w-80 h-40 bg-white shadow-xl rounded-xl'>
            <div className='flex w-full h-full border-2 border-gray-400 rounded-xl'>
              <span className='mx-auto text-2xl font-semibold'>Khoá học</span>
            </div>
          </div>
          <div className='flex flex-col w-80 h-40 bg-white shadow-xl rounded-xl'>
            <div className='flex w-full h-full border-2 border-gray-400 rounded-xl'>
              <span className='mx-auto text-2xl font-semibold'>Lớp học</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Admin