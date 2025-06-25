import { useState } from 'react'
import './tailwind.css'

function Header() {

  return (
        <div style={{ backgroundColor: '#F40009' }} className='py-6 pl-10 text-left'>
          <div className='text-3xl text-white font-extrabold '>
            ORC Reader
          </div>
        </div>
  )
}

export default Header
