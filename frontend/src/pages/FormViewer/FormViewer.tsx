import * as React from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { useNavigate, useParams } from "react-router-dom";
import useCheckLogin from "../../utils/useCheckLogin";

import styles from "./FormViewer.module.css";

import {
  CLOUDINARY_URL,
  DEV_BASEPATH,
  FORM_GET_URL,
  FORM_SAVE_ANSWER_URL,
  PROJECT_FORM_BUILDER_URL,
} from "../../utils/constants";

import axios from "axios";

import {
  ShortText,
  LongText,
  BinarySelect,
  SingleSelect,
  MultipleSelect,
  FileUploader,
  DateInput,
  FreeText
} from "../../components";
interface iFormItem {
  text: string,
  subtext?: string,
  schema: string,
  choices: string[],
  required: boolean,
  uuid: string,
  acceptTypes: string[],
  errorMsg : string[],
  _id? : string
}
interface iFormStructure {
  formTitle: string,
  formSubtitle: string,
  formItems: iFormItem[],
  isPublished: boolean,
  dateCreated: Date | undefined,
  dateUpdated: Date | undefined,
  createdBy: string,
}
interface iFormAnswer {
  uuid: string,
  value?: any
}

export const FormViewer: React.FunctionComponent<{
  preview: boolean,
  editable: boolean,
  user?: any
}> = (props) => {
  const {
    preview,
    editable,
  } = props;
  // const user = useCheckLogin();
  const { formId } = useParams();
  const navigate = useNavigate();
  const { useState, useEffect, useMemo, useRef, useCallback } = React;
  const [ showFinishDialog, setFinishDialog ] = useState<boolean>(false);
  const [ isEditable, setEditable ] = useState<boolean>();
  const [profile, setProfile] = useState<any>();
  const [ isFormPublished, setFormPublished ] = useState<boolean>();
  const toastRef = useRef<null | Toast>(null);
  const [ formStructure, setFormStructure ] = useState<iFormStructure>({
    formTitle: "",
    formSubtitle: "",
    formItems: [],
    isPublished: false,
    createdBy: "",
    dateCreated: undefined,
    dateUpdated: undefined
  });
  const [ formAnswers, setFormAnswers ] = useState<iFormAnswer[]>([]);

  useEffect(() => {
    const getForm = async () => {
      try{
        const { data } = await axios.get(`${DEV_BASEPATH}${FORM_GET_URL}/${formId}`);
        setFormPublished(
          data.form.isPublished === "Yes"
        );
        setFormStructure(data.form);
        setEditable(
          editable && (
            data.form?.formEntries?.length === 0)
        );
      } catch(err:any){
        console.log(err);
      }
    };
    getForm();
  }, [formId, editable]);

  useEffect(() => {
    console.log("initial useeffect called");
    if (formAnswers.length === 0) {
      setFormAnswers(
        formStructure.formItems.map(
          (formItem:iFormItem) => ({
            uuid: formItem.uuid,
            value : formItem.schema === "string"
              ? ""
              : undefined
          })
        )
      );
    }
  }, [formStructure, formAnswers.length]);


  const saveAnswer = useCallback((index:number, value:any) => {
    console.log("saveanswer called");
    setFormAnswers((prevState) => {
      if (prevState[index]) {
        prevState[index].value = value;
      }
      return prevState;
    });
  }, []);


  const formHeader = (
    options: any,
    itemNumber: number,
    uuid: string,
    text: string,

    required: boolean,
    subtext?: string,
  ) => {
    const className = `${options.className} p-d-flex p-jc-between`;
    const titleClassName = `${options.titleClassName}`;
    return (
      <div className={className}>
        <span className={titleClassName}>
          <div className="p-d-flex p-flex-row p-ai-center">
            <span className="p-mr-3">#{itemNumber}:</span>
            <span className="p-d-flex p-flex-column">
              <span>
                <span className={styles.requiredAsterisk}>
                  { required ? "*" : "" }
                </span>
                {text}
              </span>
              {
                subtext &&
                <small className="p-mt-3">
                  {subtext}
                </small>
              }
            </span>
          </div>
        </span>
      </div>
    );
  }

  const ItemWrapper = useCallback((props: any) => {
    const {formItem, index} = props;
    return(
      <Panel
        key={"panel-" + formItem.uuid}
        className={
          "p-my-3 " +
          ((
            formItem.errorMsg &&
            formItem.errorMsg.length > 0
          ) && styles.invalidPanel)
        }
        headerTemplate={
          (options) => formHeader(
            options,
            index,
            formItem.uuid,
            formItem.text,
            formItem.required,
            formItem.subtext,
          )
        }
      >
        {props.children}
      </Panel>
    );
  }, []);

  const formItems = useMemo(() => {
    console.log("renderfield rerender");
    const { formItems } = formStructure;
    console.log(formItems);
    let itemNumber = 0;
    return formItems?.map(
      (formItem, index) => {
        switch (formItem.schema) {
          case "TEXT":
            itemNumber = itemNumber + 1;
            return (
              <ItemWrapper
                index={itemNumber}
                formItem={formItem}
              >
                <ShortText
                  onChangeFn={(value:any) => saveAnswer(index, value)}
                  formItem={formItem}
                  value={formAnswers[index]?.value}
                />
              </ItemWrapper>
            );
          case "LONG_TEXT":
            itemNumber = itemNumber + 1;
            return (
              <ItemWrapper
                index={itemNumber}
                formItem={formItem}
              >
                <LongText
                  onChangeFn={(value:any) => saveAnswer(index, value)}
                  formItem={formItem}
                  value={formAnswers[index]?.value}
                />
              </ItemWrapper>
            );
          case "YES_NO":
            itemNumber = itemNumber + 1;
            return (
              <ItemWrapper
                index={itemNumber}
                formItem={formItem}
              >
                <BinarySelect
                  onChangeFn={(value:any) => saveAnswer(index, value)}
                  formItem={formItem}
                  value={formAnswers[index]?.value}
                />
              </ItemWrapper>
            );
          case "SINGLE_SELECT":
            itemNumber = itemNumber + 1;
            return (
              <ItemWrapper
                index={itemNumber}
                formItem={formItem}
              >
                <SingleSelect
                  onChangeFn={(value:any) => saveAnswer(index, value)}
                  formItem={formItem}
                  value={formAnswers[index]?.value}
                />
              </ItemWrapper>
            );
          case "MULTIPLE_SELECT":
            itemNumber = itemNumber + 1;
            return (
              <ItemWrapper
                index={itemNumber}
                formItem={formItem}
              >
                <MultipleSelect
                  onChangeFn={(value:any) => saveAnswer(index, value)}
                  formItem={formItem}
                  value={formAnswers[index]?.value}
                />
              </ItemWrapper>
            );
          case "DATE":
            itemNumber = itemNumber + 1;
            return (
              <ItemWrapper
                index={itemNumber}
                formItem={formItem}
              >
                <DateInput
                  onChangeFn={(value:any) => saveAnswer(index, value)}
                  formItem={formItem}
                  value={formAnswers[index]?.value}
                />
              </ItemWrapper>
            );
          case "FILE":
            itemNumber = itemNumber + 1;
            return (
              <ItemWrapper
                index={itemNumber}
                formItem={formItem}
              >
                <FileUploader
                  onChangeFn={(value:any) => saveAnswer(index, value)}
                  formItem={formItem}
                  value={formAnswers[index]?.value}
                />
              </ItemWrapper>
            );
          case "FREE_TEXT":
              return (
                <FreeText
                  value={formItem.text}
                />
              )
        }
      }
    );
  }, [formAnswers, saveAnswer, formStructure, ItemWrapper]);


  const uploadFiles = async () => {
    const fileUploadQueue = formAnswers.filter(
      (
        answer:iFormAnswer,
        index:number
      ) => {
        if (formStructure.formItems[index].schema === "FILE") {
          return answer;
        }
      }
    );
    const uploadResult = await Promise.all(
      fileUploadQueue.map(
        async(formAnswer:iFormAnswer) => {
          const formData = new FormData();
          formData.append("file", formAnswer.value);
          formData.append("upload_preset", "workflowformupload");
          const uploadResponse = await fetch(
            CLOUDINARY_URL,
            {
              method: "POST",
              body: formData
            }
          );
          const responseData = await uploadResponse.json();
          return {
            responseStatus: uploadResponse.status,
            responseStatusText: uploadResponse.statusText,
            responseData: responseData,
            uuid: formAnswer.uuid
          }
        }
      )
    );
    console.log(uploadResult);
    return uploadResult;
  };

  const validateRequiredFields = () => {
    const currentFormItems = [...formStructure.formItems];
    let isError = false;
    formAnswers.forEach(answer => {
      const currentFormItemIndex = currentFormItems.findIndex(item => item.uuid === answer.uuid);
      if (currentFormItems[currentFormItemIndex].required) {
        currentFormItems[currentFormItemIndex].errorMsg = [];
        if (
          answer.value === undefined ||
          answer.value === ""
        ) {
          isError = true;
          currentFormItems[currentFormItemIndex].errorMsg.push("This field is required");
        }
      }
    });
    setFormStructure({
      ...formStructure,
      formItems: currentFormItems
    });
    return isError;
  }

  const updateFormValuesFromUploads = async (currentFormItems:iFormItem[]) => {
    const uploadResult = await uploadFiles();
    const filteredUuid = uploadResult.map(result => result.uuid);
    let isError = false;

    const updatedFormAnswers = formAnswers.map(answer => {
      const currentFormItemIndex = currentFormItems.findIndex(
        item => item.uuid === answer.uuid
      );
      if (filteredUuid.includes(answer.uuid)) {
        const uploadData = uploadResult.find(result => result.uuid === answer.uuid);
        if (uploadData && uploadData.responseStatus === 200) {
          answer.value = uploadData.responseData.secure_url;
          currentFormItems[currentFormItemIndex].errorMsg = [];
        } else {
          isError = true;
          currentFormItems[currentFormItemIndex].errorMsg?.push("Upload failed.");
        }
      }
      return answer;
    });
    setFormAnswers(updatedFormAnswers);
    setFormStructure({
      ...formStructure,
      formItems: currentFormItems
    });
    return isError;
  }

  const onSaveForm = async() => {
    const hasEmptyRequiredFields = validateRequiredFields();
    if (hasEmptyRequiredFields) {
      toastRef?.current?.show({
        severity: "error",
        summary: "Form Submission Failed",
        detail: "Please check fields and notes highlighted in red.",
        life: 5000
      });
      return;
    }
    const hasErrors = await updateFormValuesFromUploads([...formStructure.formItems]);
    if (hasErrors) {
      toastRef?.current?.show({
        severity: "error",
        summary: "Form Submission Failed",
        detail: "Please check fields and notes highlighted in red.",
        life: 5000
      });
      return;
    }
    try {
      let finalAnswers = formAnswers.map(
        (formAnswer, index) => {
          let formItemObjId = formStructure.formItems.find(
            item => item.uuid === formAnswer.uuid
          )?._id;
          return {
            formItem: formItemObjId,
            answer: formAnswer.value,
            lastUpdated: new Date(),
          }
        }
      );
      const saveAnswerResponse = await axios.post(
        `${DEV_BASEPATH}${FORM_SAVE_ANSWER_URL}/${formId}`,
        {
          answers: finalAnswers
        }
      );

      if (
          saveAnswerResponse.data.success
          && saveAnswerResponse.data.newEntry
        ) {
        setFinishDialog(true);
      }
    } catch (err:any) {
      console.log(err);
    }
  }

  const navigateToFormBuilder = () => {
    navigate(`${PROJECT_FORM_BUILDER_URL}/${formId}`);
  }


  return (
    <div className={"p-pt-6 p-px-6"}>
      {
        preview || isFormPublished
          ? (
            <>
              <div className="p-d-flex p-flex-column p-jc-start">
                <div
                  className={
                    "p-d-flex p-flex-row p-jc-between p-grid "
                    + (
                        showFinishDialog
                          ? styles.bringToBackHeader
                          : styles.stickyHeader
                      )
                  }
                >
                  <div className="p-d-flex p-flex-column p-col p-sm-10 p-md-8 p-lg-6">
                    <div className="p-d-flex p-flex-row p-ai-center p-jc-start">
                      <h1 className="p-mb-0 p-mr-2">{formStructure.formTitle}</h1>
                      {
                        preview && (
                          <h3 className="p-mb-0 p-mr-2">(Preview Only)</h3>
                        )
                      }
                    </div>
                  </div>
                  <div className="p-d-flex p-ai-center">
                    {
                      preview && (
                      <Button
                        className="p-mx-2"
                        label="Close this tab"
                        onClick={() => window.close()}
                      />)
                    }
                    {
                      !preview && (
                      <Button
                        className="p-button-success p-mx-2"
                        label="Submit Form"
                        onClick={onSaveForm}
                        disabled={showFinishDialog}
                      />)
                    }
                    {
                      editable &&  (
                        <Button
                        className="p-button-success p-mx-2"
                        label="Edit form"
                        onClick={navigateToFormBuilder}
                        disabled={!isEditable}
                        tooltipOptions={{
                          position: "top",
                          showOnDisabled: true
                        }}
                        tooltip={!isEditable ? "Cannot edit forms with respondents already" : undefined}
                      />)
                    }
                  </div>
                  <Toast ref={toastRef} />
                </div>
                <div className="p-d-flex p-col-10 p-flex-column p-ac-stretch p-mt-3">
                  <h3 className="p-mb-0 p-mr-2">{formStructure.formSubtitle}</h3>
                </div>
                <Divider />
                <h2>Items/Questions:</h2>
                <Button label="check" onClick={() => console.log(formAnswers)} />
                  <div className="p-sm-12 p-md-8 p-as-center p-mb-5">
                    <Divider />
                    { formItems }
                  </div>
              </div>
              <Dialog
                header="Form Submitted"
                visible={showFinishDialog}
                style={{width: "30vw"}}
                onHide={ () => setFinishDialog(false) }
                closable={false}
                closeOnEscape={false}
                draggable={false}
                resizable={false}
                showHeader={true}
                blockScroll={true}
                footer={
                  <Button
                    label="Close this tab"
                    onClick={() => window.close()}
                  />
                }
              >
                Thank you for finishing the form.
                Our back-office will reach out to you regarding your answers as soon as possible.
                You may now close this tab.
              </Dialog>
            </>
          )
          : (
            <p>Form not found</p>
          )
      }

    </div>
  );
}
