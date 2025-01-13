import React from "react";
import './ReusableComponents.css'

const InputField = ({ type, value, placeholder, onChange }) => {
    return (
        <>
            <input className="input-group"
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={onChange} />
            <br />
        </>
    )
}

export default InputField;

