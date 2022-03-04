import * as React from "react";
import { InputText } from "primereact/inputtext";

export const ShortText = (props) => {
  const {
    onChangeFn,
    value,
    formItem,
  } = props;
  return (
    <div className="p-d-flex p-flex-column p-col-10">
      <InputText
        className="p-my-2"
        onChange={
          (e) => onChangeFn(e.target.value)
        }
        value={value}
        placeholder={`Your answer ${formItem.required ? '(required)' : ''}`}
      />
      {
        formItem.errorMsg?.map(msg => (
          <small className="p-error block">{msg}</small>
        ))
      }
    </div>
  );
};





