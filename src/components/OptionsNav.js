import React from 'react';
import '../components/OptionsNav.css';
import { useContext } from 'react';
import FormContext from '../helpers/FormContext';

function OptionsNav() {

  const { form, setNewForm } = useContext(FormContext);

  const handleChange = (e) => {
    let selectedValue = e.target.value;
    if (form !== selectedValue) { setNewForm(selectedValue) }
  }

    return (
      <div className="black-ribbon">
        <div className="option-nav-element">
          <div style={{display: "flex", alignItems:"center"}}>
            <div className="left-caret"></div><div><a className="option-link" href="https://github.com/AshleySSoto.io">Return to AshleySSoto</a></div>
          </div>
        </div>
        <div className="option-nav-element hideable" style={{flexShrink:1, flexGrow: 1, width: '100%', border:'1px solid transparent'}}></div>
        <div className="option-nav-element form-provider-toggle right-justify" style={{zIndex: '99999'}}>
          <div style={{whiteSpace: "nowrap", fontSize: "0.8rem", padding: '5px', fontWeight: 'bold'}}>Form library: </div>
            <select id="form-select" className="form-select" onChange={handleChange}  data-for="form-toggle-tip"  data-iscapture="true" data-tip="Select form library. (Resets any in-progress form.)">
              <option value="formik">Formik</option>
              <option value="reactHook">React Hook Form</option>
              <option value="reactFinal">React Final Form</option>
            </select>
        
        </div>
      </div>
    )
}
export default OptionsNav