import * as React from "react";
// import { Card } from "antd";
import { Button }  from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import styles from "./Projects.module.css";
import { PROJECT_CREATE_URL } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

import useCheckLogin from "../../utils/useCheckLogin";

import axios from "axios";


interface iFormData {
  projectName: string,
  stages: string[],
  user: any
}

export const Projects: React.FunctionComponent = () => {
  const user = useCheckLogin();
  const navigate = useNavigate();
  const {useState, useEffect, useRef} = React;
  const addStageTextRef = useRef<any>(null);
  const [formData, setFormData] = useState<iFormData>({
    projectName: "",
    stages: [],
    user: undefined
  });
  const [profile, setProfile] = useState<any>();
  const [formError, setFormError] = useState({
    projectName: "",
    stages: "",
  });
  const [isCreateProjectModal, setCreateProjectModal] = useState<boolean>(false);
  const {projectName} = formData;
  const [newStage, setNewStage] = useState<string>("");
  const [draftStages, setDraftStages] = useState<string[]>([]);
  // const validateForm = () => {
  //   let errors = {
  //     username: "",
  //     password: ""
  //   };
  //   let hasError = false;
  //   if(username === ""){
  //     errors.username = "Username is required";
  //     hasError = true;
  //   }
  //   if(password === ""){
  //     errors.password = "Password is required";
  //     hasError = true;
  //   }
  //   setFormError(errors);
  //   return hasError;
  // }

  // const handleSubmit = async() => {
  //   if(!validateForm()){
  //     await axios.post(
  //       AUTH_LOGIN_URL,
  //       formData
  //     );
  //   }
  // };

  const handleOnChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    return setFormData({
      ...formData,
      [e.target.name]:e.target.value
    });
  };

  const addStage = () => {
    const similarStages = draftStages.filter(stage => {
      return stage.toLowerCase() === newStage.toLowerCase().trim();
    });
    if(similarStages.length === 0) {
      setDraftStages([...draftStages, newStage]);
    }
  }

  const createProject = async () => {
    try{
        const project = await axios.post(
          PROJECT_CREATE_URL,
          {...formData, stages: draftStages}
        );
        navigate(`/project/form-builder/${project.data.project.formId}`);
    }catch(err:any){

    }
  }

  const newProjectDialogFooter = (
    <div className="p-d-flex p-jc-end">
      <Button
        className="p-button-success"
        label="Create"
        disabled={(
          draftStages.length === 0 || projectName === ""
        )}
        onClick={createProject}

      />
    </div>
  );

  const removeStage = (index:number) => {
    setDraftStages((prevStages) => {
      return prevStages.filter(
        (prevStage, prevIndex) => prevIndex !== index);
    });
  }

  useEffect( () => {
    setNewStage("");
    addStageTextRef?.current?.focus();
  }, [draftStages]);

  useEffect( () => {
    if(user !== undefined){
      setProfile(user);
    }
  }, [user]);

  useEffect( () => {
    setFormData(
      (prevState) => ({
        ...prevState,
        user:profile
      })
    );
  }, [profile]);


  return(
    <div className={styles.loginWrapper + " p-pt-6 p-px-6"}>
      <div className="p-d-flex p-jc-start p-ai-start">
        <h1>Projects</h1>
        <Button
          label="Create"
          className="p-ml-5"
          onClick={() => setCreateProjectModal(true)}
        />
      </div>
      <Dialog
        draggable={false}
        footer={newProjectDialogFooter}
        header="Create New Project"
        visible={isCreateProjectModal}
        onHide={() => setCreateProjectModal(false)}
        style={{width: "50vw"}}
      >
        <div className="p-field p-grid">
          <label
            className="p-d-flex p-flex-column p-ai-start p-jc-center"
            style={{marginBottom: "0px"}}
          >
            <h3 style={{marginBottom: "0px"}}>
              <span className={styles.requiredAsterisk}>*</span>
              Project Name:
            </h3>
          </label>
          <div className="p-col-12 p-md-9">
            <InputText
              className={
                formError.projectName
                  && "p-invalid"
              }
              style={{
                width: "100%"
              }}
              name="projectName"
              type="text"
              onChange={handleOnChange}
              value={projectName}
            />
            <small className="p-error">
              {formError.projectName}
            </small>
          </div>
        </div>
        <h3>
          <span className={styles.requiredAsterisk}>*</span>
          Stages:
        </h3>
        <div className="p-d-flex p-ai-center p-flex-column">
          <Card className={"p-my-2 p-py-0 p-col-11 " + styles.defaultStages }>
            <div className="p-d-flex p-flex-row p-jc-between p-ai-center">
              <span>
                <h3 className={styles.defaultStages}>Data Encoded</h3>
                <small>This first stage is default for newly entered form entries by respondents.</small>
              </span>
              <i className={"pi pi-list " + styles.defaultStageIcon}></i>
            </div>
          </Card>
          {
            draftStages.map((stage, index) => (
              <Card className="p-my-2 p-py-0 p-col-11">
                <div className="p-d-flex p-flex-row p-jc-between">
                  <span>
                    <h3>Stage {(index+1) + ". " + stage}</h3>
                  </span>
                  <Button
                    className="p-button-danger pi pi-trash"
                    onClick={() => removeStage(index)}
                  />
                </div>

              </Card>
            ))
          }
          <Card className="p-my-2 p-py-0 p-col-11">
            <h4>Add New Stage:</h4>
            <div className="p-d-flex p-jc-start">
              <InputText
                style={{flex: "1"}}
                ref={addStageTextRef}
                value={newStage}
                onChange={
                  (e) => setNewStage(e.target.value)
                }
              />
              <Button
                label="Add"
                onClick={addStage}
                disabled={newStage.trim() === ""}
              />
            </div>

          </Card>
          <Card className={"p-my-2 p-py-0 p-col-11 " + styles.defaultStages}>
            <div className="p-d-flex p-flex-row p-jc-between p-ai-center">
              <span>
                <h3 className={styles.defaultStages}>Completed</h3>
                <small>This last stage is default for completely processed form entries.</small>
              </span>
              <i className={"pi pi-check " + styles.defaultStageIcon}></i>
            </div>
          </Card>
        </div>


      </Dialog>
    </div>
  );
}
