import {Link} from 'react-router-dom';
import React, {useContext} from 'react';
import '../components/AnonNav';
import LanguageContext from '../helpers/LanguageContext';
import languages from '../components/languages';


function AppNav() {
 
    const {language} = useContext(LanguageContext);
    const data = languages[language];

    
    const pages = Object.keys(data.pages);
    const navs = pages.map(key => {
        const page = data.pages[key];
        return {
                pageKey: key,
                id: page.id.replace('-page','-link'),
                dataFor: page.id.replace('-page','-link-tooltip'),
                toolTip: page["nav-tool-tip"],
                navButton: page["nav-button"],
                navRoute: page["nav-route"]
                }
    });

    const changeActive = e => {
       let targetEl = e.currentTarget;
       let link = targetEl.getElementsByClassName('nav-link')[0];
       let currentlyActive = Array.from(document.getElementsByClassName('active'));
        currentlyActive.forEach(el => el.classList.remove('active'));
        link.classList.add('active');
    }  

    const pageUrl = window.location.hash;

    const active = {home: pageUrl === '#/' ? ' active' : '',
                    createAccount: pageUrl === '#/create-account/' ? ' active' :  '',
                    deposit: pageUrl === '#/Deposit/' ? ' active' :  '',
                    withdraw: pageUrl === '#/Withdraw/' ? ' active' :  '',
                    Balance: pageUrl === '#/Balance/' ? ' active' :  '',
                    allData: pageUrl === '#/All-data/' ? ' active' :  ''
                    }

    return (
        <nav className="navbar navbar-expand-md navbar-dark responsive-nav" style={{backgroundColor:"#c41230", fontWeight: "500"}}>
            <div className="container-fluid" style={{justifyContent:"left"}}>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent2" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent2">
                    <ul id="app-navigation" className="navbar-nav me-auto mb-2 mb-lg-0 justify-content-center" style={{boxSizing:"border-box",marginTop:'4px',width:"100%"}}>
                        {navs.map((nav,i)=> <li id={nav.id} key={i} style={{padding:"0px 20px"}} onClick={e=> changeActive(e)} className="nav-item" data-for={nav.dataFor}  data-iscapture="true" data-tip={nav.toolTip}><Link to={nav.navRoute} className={"nav-link" + active[nav.pageKey]}>{nav.navButton}</Link></li>)}
                    </ul>
                </div>
            </div>
        
        </nav>
    )
}

export default AppNav;