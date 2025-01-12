import { Link } from 'react-router-dom'

const Side = () => {
  return (
    <div className='absolute left-0 w-0 h-full z-10 transition-all'>
      <h2>Admin Panel</h2>
      <ul>
        <li>
          <Link to='/dashboard'>Dashboard</Link>
        </li>
        <li>
          <Link to='/users'>Users</Link>
        </li>
        <li>
          <Link to='/settings'>Settings</Link>
        </li>
        <li>
          <Link to='/logout'>Logout</Link>
        </li>
      </ul>
    </div>
  )
}

export default Side