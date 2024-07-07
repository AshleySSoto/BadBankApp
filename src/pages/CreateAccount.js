import React from 'react';
import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { parseValidation } from '../helpers/library.js';
import validationFunctions from '../helpers/Validation.js';
import formParser from '../helpers/formParser.js';
import { API_URL } from '../helpers/constants.js';
import axios from 'axios';
import Card from '../components/card.js';
import FormContext from '../helpers/FormContext.js';
import LanguageContext from '../helpers/LanguageContext.js';
import NotificationContext from '../helpers/NotificationContext.js';
import UserContext from '../helpers/UserContext.js';
import UserDBContext from '../helpers/UserDBContext.js';
import languages from '../components/languages.js';

function CreateAccount() {

    const [loggedIn, setLoggedIn] = useState(false);
    const { logIn } = useContext(UserContext);
    const { addUser } = useContext(UserDBContext);
    const { form: formProvider } = useContext(FormContext);
    const { language } = useContext(LanguageContext);
    const { displayNotification } = useContext(NotificationContext);

    
    const pageName = 'createAccount';
    const { header, card: {cardMsg}, id } = languages[language].pages[pageName];
    const { formSubmission, formFields } = languages[language].forms[pageName];
    const content = <span className="card-content">{ cardMsg }</span>;

    const { success, failure } = formSubmission;
    const { successTitle, failureTitle } = languages[language].general;

    parseValidation(formFields, validationFunctions);

   
    const submitHelperFunc = async (values) => {

        const user = {
            username: values.name.replaceAll(" ", "").toLowerCase(),
            firstName: values.name.split(" ")[0],
            lastName: values.name.split(" ")[values.name.split(" ").length - 1],
            birthDate: Date.parse("1990-02-01"),
            primaryEmail: 0,
            email: [values.email],
            primaryPhone: 0,
            phone: ["555-555-5555"],
            primaryAddress: 0,
            address: ["123 Fake Lane, Faketown AS 00000"],
            password: values.password,
         };

        let result = await axios.post(`${API_URL}/auth/register`, user);
        console.log(result);

        if (result.status !== 200) { 
            displayNotification({ title: failureTitle, type: 'failure', text: failure, time: 5000 });
            return 'failure'; 
        }
        else {
            console.log(result.data.user);
            addUser(result.data.user);
            logIn(result.data.user.id);
            displayNotification({ title: successTitle, type: 'success', text: success, time: 5000 });
            setLoggedIn(true);
            return 'success';
        }

    }
    formSubmission.submitHelper = submitHelperFunc;

   
    const form = formParser(formProvider, formFields, formSubmission);

    if (loggedIn) {
    return <Redirect to='/' />
    }

    return (
        <Card id={id} header={header} content={content} form={form} style={{ margin: "30px 50px"}}></Card>
    )

}

export default CreateAccount;