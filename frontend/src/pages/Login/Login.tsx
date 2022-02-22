import * as React from "react";
// import { Card } from "antd";
import { Button }  from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import styles from "./Login.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import setAuthToken from "../../utils/setAuthToken";
import { AUTH_LOGIN_URL, AUTH_LOAD_USER_URL } from "../../utils/urls";

export const Login: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const {useState, useEffect} = React;
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [formError, setFormError] = useState({
    username: "",
    password: "",
    form: ""
  });
  const {username, password} = formData;

  const isValidForm = () => {
    let errors = {
      username: "",
      password: "",
      form: ""
    };
    let isValidFields = true;
    if(username === ""){
      errors.username = "Username is required";
      isValidFields = false;
    }
    if(password === ""){
      errors.password = "Password is required";
      isValidFields = false;
      
    }
    setFormError(errors);
    return isValidFields;
  }

  const handleSubmit = async() => {
    try{
        if(isValidForm()){
        const { data } = await axios.post(
          AUTH_LOGIN_URL,
          formData
        );
        localStorage.setItem("token", data.token);
        navigate("/projects");
      }
    } catch(err:any){
      const { message } = err.response.data;
      setFormError({
        ...formError, 
        form: message
      });
    };
  };

  const handleOnChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    return setFormData({
      ...formData, 
      [e.target.name]:e.target.value
    });
  };

  useEffect(() => {
    const checkLogin = async() => {
      console.log(localStorage.token);
      if(localStorage.token){
        setAuthToken(localStorage.token);
        try{
          const response = await axios.get(AUTH_LOAD_USER_URL);
          console.log(response);
          if(response.data.user){
            navigate("/projects");
          }
        } catch(err:any){
          console.log(err);
        }
      }
    }
    checkLogin();
  }, [navigate]);

  return(
    <div className={styles.loginWrapper}>
      <Card 
        className={styles.loginBox}
        title={"Login"} 
        >
        <div className="p-fluid">
          <div className="p-field p-grid" >
              <label className="p-col-12 p-md-3">
                *Username
              </label>
              <div className="p-col-12 p-md-9">
                <InputText 
                  className={
                    formError.username 
                      && "p-invalid"
                  }
                  name="username"
                  type="text"
                  onChange={handleOnChange}
                  value={username}
                />
                <small className="p-error">
                  {formError.username}
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
                  feedback={false}
                  name="password"
                  toggleMask={true}
                  onChange={handleOnChange}
                  value={password}
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
