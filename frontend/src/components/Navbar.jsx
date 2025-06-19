import React from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { Link, useLocation } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../lib/api';
import { BellIcon, LogOutIcon, ShipWheelIcon } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import useLogout from '../hooks/useLogout';

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation} = useLogout();
  return (
    <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-12 flex items-center'> {/* h-16 */}
       <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
         <div className='flex items-center justify-end w-full'>
           {/* LOGO - ONLY IF WE ARE IN THE CHAT PAGE */}
           { isChatPage && (
             <div className='pl-5'>
                <Link to="/" className='flex items-center gap-2.5'>
                  <ShipWheelIcon className='size-9 text-primary'/>
                  <span className='text-3xl font-bold font-mono bg-clip-text text-transparetn bg-gradient-to-r from-primary to-secondary tracking-wider'>
                    Streamify
                  </span>
                </Link>
             </div>
           )}
           <div className='flex items-center gap-3 sm:gap-4 ml-auto'>
             <Link to={"/notifications"}>
               <button className='btn btn-ghost btn-circle'>
                <BellIcon className='h-4 w-4 text-base-content opacity-70'/> {/*  keep height 6  */}
               </button>
             </Link>
           </div>
           <ThemeSelector/>

           <div className='avatar'>
             <div className='w-7 rounded-full'>  {/* w-6 */}
               <img src={authUser?.profilePic} alt="User Avatar" rel='noreferrer' />
             </div>
           </div>
           <button className='btn btn-ghost btn-circle' onClick={logoutMutation}>
             <LogOutIcon className='h-4 w-4 text-base-content opacity-70'/>   {/* h-6 w-6 */}
           </button>
         </div>
       </div>
    </nav>
  )
}

export default Navbar