import React from 'react'
import { Link } from 'react-router-dom'
import "./Navbar.css"

const Navbar = () => {
  return (
    <header className="header">
        <Link to="/" className="logo">
          <span className="logoMark">⌗</span>
          <span>QuickLink</span>
        </Link>
        <nav className="nav">
          {/* Auth links will go here later */}
          <span className="navHint">No account needed</span>
        </nav>
    </header>
    
  )
}

export default Navbar