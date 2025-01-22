import { useState } from 'react'
import Burger from '../svg/Burger'
import { Link } from 'react-router-dom'

const Header = () => {
  const [sidebar, setSidebar] = useState(false)

  return (
    <>
      <header className='px-6 gap-2 bg-[#272727] text-white text-center fixed left-0 top-0 w-full h-16 text-2xl flex z-20'>
        <div className='cursor-pointer w-12 h-12 my-auto' onClick={() => setSidebar(state => !state)}>
          <Burger />
        </div>
        <p className='m-auto select-none'>Admin</p>
      </header>

      <div
        className={`bg-[#272727] p-2 absolute top-0 left-0 z-10 transition-all mt-16 h-[calc(100vh-4rem)] text-white`}
        style={{
          width: sidebar ? '20rem' : '0px',
          padding: sidebar ? '1rem' : '0px'
        }}
      >
        <div style={{ display: sidebar ? 'block' : 'none' }}>
          <h2>Admin Panel</h2>
          <ul>
            <li>
              <Link to='/admin/nguoidung'>Người dùng</Link>
            </li>
            <li>
              <Link to='/admin/admin'>Admin</Link>
            </li>
            <li>
              <Link to='/admin/hocvien'>Học viên</Link>
            </li>
            <li>
              <Link to='/admin/giangvien'>Giao Vien</Link>
            </li>
            <li>
              <Link to='/admin/khoahoc'>Khoa Hoc</Link>
            </li>
            <li>
              <Link to='/admin/lophoc'>Lop</Link>
            </li>
            <li>
              <Link to='/admin/diemdanh'>Diem Danh</Link>
            </li>
            <li>
              <Link to='/admin/diem'>Diem</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Header
