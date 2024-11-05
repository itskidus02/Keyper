import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeToggle } from './theme-toggle';
import { useTheme } from 'next-themes';
import logo from "../assets/images/logo.png";
import wlogo from "../assets/images/wlogo.png";


export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const { resolvedTheme } = useTheme();
  const currentLogo = resolvedTheme === "dark" ? wlogo : logo;  
  return (
    <header className='sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-14 items-center justify-between max-w-6xl mx-auto px-4'>
        <Link className="flex items-center gap-3" to='/'>
          <img src={currentLogo} className='w-10 h-8' alt="LockBox Logo" />
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
                className='h-10 w-10 rounded-full object-cover transition-all' 
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