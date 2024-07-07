import React from 'react';
import FormFormik from '../helpers/FormFormik';
import FormReactFinal from '../helpers/FormReactFinal';
import FormReactHook from '../helpers/FormReactHook';

function formParser(formType, fields, submission) {

    let formComponent;

    switch (formType) {

        case 'formik':
            formComponent = <FormFormik 
                        formFields={fields} 
                        formSubmission={submission} >
                    </FormFormik> ;
            break;

        case 'reactFinal':
            formComponent = <FormReactFinal 
                        formFields={fields} 
                        formSubmission={submission}  >
                    </FormReactFinal>;
            break;

        case 'reactHook':
            formComponent = <FormReactHook 
                        formFields={fields} 
                        formSubmission={submission} >
                    </FormReactHook>;
            break;
        
        default:
            formComponent = <FormFormik 
                        formFields={fields} 
                        formSubmission={submission} >
                    </FormFormik>;
    }
    
    return formComponent;
    
}

export default formParser;