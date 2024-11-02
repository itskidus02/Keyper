import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeToggle } from './theme-toggle';
import logo from "../assets/images/logo.png";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-14 items-center justify-between max-w-6xl mx-auto px-4'>
        <Link className="flex items-center gap-3" to='/'>
          <img src={logo} className='w-10 h-8' alt="LockBox Logo" />
          <h1 className='font-bold'>LockBox</h1>
        </Link>
        
        <div className='flex items-center gap-4'>
          <nav className='flex items-center gap-4'>
            <Link to='/' className='text-sm font-medium transition-colors hover:text-primary'>
              Home
            </Link>
            <Link to='/about' className='text-sm font-medium transition-colors hover:text-primary'>
              About
            </Link>
          </nav>
          
          <ThemeToggle />
          
          <Link to='/admin/profile'>
            {currentUser ? (
              <img 
                src={currentUser.profilePicture} 
                alt='profile' 
                className='h-8 w-8 rounded-full object-cover ring-2 ring-primary transition-all hover:ring-4' 
              />
            ) : (
              <span className='text-sm font-medium transition-colors hover:text-primary'>Sign In</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}