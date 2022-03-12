import * as React from "react";
import axios from "axios";
import { AUTH_LOAD_USER_URL } from "./constants";
import setAuthToken from "./setAuthToken";
import { useNavigate } from "react-router-dom";

const useCheckLogin = () => {
  const { useState, useEffect } = React;
  const navigate = useNavigate();
  const [user, setUser] = useState();

  useEffect( () => {
    const getAuthUser = async() => {
      console.log("useCheckLogin called");
      setAuthToken(localStorage.token);
      try{
        const response = await axios.get(AUTH_LOAD_USER_URL);
        if(response.data.user){
          const { user } = response.data;
          setUser(user);
        }
      } catch(err:any){
        navigate("/");
      }
    }
    getAuthUser();
  }, [navigate]);

  return user;
}

export default useCheckLogin;
