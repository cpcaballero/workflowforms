import * as React from "react";
import { Checkbox } from "primereact/checkbox";

export const MultipleSelect = (props:any) => {
  const {
    onChangeFn,
    value,
    formItem,
  } = props;

  const { useState, useEffect } = React;
  const [ cbValue, setCbValue ] = useState<string[]>(value === undefined ? [] : value);

  const updateValues = ( isChecked: boolean, choice: string ) => {
    let cbList = [...cbValue];
    if ( !isChecked ) {
      cbList.splice(cbList.indexOf(choice), 1);
    } else {
      cbList.push(choice);
    }
    setCbValue(Array.from(new Set(cbList) ) );
  }

  useEffect( () => {
    if (cbValue.length === 0) {
      onChangeFn(undefined);
    } else {
      onChangeFn(cbValue);
    }
  }, [cbValue, onChangeFn]);

  return (
    <div className="p-d-flex p-flex-column p-col-10">
      <ul>
        {
          formItem.choices.map((choice:string) => (
            <li
              className="p-d-flex p-flex-row p-ai-center p-my-3"
              key={`cb-${choice.split(" ").join("-")}-${formItem.uuid}`}
            >
              <Checkbox
                className="p-mr-3"
                value={choice}
                inputId={`cb-${choice.split(" ").join("-")}-${formItem.uuid}`}
                name={`cb-${formItem.uuid}`}
                onChange={(e) => updateValues(e.checked, choice)}
                checked={cbValue?.includes(choice)}
              />
              <label
                htmlFor={`cb-${choice.split(" ").join("-")}-${formItem.uuid}`}
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





