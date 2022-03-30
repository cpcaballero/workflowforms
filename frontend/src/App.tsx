import * as React from "react";

import "primereact/resources/themes/nova/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import "primeflex/primeflex.css"
import {
  Routes,
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Projects from "./pages/Projects";
import FormBuilder from "./pages/FormBuilder";
import FormViewer from "./pages/FormViewer";

import "./App.css";

// import { lazyLoadComponent } from "./utils/lazyLoadComponent";

// const { lazy } = React;

// const LoginView = lazy(async () => await import("./pages/Login"));
// const RegisterView = lazy(() => import("./pages/Register"));

const App: React.FunctionComponent = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Login/>}
          />
          <Route
            path="/register"
            element={<Register/>}
          />
          <Route
            path="/projects"
            element={
              <PrivateRoute>
                <Projects user={null} />
              </PrivateRoute>
            }
          />
          <Route
            path="/project/form-builder/:formId"
            element={
              <PrivateRoute>
                <FormBuilder user={null}  />
              </PrivateRoute>
            }
          />
          {/* Preview only but cannot be edited (because there are entries already) */}
          <Route
            path="/form/preview/:formId"
            element={
              <PrivateRoute>
                <FormViewer
                  user={null}
                  preview={true}
                  editable={false}
                />
              </PrivateRoute>
            }
          />
          {/* Preview and can be edited because there are NO ENTRIES YET */}
          <Route
            path="/form/view/:formId"
            element={
              <PrivateRoute>
                <FormViewer
                  user={null}
                  preview={true}
                  editable={true}
                />
              </PrivateRoute>
            }
          />
          {/* Actual form for respondents */}
          <Route
            path="/form/:formId"
            element={
              <FormViewer
                preview={false}
                editable={false}
              />
            }
          />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
