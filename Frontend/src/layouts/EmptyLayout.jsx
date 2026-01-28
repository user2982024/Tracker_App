import React from 'react'
import { Outlet } from 'react-router-dom'
// Without Navbar

const EmptyLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default EmptyLayout
