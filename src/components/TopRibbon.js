import React from 'react';
import UserLogin from '../components/Userlogin';
import './TopRibbon.css';


export default function TopRibbon({ loggedInUser, setLoggedInUser }) {
  return (
    <div className="top-ribbon">
        <ul>
          <li className="active-ribbon">Personal</li>
          <li>Small Business</li>
          <li>Wealth Management</li>
          <li>Businesses {"&"} Institutions</li>
          <li>Security</li>
        </ul>
        <div className="login-widget">
          <UserLogin loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}></UserLogin>
        </div>        
    </div>
  )
}