import React from 'react'
import SearchBar from './SearchBar'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="fixed w-full top-0 left-0 bg-gradient-to-r from-sky-300 to-purple-600 shadow-md shadow-zinc-700 z-50">
      <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-[70px] px-4 sm:px-8 py-3 sm:py-0 gap-3 sm:gap-0">
        
        {/* Logo / Title */}
        <Link to="/" className="flex items-center justify-center sm:justify-start w-full sm:w-auto">
          <h1 className="font-extrabold text-slate-200 text-3xl sm:text-4xl md:text-5xl text-center sm:text-left inset-shadow-gray-500">
            Comic <span className='text-slate-200'>Cluster</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <div className="w-full sm:w-auto flex justify-center sm:justify-end  pr-4 sm:pr-6 md:pr-10 ">
          <div className="w-[60%] sm:w-[250px] md:w-[300px] lg:w-[400px]">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
