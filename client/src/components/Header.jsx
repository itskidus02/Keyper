import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from "../assets/images/logo.png"
export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className='bg-transparent text-black backdrop-blur-3xl'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link  className="flex items-center gap-3" to='/'>
          <img src={logo} className='w-10 h-8' alt="" />
          <h1 className='font-bold'>LockBox</h1>
        </Link>
        <ul className='flex items-center gap-4'>
          <Link to='/'>
            <li>Home</li>
          </Link>
          <Link to='/about'>
            <li>About</li>
          </Link>
          <Link to='/admin/profile'>
            {currentUser ? (
              <img src={currentUser.profilePicture} alt='profile' className='h-7 w-7 rounded-full object-cover' />
            ) : (
              <li>Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
}
