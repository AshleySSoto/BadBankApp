import '../src/bootstrap.min.css';
import '../src/index.js';
import { Route, Link, Routes} from "react-router-dom";
import React, { useState } from 'react';
import NotificationContext from '../src/helpers/NotificationContext.js';
import Home from '../src/pages/Home.js';
import CreateAccount from '../src/pages/CreateAccount.js';
import Deposit from '../src/pages/Deposit.js';
import Withdraw from '../src/pages/Withdraw.js';
import Balance from '../src/pages/Balance.js';
import AllData from '../src/pages/AllData.js';
import AppNav from '../src/components/AppNav.js';
import AnonNav from '../src/components/AnonNav.js';
import LanguageContext from '../src/helpers/LanguageContext.js';
import FormContext from '../src/helpers/FormContext.js';
import UserContext from '../src/helpers/UserContext.js';
import UserDBContext from '../src/helpers/UserDBContext.js';
import OptionsNav from '../src/components/OptionsNav.js';
import TopRibbon from '../src/components/TopRibbon.js';
import logo from '../src/logo.svg';
import {now} from 'lodash';

function App() {

  const [loggedInUser, setLoggedInUser] = useState('');
  const [currentAccount, setCurrentAccount] = useState(null);
  const [language, setLanguage] = useState('en');
  const [users, setUsers] = useState([]);
 

  const [form, setForm] = useState('formik');
  

const [notification, setNotification] = useState({ display: false, title: null, text: null, time: 5000, type: null, timestamp: now().toString()});

  function setNewForm(val) {
    setForm(val);
  }

  function addUser(user) {
    let currentUsers = [...users];
    currentUsers.push(user);
    setUsers(currentUsers);
  }

  function logOut() {
    setLoggedInUser('');
  }
  function logIn(val) {
    setLoggedInUser(val);
  }
  function setAccount(account) {
    setCurrentAccount(account);
  }
  
  function changeLanguage(lan) {
    setLanguage(lan);
  }

  const closeNotification = () => {
    let { title, text, type, time } = notification;
    setNotification({ title, text, type, time, timestamp: now().toString(), display: false })
  }

  const closeAfterDelay = ({timestamp}) => {
    let elements = document.getElementsByClassName('notification-container');
    if (elements && elements.length > 0 && elements[0].id === timestamp) {
      setNotification({});
    } 
  }

  function displayNotification({title, text, type, time}) {

    
    setNotification({display: false});

  
    const timestamp = now().toString();
    setNotification({display: true, title, text, type, time, timestamp});

    
    setTimeout(()=>closeAfterDelay({timestamp}), time);

  }

  return (
    <div>
    <Routes>
    
    <UserDBContext.Provider value={{users, addUser}}>
    <UserContext.Provider value={{ loggedInUser, logOut, logIn }}>
        <LanguageContext.Provider value={{ language, changeLanguage }}>
          <FormContext.Provider value={{ form, setNewForm }}>
            <OptionsNav></OptionsNav>
              <div className="App">
                  <TopRibbon loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
                  <div className="brand-div">
                    <Link to="/" style={{ cursor: "pointer" }}>
                      <img alt="" src={logo} className="brand-image"/>
                    </Link>
                  </div>
                  {loggedInUser ? <AppNav /> : <AnonNav />}
                  <NotificationContext.Provider value={{ displayNotification }}>
                    {notification && notification.display ? <Notification id={notification.timestamp} title={notification.title} type={notification.type} text={notification.text} handleClick={closeNotification} time={notification.time}></Notification> : null}
                    <div className="container" style={{padding:'10px'}}>
                      <Route path="/" exact component={Home}></Route>
                      <Route path="/" element={<Home/>}></Route>
                      <Route path="/create-account/" exact component={CreateAccount}></Route>
                      <Route path="/deposit/" exact component={Deposit}></Route>
                      <Route path="/withdraw/" exact component={Withdraw}></Route>
                      <Route path="/balance/" exact component={Balance}></Route>
                      <Route path="/all-data/" exact component={AllData}></Route>
                    </div>
                  </NotificationContext.Provider>
                
              </div>
            </FormContext.Provider>
          </LanguageContext.Provider>
          </UserContext.Provider>
      </UserDBContext.Provider>
    </Routes>
    </div>
  );
}

export default App;