
import { useContext } from 'react';
import axios from 'axios';
import { parseValidation } from '../helpers/library.js';
import validationFunctions from '../helpers/Validation.js';
import FormContext from '../helpers/FormContext.js';
import LanguageContext from '../helpers/LanguageContext.js';
import NotificationContext from '../helpers/NotificationContext.js';
import UserContext from '../helpers/UserContext.js';
import UserDBContext from '../helpers/UserDBContext.js';
import languages from '../components/languages.js';
import { API_URL } from '../helpers/constants.js';



export function SignIn() {

        // Get user database, logged in user, form preference, and language
        const { addUser } = useContext(UserDBContext);
        const { logIn } = useContext(UserContext);
        const { form: formProvider } = useContext(FormContext);
        const { language } = useContext(LanguageContext);
        const { displayNotification } = useContext(NotificationContext);
    
        // Load page content
        const { formSubmission, formFields } = languages[language].forms['signIn'];
        const content = null;
     
        const { success, failure } = formSubmission;
        const { successTitle, failureTitle } = languages[language].general;

        // Parse validation functions
        parseValidation(formFields, validationFunctions);
    
        // Add submission instructions
        const submitHelperFunc = async (values) => {
    
            const user = {
                username: values.username,
                password: values.password,
             };
    
            let result;
            try {
                result = await axios.post(`${API_URL}/auth/login`, { ...user });
            } catch (e) {
                console.log(e);
            }
            console.log("RESULT", result);
            if (result.status !== 200) { 
                displayNotification({ title: failureTitle, type: 'failure', text: failure, time: 5000 });
                return 'failure'; }
            else {
                let matchingUser = result.data.value;
                matchingUser.access_token = result.data.access_token;
                matchingUser.refresh_token = result.data.refresh_token;
                addUser(matchingUser);
                logIn(matchingUser.id);
                displayNotification({ title: successTitle, type: 'success', text: success, time: 5000 });
                return 'success';
            }
    
        }
        formSubmission.submitHelper = submitHelperFunc;
    
    }
    export default SignIn;