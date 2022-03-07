import * as React from "react";
import { RadioButton } from "primereact/radiobutton";

export const SingleSelect = (props:any) => {
  const {
    onChangeFn,
    value,
    formItem,
  } = props;

  const { useState, useEffect } = React;
  const [ rbValue, setRbValue ] = useState(value);

  useEffect( () => {
    onChangeFn(rbValue);
  }, [rbValue, onChangeFn]);

  return (
    <div className="p-d-flex p-flex-column p-col-10">
      <ul>
        {
          formItem.choices.map((choice:string) => (
            <li className="p-d-flex p-flex-row p-ai-center p-my-3">
              <RadioButton
                className="p-mr-3"
                value={choice}
                inputId={`rb-${choice.split(" ").join("-")}-${formItem.uuid}`}
                name={`rb-${formItem.uuid}`}
                onChange={(e) => setRbValue(e.value)}
                checked={rbValue === choice}
              />
              <label
                htmlFor={`rb-${choice.split(" ").join("-")}-${formItem.uuid}`}
              >
                {choice}
              </label>
            </li>
          ))
        }
      </ul>
      {
        formItem.errorMsg?.map((msg:string) => (
          <small className="p-error block">{msg}</small>
        ))
      }
    </div>
  );
};





