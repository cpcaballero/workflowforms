import * as React from "react";
import useCheckLogin from "../utils/useCheckLogin";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children } : any) => {

  const {user, isLoading } = useCheckLogin();
  return (
      <>
        { isLoading && <p>LOADING</p>}
        {
          !isLoading &&
            (
              (user !== null)
              ? React.cloneElement(children, {user})
              : <Navigate to="/" />
            )
        }
      </>
    );
}
