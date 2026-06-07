import React from 'react';
import { Link } from 'react-router-dom';
import '../app-site-nav.css';

export default function AppSiteNav() {
  return (
    <header className="app-site-nav" role="banner">
      <nav className="app-site-nav__inner" aria-label="Primary">
        <Link to="/" className="app-site-nav__logo">
          Nikole Glenn
        </Link>
        <ul className="app-site-nav__links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/portfolio">Work</Link>
          </li>
          <li>
            <Link to="/" title="Homepage (categories is on the home experience)">
              Categories
            </Link>
          </li>
          <li>
            <Link to="/about">About Me</Link>
          </li>
          <li>
            <Link to="/inquire">Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
