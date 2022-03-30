import * as React from "react";
import axios from "axios";
import { AUTH_LOAD_USER_URL } from "./constants";
import setAuthToken from "./setAuthToken";

const useCheckLogin = () => {
  const { useState, useEffect } = React;
  const [ loggedUser, setUser ] = useState(null);
  const [ isRequestSent, setRequestSent ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect( () => {
    if(isRequestSent) return;
    const getAuthUser = async() => {
      setAuthToken(localStorage.token);
      try{
        const response = await axios.get(AUTH_LOAD_USER_URL);
        if (response.data.user) {
          const { user } = response.data;
          setUser(user);
          setRequestSent(true);
          setIsLoading(false);
        }
      } catch(err:any){
        console.log(err);
        setUser(null);
      }
    };
    if(!isRequestSent) {
      getAuthUser();
    }
  }, [isRequestSent]);


  // console.log("value before returning checkLogin");
  // console.log(userData);
  return { user: loggedUser, isLoading: isLoading};
}

export default useCheckLogin;
