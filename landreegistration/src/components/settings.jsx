import React, { useState } from 'react';
import './style.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faDesktop, faTable, faTh, faInfoCircle, faCogs, faAngleRight } from '@fortawesome/free-solid-svg-icons';

const SidebarMenu = () => {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const handleSubMenuToggle = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };

  return (
    <div>
      <div className="menu-btn" onClick={() => setIsSidebarActive(true)}>
        <FontAwesomeIcon icon={faBars} />
      </div>
      <div className={`side-bar ${isSidebarActive ? 'active' : ''}`}>
        <div className="close-btn" onClick={() => setIsSidebarActive(false)}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
        <div className="menu">
          <div className="item">
            <a href="#"><FontAwesomeIcon icon={faDesktop} />Dashboard</a>
          </div>
          <div className="item">
            <div className="sub-btn" onClick={() => handleSubMenuToggle('register')}>
              <FontAwesomeIcon icon={faTable} /> Register
              <FontAwesomeIcon icon={faAngleRight} className={`dropdown ${openSubMenu === 'register' ? 'rotate' : ''}`} />
            </div>
            <div className={`sub-menu ${openSubMenu === 'register' ? 'active' : ''}`}>
              <a href="#" className="sub-item">Users</a>
              <a href="#" className="sub-item">Assets</a>
            </div>
          </div>
          <div className="item">
            <a href="#"><FontAwesomeIcon icon={faTh} />Search</a>
          </div>
          <div className="item">
            <a href="#"><FontAwesomeIcon icon={faInfoCircle} />Mutation</a>
          </div>
          <div className="item">
            <div className="sub-btn" onClick={() => handleSubMenuToggle('settings')}>
              <FontAwesomeIcon icon={faCogs} /> Settings
              <FontAwesomeIcon icon={faAngleRight} className={`dropdown ${openSubMenu === 'settings' ? 'rotate' : ''}`} />
            </div>
            <div className={`sub-menu ${openSubMenu === 'settings' ? 'active' : ''}`}>
              <a href="#" className="sub-item">User Profile</a>
              <a href="#" className="sub-item">Land Data</a>
            </div>
          </div>
        </div>
      </div>
      <section className="main">
        <h1>Setting <br />Module</h1>
      </section>
    </div>
  );
};

export default SidebarMenu;
