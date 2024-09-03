import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { GetUserProfileService } from "../../services/UserProfileService"
import { ReactComponent as MenuIcon } from '../../../images/menuimage.svg'
import {ReactComponent as StoreIcon } from '../../../images/storeimage.svg'
import {ReactComponent as CreateNewIcon } from '../../../images/addproductimage.svg'
import {ReactComponent as CartIcon } from '../../../images/cartimage.svg'
import {ReactComponent as LogoutIcon } from '../../../images/logoutimage.svg'
import {ReactComponent as NewOrdersIcon } from '../../../images/newordersimage.svg'
import {ReactComponent as NotificationIcon } from '../../../images/notificationimage.svg'
import {ReactComponent as OrderHistoryIcon } from '../../../images/orderhistoryimage.svg'
import {ReactComponent as UserProfileIcon } from '../../../images/userimage.svg'
import {ReactComponent as VerificationIcon } from '../../../images/verifyimage.svg'

export default function Navbar() {

  const [navToggle, setNavtoggle] = useState(false);
  const [bodypdToggle, setbodypdToggle] = useState(false);
  const [headerToggle, setheaderToggle] = useState(false);
  const [activeLink, setActiveLink] = useState("link0");
  const [userType, setuserType] = useState()
  const [userverified, setuserverified] = useState()
  const [notifications, setNotifications] = useState([])
  const [cart, setCart] = useState([])
  const [dropdownNotification, setDropdownNotification] = useState(false)
  const [dropdownCart, setDropdownCart] = useState(false)
  const [dropdownProfile, setDropdownProfile] = useState(false)
  const [profilepicture, setprofilepicture] = useState("")

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'))
    if (token) {
      setuserType(token['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
    }
    GetUserData(token['userid']);
  }, [])

  const logOut = () => {
    localStorage.clear('token');
    localStorage.clear('username');
    localStorage.clear('userverified')
    localStorage.clear('encodedtoken')
  }

  const GetUserData = async (userid) => {
    const resp = await GetUserProfileService(userid);
    localStorage.setItem("username", JSON.stringify(resp.name+" "+resp.surname))
    localStorage.setItem("userverified", JSON.stringify(resp.verify))
    setuserverified(resp.verify)
    setprofilepicture(`data:image/png;base64,${resp.picture}`)
  }

  const toggleNavbar = () => {
    setNavtoggle(!navToggle);
    setbodypdToggle(!bodypdToggle)
    setheaderToggle(!headerToggle)
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const addNotification = (message) => {
    setNotifications([...notifications, message])
  }

  const addToCart = (product) => {
    setCart([...cart, product])
  }

  const handleDropdownNotificationToggle = () => {
    setDropdownNotification(!dropdownNotification);
    setDropdownProfile(false)
  };

  const handleDropdownCartToggle = () => {
    setDropdownCart(!dropdownCart);
  };

  const handleDropdownProfileToggle = () => {
    setDropdownProfile(!dropdownProfile);
    setDropdownNotification(false)
  };

  return (
    <div className={bodypdToggle ? "body body-pd" : 'body'}>
      <div className={headerToggle ? "header body-pd":"header"}>
        <div className="header_toggle" onClick={toggleNavbar}> <MenuIcon className="iconhover" fill="#5e6670"/></div>
        <div className='header_pt2'>
          {userType==="kupac" && <div className='header_toggle' onClick={handleDropdownCartToggle}><CartIcon className="iconhover" fill="#5e6670"/></div>}
          <div className='header_toggle' onClick={handleDropdownNotificationToggle}><NotificationIcon className="iconhover" fill="#5e6670"/></div>
          {dropdownNotification && (
          <div className="notification-dropdown">
            {notifications.length === 0 ? (
              <div className="notification-item">No new notifications</div>
            ) : (
              notifications.map((notification, index) => (
                <div key={index} className="notification-item">
                  {notification}
                </div>
              ))
            )}
          </div>
        )}
          <div className="header_toggle" onClick={handleDropdownProfileToggle}> <img src={profilepicture} alt="" width={40} height={40} className="iconhover" style={{borderRadius:"40%"}}/> </div>
          {dropdownProfile && (
          <div className="profile-dropdown">
            {<>
            <Link to="profile" className="profile-item">
                <UserProfileIcon className='profile-icon' fill="#fbc85c"/>
                <span className='profile-name'>User Profile</span>
            </Link>
            <Link to="../../login" onClick={() => logOut()} className="profile-item">
                <LogoutIcon className='profile-icon' fill="#fbc85c"/>
                <span className='profile-name'>Log out</span>
            </Link>
            </>
            }
          </div>
        )}
        </div>
      </div>
      <div className={navToggle ? "l-navbar show" : "l-navbar"} id="nav-bar">
        <nav className="nav">
          <div> 
            <Link to="../home" className={activeLink==="link0" ? "nav_logo active":'nav_logo'} onClick={() => handleLinkClick("link0")}>
              <StoreIcon className='nav_logo-icon' fill="#fbc85c"/>
              <span className='nav_logo-name'>ReactStore</span>
            </Link>
            <div className="nav_list"> 
              {userType==="prodavac" && userverified==="True" && <Link to="addproduct" className={activeLink==="link2" ? "nav_link active":'nav_link'} onClick={() => handleLinkClick("link2")}>
                <CreateNewIcon className='nav_icon' fill="#fbc85c"/>
                <span className='nav_name'>Add product</span>
              </Link>}
              {userType==="kupac" && <Link to="neworder" className={activeLink==="link3" ? "nav_link active":'nav_link'} onClick={() => handleLinkClick("link3")}>
                <CreateNewIcon className='nav_icon' fill="#fbc85c"/>
                <span className='nav_name'>New Order</span>
              </Link>}
              {userType==="kupac" && <Link to="orderhistorybuyer" className={activeLink==="link4" ? "nav_link active":'nav_link'} onClick={() => handleLinkClick("link4")}>
                <OrderHistoryIcon className='nav_icon' fill="#fbc85c"/>
                <span className='nav_name'>Order History</span>
              </Link>}
              {userType==="admin" && <Link to="verification" className={activeLink==="link5" ? "nav_link active":'nav_link'} onClick={() => handleLinkClick("link5")}>
                <VerificationIcon className='nav_icon' fill="#fbc85c"/>
                <span className='nav_name'>Verify users</span>
              </Link>}
              {userType==="prodavac" && userverified==="True" &&<Link to="newordersseller" className={activeLink==="link6" ? "nav_link active":'nav_link'} onClick={() => handleLinkClick("link6")}>
                <NewOrdersIcon className='nav_icon' fill="#fbc85c"/>
                <span className='nav_name'>New orders</span>
              </Link>}
              {userType==="prodavac" && userverified==="True" && <Link to="orderhistoryseller" className={activeLink==="link7" ? "nav_link active":'nav_link'} onClick={() => handleLinkClick("link7")}>
                <OrderHistoryIcon className='nav_icon' fill="#fbc85c"/>
                <span className='nav_name'>Order history</span>
              </Link>}
              {userType==="admin" && <Link to="orderhistoryadmin" className={activeLink==="link8" ? "nav_link active":'nav_link'} onClick={() => handleLinkClick("link8")}>
                <OrderHistoryIcon className='nav_icon' fill="#fbc85c"/>
                <span className='nav_name'>Order history</span>
              </Link>}
            </div>
          </div> 
        </nav>
      </div>
    </div>
  );
}
