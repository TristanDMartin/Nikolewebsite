import React from 'react';
import { Link } from 'react-router-dom';
import ProjectSearchButton from './ProjectSearch';
import SiteNavBurgerButton from './SiteNavBurgerButton';
import { LANDING_WORK_PANEL_INDEX } from '../config/site';
import { useSiteNavMenu } from '../hooks/useSiteNavMenu';
import '../mobile-site-nav.css';
import '../app-site-nav.css';

const APP_SITE_NAV_MENU_ID = 'app-site-nav-menu';

export default function AppSiteNav() {
  const { isOpen, close, toggle } = useSiteNavMenu();

  return (
    <>
      <header
        className={`app-site-nav${isOpen ? ' app-site-nav--menu-open' : ''}`}
        role="banner"
      >
        <nav className="app-site-nav__inner" aria-label="Primary">
          <Link to="/" className="app-site-nav__logo" onClick={close}>
            Nikole Glenn
          </Link>
          <SiteNavBurgerButton
            isOpen={isOpen}
            onClick={toggle}
            controlsId={APP_SITE_NAV_MENU_ID}
            className="app-site-nav__burger"
          />
          <ul className="app-site-nav__links app-site-nav__links--desktop">
            <li>
              <Link to="/" onClick={close}>
                Home
              </Link>
            </li>
            <li>
              <Link
                to={`/?panel=${LANDING_WORK_PANEL_INDEX}`}
                state={{
                  landingPanel: LANDING_WORK_PANEL_INDEX,
                  landingScrollX: null,
                }}
                onClick={close}
              >
                Work
              </Link>
            </li>
            <li>
              <Link
                to="/"
                title="Homepage (categories is on the home experience)"
                onClick={close}
              >
                Categories
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={close}>
                About Me
              </Link>
            </li>
            <li>
              <Link to="/inquire" onClick={close}>
                Contact
              </Link>
            </li>
            <li>
              <ProjectSearchButton />
            </li>
          </ul>
        </nav>
      </header>
      <div
        id={APP_SITE_NAV_MENU_ID}
        className={`site-nav-mobile-drawer app-site-nav__drawer${isOpen ? ' is-open' : ''}`}
        aria-hidden={!isOpen}
      >
        <ul className="site-nav-mobile-drawer__links">
          <li>
            <Link to="/" onClick={close}>
              Home
            </Link>
          </li>
          <li>
            <Link
              to={`/?panel=${LANDING_WORK_PANEL_INDEX}`}
              state={{
                landingPanel: LANDING_WORK_PANEL_INDEX,
                landingScrollX: null,
              }}
              onClick={close}
            >
              Work
            </Link>
          </li>
          <li>
            <Link
              to="/"
              title="Homepage (categories is on the home experience)"
              onClick={close}
            >
              Categories
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={close}>
              About Me
            </Link>
          </li>
          <li>
            <Link to="/inquire" onClick={close}>
              Contact
            </Link>
          </li>
          <li>
            <ProjectSearchButton />
          </li>
        </ul>
      </div>
      <button
        type="button"
        className={`site-nav-mobile-backdrop app-site-nav__backdrop${isOpen ? ' is-visible' : ''}`}
        aria-label="Close menu"
        tabIndex={isOpen ? 0 : -1}
        onClick={close}
      />
    </>
  );
}
