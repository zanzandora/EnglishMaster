import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AccountPopover = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const popoverRef = useRef(null)

  const handleLogout = async () => {
    await fetch('/logout', { method: 'POST' })
    navigate(0)
  }

  // *Đóng popover khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !(popoverRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [popoverRef])

  return (
    <div className='relative' ref={popoverRef}>
      {/* Avatar */}
      <button
        onClick={() => setOpen(!open)}
        className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:opacity-80 focus:outline-none'
      >
        <img src='/avatar.png' alt='User Avatar' className='rounded-full' />
      </button>

      {/* Popover Content */}
      {open && (
        <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10'>
          <div className='px-4 py-3 border-b'>
            <p className='font-semibold lowercase'>mai minh tu</p>
            <p className='text-sm text-gray-500 truncate'>
              maiminhtu130803@gmail.com
            </p>
          </div>
          <ul className='py-2'>
            <li>
              <button
                onClick={() => navigate('/profile')}
                className='w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
              >
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/settings')}
                className='w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
              >
                Settings
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className='w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50'
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default AccountPopover
