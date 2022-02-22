import * as React from "react";
// import { Card } from "antd";
import { Button }  from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Password } from "primereact/password";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import styles from "./Register.module.css";
import { AUTH_REGISTER_URL } from "../../utils/urls";
import axios from "axios";

const GENDER_CHOICES = [
  { name: "Male", value: "Male" },
  { name: "Female", value: "Female" },
  { name: "Others", value: "Others" },
  { name: "Prefer not to say", value: "Prefer not to say" },

];

export const Register: React.FunctionComponent = () => {

  const {useState} = React;

  const [formData, setFormData] = useState<any>({
    firstName: "",
    middleName: "",
    lastName: "",
    nameSuffix: "",
    birthDate: undefined,
    type: "superadmin",
    gender: "",
    mobileNumber: "",
    emailAddress: "",
    password: "",
    confirmPassword: ""
  });
  const [formError, setFormError] = useState({
    emailAddress: "",
    password: "",
    firstName: "",
    lastName: "",
    birthDate:"",
    gender: "",
    mobileNumber: "",
    confirmPassword: ""
  });
  const {
    emailAddress, 
    password,
    firstName,
    middleName,
    lastName,
    nameSuffix,
    birthDate,
    gender,
    mobileNumber,
    confirmPassword,
  } = formData;

  const isValidForm = () => {
    let errors:any = {
      emailAddress: "",
      password: "",
      firstName: "",
      lastName: "",
      birthDate:"",
      gender: "",
      mobileNumber: "",
      confirmPassword: "",
    };

    let isValidFields = true;
    
    Object.keys(errors).forEach((key:any) => {
      if(!formData[key]){
        
        isValidFields = false;
        errors[key] = "This field is required";
      }
    });

    if(password && 
      confirmPassword && 
      password !== confirmPassword
    ){
      isValidFields = false;
      errors.password = "Passwords do not match";
      errors.confirmPassword = "Passwords do not match";
    }
    
    setFormError(errors);
    // console.log(isValidFields);
    return isValidFields;
  }

  const handleSubmit = async () => {
    try{
      if(isValidForm()){
        await axios.post(
          AUTH_REGISTER_URL,
          formData
        );
      }
    }catch(err: any) {
      let errors:any = {
        emailAddress: "",
        password: "",
        firstName: "",
        lastName: "",
        birthDate:"",
        gender: "",
        mobileNumber: "",
        confirmPassword: "",
      };
      const { message } = err.response.data;
      switch(message){
        case "Email address already in use":
          errors.emailAddress = message;
        break;
        case "User already exists":
          errors.firstName =message;
          errors.lastName = message;
          errors.birthDate = message;
          errors.gender = message;
        break;
      }
      setFormError(errors);
      return err;
    };
    
  };

  const handleOnChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    return setFormData({
      ...formData, 
      [e.target.name]:e.target.value
    });
  };

  const monthNavigatorTemplate = (e:any) => {
    return (
      <Dropdown
        onChange={(event) => e.onChange(event.originalEvent, event.value)}
        options={e.options}
        style={{ lineHeight: 1 }}
        value={e.value}
      />
    );
  };

  const yearNavigatorTemplate = (e:any) => {
    return (
      <Dropdown
        className="p-ml-2"
        onChange={(event) => e.onChange(event.originalEvent, event.value)}
        options={e.options}
        style={{lineHeight: 1}}
        value={e.value}
      />
    );
  };

  React.useEffect( () => {
    // console.log(formData);
  }, [formData]);

  React.useEffect( () => {
    // console.log(formError);
  }, [formError]);

  return(
    <div className={styles.registerWrapper}>
      <Card 
        className={styles.registerBox}
        title={"Register"} 
      >
        <div className="p-fluid">
          <div className="p-field p-grid">
            <label className="p-col-12 p-md-3">
              *First Name
            </label>
            <div className="p-col-12 p-md-9">
              <InputText 
                className={
                  formError.firstName 
                    && "p-invalid"
                }
                name="firstName"
                type="text"
                onChange={handleOnChange}
                value={firstName}
              />
              <small className="p-error">
                {formError.firstName}
              </small>
            </div>
          </div>
          <div className="p-field p-grid">
            <label className="p-col-12 p-md-3">
              Middle Name
            </label>
            <div className="p-col-12 p-md-9">
              <InputText 
                name="middleName"
                type="text"
                onChange={handleOnChange}
                value={middleName}
              />
            </div>
          </div>
          <div className="p-field p-grid">
            <label className="p-col-12 p-md-3">
              *Last Name
            </label>
            <div className="p-col-12 p-md-9">
              <InputText 
                className={
                  formError.lastName 
                    && "p-invalid"
                }
                name="lastName"
                type="text"
                onChange={handleOnChange}
                value={lastName}
              />
              <small className="p-error">
                {formError.lastName}
              </small>
            </div>
          </div>
          <div className="p-field p-grid">
            <label className="p-col-12 p-md-3">
              Name Suffix
            </label>
            <div className="p-col-12 p-md-3">
              <InputText 
                name="nameSuffix"
                type="text"
                onChange={handleOnChange}
                value={nameSuffix}
              />
            </div>
          </div>
          <div className="p-field p-grid">
            <label className="p-col-12 p-md-3">
              Gender
            </label>
            <div className="p-col-12 p-md-6">
              <Dropdown 
                className={
                  "p-col-12 p-md-9 " + 
                  (formError.gender 
                    && "p-invalid")
                }
                name="gender"
                onChange={(e) => setFormData({
                  ...formData, 
                  gender : e.value
                })}
                options={GENDER_CHOICES} 
                optionLabel="name"
                optionValue="value"
                value={gender}
              />
              <small className="p-error">
                {formError.gender}
              </small>
            </div>
          </div>
          <div className="p-field p-grid">
            <label className="p-col-12 p-md-3">
              Birth Date
            </label>
            <div className="p-col-12 p-md-6">
              <Calendar 
                className={
                  formError.birthDate 
                    && "p-invalid"
                }
                monthNavigatorTemplate={monthNavigatorTemplate}
                name="birthDate"
                onChange={(e) => setFormData(
                  {
                    ...formData,
                    birthDate: e.value
                  }
                )}
                value={birthDate}
                yearNavigatorTemplate={yearNavigatorTemplate}
                yearRange="1900:2020"
                monthNavigator
                showIcon
                yearNavigator
              />
              <small className="p-error">
                {formError.birthDate}
              </small>
            </div>
          </div>
          <div className="p-field p-grid">
            <label className="p-col-12 p-md-3">
              *Mobile Number
            </label>
            <div className="p-col-12 p-md-9">
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  +63
                </span>
                <InputMask 
                  className={
                    formError.mobileNumber 
                      && "p-invalid"
                  }
                  mask="999-999-9999"
                  onChange={(e) => setFormData({
                    ...formData,
                    mobileNumber: e.value
                  })}
                  placeholder="999-999-9999"
                  name="mobileNumber"
                  type="text"
                  value={mobileNumber}
                />
              </div>
              <small className="p-error">
                {formError.mobileNumber}
              </small>
            </div>
          </div>
          <div className="p-field p-grid">
            <label className="p-col-12 p-md-3">
              *Email Address
            </label>
            <div className="p-col-12 p-md-9">
              <InputText 
                className={
                  formError.emailAddress 
                    && "p-invalid"
                }
                name="emailAddress"
                type="text"
                onChange={handleOnChange}
                value={emailAddress}
              />
              <small className="p-error">
                {formError.emailAddress}
              </small>
            </div>
          </div>
          <div className="p-field p-grid">
            <label className="p-col-12 p-md-3">
              *Password
            </label>
            <div className="p-col-12 p-md-9">
              <Password 
                className={
                  formError.password 
                    && "p-invalid"
                }
                feedback={true}
                name="password"
                onChange={handleOnChange}
                toggleMask={true}
                value={password}
              />
              <small className="p-error">
              {formError.password}
              </small>
            </div>
          </div>
          <div className="p-field p-grid">
            <label className="p-col-12 p-md-3">
              *Confirm Password
            </label>
            <div className="p-col-12 p-md-9">
              <Password 
                className={
                  formError.password 
                    && "p-invalid"
                }
                feedback={true}
                name="confirmPassword"
                toggleMask={true}
                onChange={handleOnChange}
                value={confirmPassword}
              />
              <small className="p-error">
                {formError.password}
              </small>
            </div>
          </div>
        </div>
        <div className="p-d-flex p-jc-center">
          <Button 
            className="p-px-6" 
            label="Submit" 
            onClick={handleSubmit} 
          />
        </div>
      </Card>
    </div>
  );
}
