import * as React from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";

export const DateInput = (props:any) => {
  const {
    onChangeFn,
    value,
    formItem,
  } = props;

  const { useState, useEffect } = React;
  const [ dateValue, setDateValue ] = useState<Date | Date[] | null | undefined>(value);

  const updateValues = ( value:Date | Date[] | null | undefined ) => {
    setDateValue(value);
  }

  const monthNavigatorTemplate = (e: any) => {
    return (
      <Dropdown
        value={e.value}
        options={e.options}
        onChange={(event) =>
          e.onChange(
            event.originalEvent,
            event.value
          )
        }
        style={{ lineHeight: 1 }}
      />
    );
  };

  const yearNavigatorTemplate = (e: any) => {
    return (
      <Dropdown
        value={e.value}
        options={e.options}
        onChange={(event) =>
          e.onChange(
            event.originalEvent,
            event.value
          )
        }
        className="ml-2"
        style={{ lineHeight: 1 }}
      />
    );
  };

  useEffect( () => {
    onChangeFn(dateValue);
  }, [dateValue, onChangeFn]);

  return (
    <div className="p-d-flex p-flex-column p-sm-12 p-md-8 p-lg-6">
      <Calendar
        id="icon"
        showIcon
        showButtonBar
        mask="99/99/9999"
        value={value}
        monthNavigator
        yearNavigator
        yearRange="1930:2023"
        monthNavigatorTemplate={monthNavigatorTemplate}
        yearNavigatorTemplate={yearNavigatorTemplate}
        onChange={(e) => updateValues(e.target.value)}
        placeholder={`Your answer ${formItem.required ? '(required)' : ''}`}
      />
      {
        formItem.errorMsg?.map((msg:string) => (
          <small className="p-error block">{msg}</small>
        ))
      }
    </div>
  );
};





