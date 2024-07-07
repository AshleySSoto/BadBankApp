import React from 'react';
import { useContext } from 'react';
import Card from '../components/card.js';
import LanguageContext from '../helpers/LanguageContext.js';
import languages from '../components/languages.js';
import UserContext from '../helpers/UserContext.js';
import UserDBContext from '../helpers/UserDBContext.js';
import SignIn from '../components/signin.js';
import bank from '../Images/bank.jpeg';

function Home() {
    const { language } = useContext(LanguageContext);

    const { loggedInUser } = useContext(UserContext);
    const { users } = useContext(UserDBContext);
    
   
    const pageName = "home";
    let { header, card: { cardMsg }, id } = languages[language].pages[pageName];
    const [content, image] = [<span>{ cardMsg }</span>, bank.jpeg];

    if (loggedInUser) { header += ", " + users.filter(x => x.id === loggedInUser)[0].username + "!"; }
    
    return (
        <div className="home-splash">  
            { loggedInUser ? null :  <SignIn /> } 
            <Card id={ id } image={ image } header={ header } content={ content }></Card>
        </div> 
    )

}

export default Home;