import * as React from "react";
import { RadioButton } from "primereact/radiobutton";

export const BinarySelect = (props:any) => {
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
        <li className="p-d-flex p-flex-row p-ai-center p-my-3">
          <RadioButton
            className="p-mr-3"
            value={true}
            inputId={`rb-yes-${formItem.uuid}`}
            name={`rb-${formItem.uuid}`}
            onChange={(e) => setRbValue(e.value)}
            checked={rbValue}
          />
          <label htmlFor={`rb-yes-${formItem.uuid}`}>Yes</label>
        </li>
        <li className="p-d-flex p-flex-row p-ai-center p-my-3">
          <RadioButton
            className="p-mr-3"
            value={false}
            inputId={`rb-no-${formItem.uuid}`}
            name={`rb-${formItem.uuid}`}
            onChange={(e) => setRbValue(e.value)}
            checked={rbValue === false}
          />
          <label htmlFor={`rb-no-${formItem.uuid}`}>No</label>
        </li>
      </ul>
      {
        formItem.errorMsg?.map((msg:string) => (
          <small className="p-error block">{msg}</small>
        ))
      }
    </div>
  );
};





