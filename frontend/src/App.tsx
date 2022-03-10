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
import Login from "./pages/Login";
import Register from "./pages/Register";
import Projects from "./pages/Projects";


import "./App.css";
import FormBuilder from "./pages/FormBuilder";
import FormViewer from "./pages/FormViewer";
// import { lazyLoadComponent } from "./utils/lazyLoadComponent";

// const { lazy } = React;

// const LoginView = lazy(async () => await import("./pages/Login"));
// const RegisterView = lazy(() => import("./pages/Register"));

const App: React.FunctionComponent = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/projects" element={<Projects/>} />
          <Route path="/project/form-builder/:formId" element={<FormBuilder/>} />
          <Route path="/form/preview/:formId" element={<FormViewer preview={true} />} />
          <Route path="/form/:formId" element={<FormViewer preview={false} />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
