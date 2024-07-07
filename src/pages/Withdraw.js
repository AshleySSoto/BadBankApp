import React from 'react';
import { useContext, useState } from 'react';
import { now } from 'lodash';
import formParser from '../helpers/formParser.js';
import { getUser, parseNumber, parseValidation } from '../helpers/library.js';
import validationFunctions from '../helpers/Validation.js';
import Card from '../components/card.js';
import FormContext from '../helpers/FormContext.js';
import LanguageContext from '../helpers/LanguageContext.js';
import NotificationContext from '../helpers/NotificationContext.js';
import UserContext from '../helpers/UserContext.js';
import UserDBContext from '../helpers/UserDBContext.js';
import languages from '../components/languages.js';




function Withdraw() {


  
  const { loggedInUser } = useContext(UserContext);
  const { form: formProvider } = useContext(FormContext);
  const { language } = useContext(LanguageContext);
  const { displayNotification } = useContext(NotificationContext);

  
  const startingBalance = loggedInUser ? getUser(UserDBContext,loggedInUser).balance : 0.00;
  const [balance, setBalance] = useState(startingBalance);


  const pageName = "withdraw";
  const { header, card: {cardMsg, balanceMsg }, id, valueIfNoData, valueIfNotLoggedIn} = languages[language].pages[pageName];
  const { formSubmission, formFields } = languages[language].forms[pageName];
  const content = <div><div className="card-content">{cardMsg}</div><h4 className="card-balance-msg">{ balanceMsg }{ balance.toFixed(2) }</h4></div>;

  
  const { success, failure } = formSubmission;
  const { successTitle, failureTitle } = languages[language].general;

  
  const availableArgs = { balance };
  parseValidation(formFields, validationFunctions, availableArgs);
   
   const submitHelperFunc = (values) => {

    if (loggedInUser === '') {
        displayNotification({ title: failureTitle, type: 'failure', text: failure, time: 5000 });
        return 'failure';
    }
    else {
        let newBalance = balance - parseNumber(values.withdraw, 2);
        if (isNaN(newBalance)) {return 'failure'};
        setBalance(newBalance);
        getUser(UserContext,loggedInUser).balance = newBalance;
        getUser(UserDBContext,loggedInUser).transactions.push({ time: now(), 
                                                                credit: null, 
                                                                debit: parseNumber(values.withdraw, 2), 
                                                                description: formSubmission.typeOfAction, 
                                                                newBalance
                                                              })
        displayNotification({ title: successTitle, type: 'success', text: success, time: 5000 });
        return 'success';
    }

}
formSubmission.submitHelper = submitHelperFunc;

const form = formParser(formProvider, formFields, formSubmission);

return (
        <div>
        {   loggedInUser !== '' && balance > 0 ? <Card id={id} header={header} content={content} form={form}></Card> :
            loggedInUser !== ''  ? <Card id={ id } header={ header } content={ <div><p>{ valueIfNoData }</p><h4>{ balanceMsg }{ balance.toFixed(2) }</h4></div> } form=""></Card> : 
                                   <Card id={ id } header={ header } content={ <p>{ valueIfNotLoggedIn }</p> } form=""></Card> }
        </div>
)

}

export default Withdraw;