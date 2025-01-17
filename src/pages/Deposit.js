import React from 'react';
import { useContext, useState } from 'react';
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
import axios from 'axios';
import { API_URL } from '../helpers/constants.js';
import {now} from 'lodash';

function Deposit() {

    const userDBContext = useContext(UserDBContext);
    const { loggedInUser, currentAccount, setAccount } = useContext(UserContext);
    const { form: formProvider } = useContext(FormContext);
    const { language } = useContext(LanguageContext);
    const { displayNotification } = useContext(NotificationContext);
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const getAccounts = async () => {
        console.log(userDBContext.users[0]);
        const result = await axios.get(
            `${API_URL}/customer/accounts`,
            {
                params: { id: userDBContext.users[0].customerID },
                headers: { Authorization: `Bearer ${userDBContext.users[0].access_token}` }
            });
        console.log('AzCCOUNTS', result);
        if (result.data._eventsCount === 0 && accounts.length === 0) {
            const newAccount = await axios.post(`${API_URL}/account`, {
                nickname: "Test Account",
                type: "Checking",
                customerID: userDBContext.users[0].customerID,
                authedUsers: [{ id: userDBContext.users[0].id, permissions: ["manage"] }],
                checkSum: 2507
            }, {
                headers: { Authorization: `Bearer ${userDBContext.users[0].access_token}` }
            })
            console.log(newAccount.data.account);
            setAccounts([newAccount.data.account]);
        } else {
            setAccounts(result.data || []);
        }
       
    }
    if (accounts.length === 0) {
        getAccounts();
    }

    console.log(transactions);
   
    const [balance, setBalance] = useState(0);

    const retrieveAccountInfo = async (id) => {
        setAccount(accounts.filter(x => x.id === id)[0]);
        const result = await axios.get(`${API_URL}/transaction/all`, { 
            params: { id },
            headers: {
                Authorization: `Bearer ${userDBContext.users[0].access_token}`
            }
        })
        console.log(result);
        if (result.status === 200) {
            setTransactions(result.data);
            const balance = result.data.reduce((a, b) => {
                if (b.type === "debit") {
                    a -= b;
                } else {
                    a += b;
                }
                return a;
            }, 0) / 100
            setBalance(balance);
        }
    }

 
   
    const pageName = "deposit";
    const { header, card: { cardMsg, balanceMsg }, id, valueIfNotLoggedIn } = languages[language].pages[pageName];
    const { formSubmission, formFields } = languages[language].forms[pageName];
    const content =<div><div className="card-content">{ cardMsg }</div> <div><h4 className="card-balance-msg">{ balanceMsg }{ balance.toFixed(2) }</h4></div></div> ;

    
    const { success, failure } = formSubmission;
    const { successTitle, failureTitle } = languages[language].general;

    
    parseValidation(formFields, validationFunctions);
 
    const submitHelperFunc = (values) => {

            if (loggedInUser === null) {
                displayNotification({ title: failureTitle, type: 'failure', text: failure, time: 5000 });
                return 'failure';
            }
            else {
                let newBalance = balance + parseNumber(values.deposit, 2);
                if (isNaN(newBalance)) {return 'failure'};
                setBalance(newBalance);
                getUser(userDBContext,loggedInUser).balance = newBalance;
                getUser(userDBContext,loggedInUser).transactions.push(
                    {   time: now(), 
                        credit: parseNumber(values.deposit, 2), 
                        debit: null, 
                        description: formSubmission.typeOfAction, 
                        newBalance 
                    })
                displayNotification({ title: successTitle, type: 'success', text: success, time: 5000 });
                return 'success';
            }
    
        }
    formSubmission.submitHelper = submitHelperFunc;

    // Create form component
    const form = formParser(formProvider, formFields, formSubmission);

    return (
        <div>
            {!loggedInUser && <Card id={id} header={header} content={valueIfNotLoggedIn} form={null}></Card>}
            {loggedInUser && !currentAccount? (<Card>
                Please select an account:
                {accounts.map (a => (
                    <div key={a.id} style={{ cursor: "pointer" }} onClick={() => retrieveAccountInfo(a.id)}>{a.nickname}</div>
                ))}
            </Card>
            ):(loggedInUser.id)
            }

            {loggedInUser && currentAccount.id && <Card id={id} header={header} content={content} form={form}>
            </Card>}
            </div>
            )}

export default Deposit;