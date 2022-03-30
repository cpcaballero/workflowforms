import * as React from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from 'primereact/divider';
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown';
import { Panel } from 'primereact/panel';
import { InputSwitch } from 'primereact/inputswitch';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox'
import { Toast } from 'primereact/toast';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { useNavigate, useParams } from "react-router-dom";
// import useCheckLogin from "../../utils/useCheckLogin";
import { v4 as uuidv4 } from 'uuid';

import styles from "./FormBuilder.module.css";

import {
  DEV_BASEPATH,
  FORM_UPDATE_URL,
  FORM_PREVIEW_URL,
  FORM_GET_URL,
  MINUTE_MS,
  FORMITEM_EMAIL_ID,
  FORMITEM_FIRST_NAME_ID,
  FORMITEM_MIDDLE_NAME_ID,
  FORMITEM_LAST_NAME_ID,
  FORMITEM_BIRTHDATE_ID,
  FORMITEM_GENDER_ID,
  PROJECT_GET_ALL_URL,
  PROJECTS_URL,
  FORM_TOGGLE_PUBLISH_URL,
  FORM_PUBLISH_URL,
} from "../../utils/constants";

import axios from "axios";

interface iFormItem {
  text: string,
  subtext?: string,
  schema: string,
  choices: string[],
  required: boolean,
  uuid: string,
  acceptTypes: string[],
  _id? : string | undefined,
}

interface iFormData {
  formTitle: string,
  formSubtitle: string,
  formItems: iFormItem[],
  user: any
};

interface iUpdateField {
  value?: any,
  uuid: string,
  field: string,
  choiceIndex?: number,
  checked?: boolean,
}

interface iItemError {
  uuid: string,
  errors: string[],
}

interface iFormError {
  formTitle: string,
  formEntries: string,
  formItems: iItemError[],
}

const fieldTypes = [
  { name: "Short text", value: "TEXT" },
  { name: "Long text", value: "LONG_TEXT" },
  { name: "Yes/No Question", value: "YES_NO" },
  { name: "Single Choice", value: "SINGLE_SELECT" },
  { name: "Multiple Choice", value: "MULTIPLE_SELECT" },
  { name: "Date", value: "DATE" },
  { name: "File", value: "FILE" },
  { name: "Free Text", value: "FREE_TEXT" },

];

const defaultFormItems = [
  FORMITEM_EMAIL_ID,
  FORMITEM_FIRST_NAME_ID,
  FORMITEM_MIDDLE_NAME_ID,
  FORMITEM_LAST_NAME_ID,
  FORMITEM_BIRTHDATE_ID,
  FORMITEM_GENDER_ID,
];

export const FormBuilder: React.FunctionComponent<{
  user: any
}> = (props) => {
  console.log("component whole rerender");
  const { user } = props;
  const { formId } = useParams();
  const navigate = useNavigate();
  const { useState, useEffect, useMemo, useRef, useCallback } = React;

  const droppableId = useMemo(() => uuidv4(), []);
  const [formData, setFormData] = useState<iFormData>({
    formTitle: "",
    formSubtitle: "",
    formItems: [],
    user: user
  });
  const [isFirstLoad, setFirstLoad] = useState(true);
  const [profile, setProfile] = useState<any>();
  const addDropdownRef = useRef<null | HTMLDivElement>(null);
  const toastRef = useRef<null | Toast>(null);

  const [formError, setFormError] = useState<iFormError>({
    formTitle: "",
    formEntries: "",
    formItems: []
  });
  const {
    formTitle,
    formSubtitle,
    formItems,
  } = formData;

  useEffect( () => {
    console.log("changed formadata")
    console.log(formData);
  } , [formData]);

  // useEffect( () => {
  //   const getAuth = async() => {
  //     const userData = CheckLogin();
  //     setFormData(
  //       (prevState) => ({
  //         ...prevState,
  //         user: userData
  //       })
  //     );
  //   };
  //   getAuth();
  // }, []);



  const addField = (e: DropdownChangeParams) => {
    const { value } = e;
    let tempFormItems = [...formData.formItems];
    const tempFormItem: iFormItem = {
      text: "",
      subtext: "",
      schema: value,
      required: false,
      choices: [],
      uuid: uuidv4(),
      acceptTypes: [],
    }
    tempFormItems.push(tempFormItem);
    addDropdownRef?.current?.scrollIntoView({ behavior: "smooth" })
    setFormData({
      ...formData,
      formItems: tempFormItems
    });
  }

  const addFieldDropdown = (
    <div ref={addDropdownRef}>
      <Dropdown
        options={fieldTypes}
        onChange={addField}
        optionLabel="name"
        optionValue="value"
        placeholder="Select a Field Type"
      />
    </div>
  );



  const updateField = useCallback((props: iUpdateField) => {
    const { value, uuid, field, choiceIndex, checked } = props;
    let currentFormItems = [...formData.formItems];
    const currentIndex = currentFormItems.findIndex(
      formItem => formItem.uuid === uuid
    );
    switch (field) {
      case "required":
        currentFormItems[currentIndex].required = value;
        break;
      case "text":
        currentFormItems[currentIndex].text = value;
        break;
      case "subtext":
        currentFormItems[currentIndex].subtext = value;
        break;
      case "choice_add":
        currentFormItems[currentIndex].choices?.push("");
        break;
      case "choice_update":
        if (choiceIndex !== undefined) {
          currentFormItems[currentIndex].choices[choiceIndex] = value;
        }
        break;
      case "choice_delete":
        currentFormItems[currentIndex].choices = currentFormItems[currentIndex]
          .choices
          .filter((choice, index) => (
            index !== choiceIndex
          ));
        break;
      case "field_remove":
        currentFormItems = formData.formItems.filter(
          formItem => formItem.uuid !== uuid
        );
        break;
      case "file_type":
        let acceptTypes = [...currentFormItems[currentIndex].acceptTypes];
        if (checked) {
          acceptTypes.push(value);
        } else {
          acceptTypes = acceptTypes.filter(type => type !== value);
        }
        currentFormItems[currentIndex].acceptTypes = Array.from(new Set(acceptTypes));
        console.log(currentFormItems[currentIndex].acceptTypes);
        break;
    }
    setFormData({
      ...formData,
      formItems: currentFormItems
    });
  }, [formData]);

  const formHeader = useCallback((
    options: any,
    itemNumber: number,
    uuid: string,
    schema: string,
    _id: string | undefined,
    dragHandleProps: any
  ) => {
    const className = `${options.className} p-d-flex p-jc-between`;
    const titleClassName = `${options.titleClassName}`;
    return (
      <div
        className={className}
      >
        <span className={titleClassName}>
          <i
            className="pi pi-bars p-mr-3"
            {...dragHandleProps}
          >
          </i>
          Form Entry #{itemNumber}: {fieldTypes.find(type => type.value === schema)?.name}
        </span>
        {
          (!_id ||  (_id && !defaultFormItems.includes(_id))) && (
            <span>
              <Button
                className="pi pi-trash p-button-danger"
                onClick={(e) => updateField({
                  uuid: uuid,
                  field: "field_remove",
                })}
              />
            </span>
          )
        }
      </div>
    )
  }, [updateField]);

  const renderField = useMemo( () => {
    const fileTypes = [
      {
        value: ".jpeg,.jpg,.png,.gif",
        label: "Images (.jpeg, .jpg, .gif, or .png file extensions)",
      },
      {
        value: ".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        label: "Word Documents (.doc, or .docx file extensions)"
      },
      {
        value: ".pdf",
        label: "PDF File (.pdf file extensions)"
      },
      {
        value: ".xls,.xlsx",
        label: "Excel file (.xls, .xlsx file extensions)"
      },
    ];

    return formData.formItems.map(
      (formItem, index) => {
        let component:any = undefined;
        const errorMsg = formError.formItems.find(item => item.uuid === formItem.uuid)?.errors;
        switch (formItem.schema) {
          case "TEXT":
          case "LONG_TEXT":
          case "YES_NO":
          case "DATE":
            component = (
              <div
                className="p-grid"
                key={"wrapper-" + formItem.uuid}
              >
                <div className="p-d-flex p-flex-column p-col-10">
                  <InputText
                    autoFocus
                    onChange={(e) => updateField({
                      value: e.target.value,
                      uuid: formItem.uuid,
                      field: "text",
                    })}
                    className="p-my-2"
                    value={formItem.text}
                    placeholder="Enter question here"
                  />
                  <InputText
                    onChange={(e) => updateField({
                      value: e.target.value,
                      uuid: formItem.uuid,
                      field: "subtext",
                    })}
                    className="p-inputtext-sm p-my-2"
                    value={formItem.subtext}
                    placeholder="Optional subtext here"
                  />
                  {
                    errorMsg?.map(msg => (
                      <small className="p-error block">{msg}</small>
                    ))
                  }
                </div>
                <div className="p-col-2 p-d-flex p-ai-center">
                  <InputSwitch
                    checked={formItem.required}
                    onChange={(e) => updateField({
                      value: e.value,
                      uuid: formItem.uuid,
                      field: "required",
                    })}
                    className="p-mr-2"
                  />
                  <div>Required?</div>
                </div>
              </div>
            );
          break;
          case "SINGLE_SELECT":
          case "MULTIPLE_SELECT":
            component = (
              <div
                className="p-grid"
                key={"wrapper-" + formItem.uuid}
              >
                <div className="p-d-flex p-flex-column p-col-10">
                  <InputText
                    autoFocus
                    onChange={(e) => updateField({
                      value: e.target.value,
                      uuid: formItem.uuid,
                      field: "text",
                    })}
                    className="p-my-2"
                    value={formItem.text}
                    placeholder="Enter question here"
                  />
                  <InputText
                    onChange={(e) => updateField({
                      value: e.target.value,
                      uuid: formItem.uuid,
                      field: "subtext",
                    })}
                    className="p-inputtext-sm p-my-2 p-my-2"
                    value={formItem.subtext}
                    placeholder="Optional subtext here"
                  />
                  <Button
                    className="pi pi-plus p-button-secondary p-col-2"
                    label="Add option"
                    onClick={(e) => updateField({
                      uuid: formItem.uuid,
                      field: "choice_add",
                    })}
                  />
                  <ul>
                    {
                      formItem.choices?.map((choice, index) => (
                        <li className="p-d-flex p-flex-row p-ai-center">
                          {formItem.schema === "SINGLE_SELECT" && (
                            <RadioButton
                              checked={false}
                              className="p-mr-3"
                            />
                          )}
                          {formItem.schema === "MULTIPLE_SELECT" && (
                            <Checkbox
                              checked={false}
                              className="p-mr-3"
                            />
                          )}
                          <InputText
                            className="p-inputtext-sm p-my-2 p-my-2"
                            value={choice}
                            onChange={(e) => updateField({
                              value: e.target.value,
                              uuid: formItem.uuid,
                              field: "choice_update",
                              choiceIndex: index,
                            })}
                          />
                          <Button
                            className="p-button-danger p-button-sm pi pi-times p-button-text p-button-rounded"
                            onClick={(e) => updateField({
                              uuid: formItem.uuid,
                              field: "choice_delete",
                              choiceIndex: index
                            })}
                          />
                        </li>
                      ))
                    }
                  </ul>
                  {
                    errorMsg?.map(msg => (
                      <small className="p-error block">{msg}</small>
                    ))
                  }
                </div>
                <div className="p-col-2 p-d-flex p-ai-center">
                  <InputSwitch
                    checked={formItem.required}
                    onChange={(e) => updateField({
                      value: e.target.value,
                      uuid: formItem.uuid,
                      field: "required",
                    })}
                    className="p-mr-2"
                  />
                  <div>Required?</div>
                </div>
              </div>
            );
          break;
          case "FILE":
            component =  (
              <div
                className="p-grid"
                key={"wrapper-" + formItem.uuid}
              >
                <div className="p-d-flex p-flex-column p-col-10">
                  <InputText
                    autoFocus
                    onChange={(e) => updateField({
                      value: e.target.value,
                      uuid: formItem.uuid,
                      field: "text",
                    })}
                    className="p-my-2"
                    value={formItem.text}
                    placeholder="Enter question here"
                  />
                  <InputText
                    onChange={(e) => updateField({
                      value: e.target.value,
                      uuid: formItem.uuid,
                      field: "subtext",
                    })}
                    className="p-inputtext-sm p-my-2 p-my-2"
                    value={formItem.subtext}
                    placeholder="Optional subtext here"
                  />
                  <h5>Filetypes to accept (choose one or more)</h5>
                  <ul>
                    {
                      fileTypes.map(type => (
                        <li className="p-d-flex p-flex-row p-ai-center">
                          <Checkbox
                            className="p-mr-2"
                            inputId={"cb-img-" + formItem.uuid}
                            value={type.value}
                            onChange={(e) => updateField({
                              value: e.value,
                              uuid: formItem.uuid,
                              field: "file_type",
                              checked: e.checked,
                            })}
                            checked={formItem.acceptTypes.includes(type.value)}
                          >
                          </Checkbox>
                          <label
                            htmlFor={"cb-img-" + formItem.uuid}
                            className="p-checkbox-label"
                          >
                            {type.label}
                          </label>
                        </li>
                      ))
                    }
                  </ul>
                  {
                    errorMsg?.map(msg => (
                      <small className="p-error block">{msg}</small>
                    ))
                  }
                </div>
                <div className="p-col-2 p-d-flex p-ai-center">
                  <InputSwitch
                    checked={formItem.required}
                    onChange={(e) => updateField({
                      value: e.target.value,
                      uuid: formItem.uuid,
                      field: "required",
                    })}
                    className="p-mr-2"
                  />
                  <div>Required?</div>
                </div>
              </div>
            );
          break;
          case "FREE_TEXT":
            component = (
              <>
                <div
                  className="p-grid"
                  key={"wrapper-" + formItem.uuid}
                >
                  <div className="p-d-flex p-flex-column p-col-10">
                    <InputTextarea
                      autoFocus
                      autoResize
                      onChange={(e) => updateField({
                        value: e.target.value,
                        uuid: formItem.uuid,
                        field: "text",
                      })}
                      className="p-my-2"
                      value={formItem.text}
                      placeholder="Enter free text here"
                    />
                  </div>
                </div>
              </>
            );
            break;
          default:
            component = (<span></span>);
          break;
        }
        return(
          <Draggable
            key={formItem.uuid}
            draggableId={"draggable-" + formItem.uuid}
            index={index}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                style={{
                  ...provided.draggableProps.style,
                  boxShadow: snapshot.isDragging
                    ? "0 0 0.4rem #666"
                    : "none"
                }}
              >
                <Panel
                  className={
                    "p-my-3 " +
                    ((
                      formError.formItems.find(
                        item => item.uuid === formItem.uuid
                      )?.errors
                    ) && styles.invalidPanel)
                  }
                  headerTemplate={
                    (options) => formHeader(
                      options,
                      index + 1,
                      formItem.uuid,
                      formItem.schema,
                      formItem._id,
                      { ...provided.dragHandleProps }
                    )
                  }
                >
                  {component}
                </Panel>
              </div>
            )}
          </Draggable>
        )
      }

    )


  }, [formError.formItems, updateField, formData.formItems, formHeader] );

  const hasEmptyFields = () => {
    let isEmptyFields = false;
    let errors: iFormError = {
      formTitle: "",
      formEntries: "",
      formItems: []
    }
    if (formTitle === "") {
      isEmptyFields = true;
      errors.formTitle = "A Form Title is required.";
    }
    if (formTitle === "Untitled Form") {
      isEmptyFields = true;
      errors.formTitle = "A Form Title other than the default title is required";
    }
    if(formData.formItems.length === 0) {
      isEmptyFields = true;
      errors.formEntries = "A Form must have at least one Form Entry.";
    }

    formItems.forEach(formItem => {
      let itemError: iItemError = {
        uuid: formItem.uuid,
        errors: []
      }
      if (formItem.text.trim() === "") {
        itemError.errors.push("A Form Item text/question is required");
      }
      if (["SINGLE_SELECT", "MULTIPLE_SELECT"].includes(formItem.schema)) {
        if (formItem.choices.length < 2) {
          itemError.errors.push("Single and Multiple Select Form Items need at least two non-blank choices.");
        } else {
          if (formItem.choices.includes("")) {
            itemError.errors.push("Choices cannot be blank.");
          }
        }
      }
      if (formItem.schema === "FILE") {
        if (formItem.acceptTypes.length === 0) {
          itemError.errors.push("A filetype to accept for file upload is required.");
        }
      }

      if (itemError.errors.length > 0) {
        isEmptyFields = true;
        errors.formItems.push(itemError);
      }
    });
    setFormError(errors);


    return isEmptyFields;
  }

  const onSavePublish = async () => {
    console.log(formData);
    if (hasEmptyFields()) {
      toastRef?.current?.show({
        severity: "error",
        summary: "Form Save Failed",
        detail: "Please check fields and notes highlighted in red.",
        life: 5000
      });
      return;
    }
    try{
      await axios.post(
        `${FORM_UPDATE_URL}/${formId}`,
          formData,
      );
      await axios.get(
        `${FORM_PUBLISH_URL}/${formId}`
      );

      toastRef?.current?.show({
        severity: "success",
        summary: "Form Saved and Published",
        detail: "Your form is now published. You will be redirected to Projects shortly.",
        life: 5000
      });
      setTimeout(function () {
        navigate(PROJECTS_URL);
      }, 4000);
    } catch (err:any) {
      const { message } = err.response.data;
      toastRef.current?.show({
        severity: "error",
        summary: "Form Save Failed",
        detail: message,
        life: 5000
      });
    }
  }

  const onSavePreview = async () => {
    if (hasEmptyFields()) {
      toastRef?.current?.show({
        severity: "error",
        summary: "Form Save Failed",
        detail: "Please check fields and notes highlighted in red.",
        life: 5000
      });
      return;
    }
    try{
      await axios.post(
        `${FORM_UPDATE_URL}/${formId}`,
        formData
      );
      const basePath = window.location.host;
      const protocol = window.location.protocol;
      const newWindowPath = `${protocol}//${basePath}${FORM_PREVIEW_URL}/${formId}`;
      toastRef?.current?.show({
        severity: "success",
        summary: "Form Saved",
        detail: "A new tab will be opened to preview your form.",
        life: 5000
      });
      setTimeout(function () {
        window.open(newWindowPath, "_blank")?.focus();
      }, 3500);
    } catch (err:any) {
      const { message } = err.response.data;
      toastRef.current?.show({
        severity: "error",
        summary: "Form Save Failed",
        detail: message,
        life: 5000
      });
    }
  }

  useEffect(() => {
    const getForm = async () => {
      try{
        const { data } = await axios.get(`${DEV_BASEPATH}${FORM_GET_URL}/${formId}`);
        setFormData({
          ...formData,
          formTitle: data.form.formTitle,
          formSubtitle: data.form.formSubtitle,
          formItems: data.form.formItems
        });
      } catch(err:any){
        console.log(err);
      }
    };
    if(isFirstLoad){
      console.log("first if check, should only appear once when page loads");
      getForm();
      setFirstLoad(prevState => !prevState);
      console.log(formData);
    }

  }, [formId, formData, isFirstLoad]);

  useEffect( () => {
    const saveForm = async() => {
      console.log("inside saving form per minute");
      if(formData.formItems.length > 0){
        console.log("saving form happening");
        console.log(formData);
        await axios.post(
          `${FORM_UPDATE_URL}/${formId}`,
          formData
        );
      }
    }
    const interval = setInterval(saveForm, MINUTE_MS);
    return () => clearInterval(interval);
  }, [formData, formId]);

  return (
    <div className={"p-pt-6 p-px-6"}>
      <div className="p-d-flex p-flex-column p-jc-start">
        <div className={"p-d-flex p-flex-row p-jc-between p-grid " + styles.stickyHeader} >
          <div className="p-d-flex p-flex-column p-col p-sm-10 p-md-8 p-lg-6">
            <div className="p-d-flex p-flex-row p-ai-center">
              <h1 className="p-mb-0 p-mr-2">Form Builder:</h1>
              <div className="p-d-flex p-flex-column p-col">
                <InputText
                  className={formError.formTitle && "p-invalid"}
                  value={formTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      formTitle: e.target.value
                    })
                  }
                  placeholder="Enter your form title here, visible to respondents"
                />
                <small className="p-error">{formError.formTitle}</small>
              </div>
            </div>
          </div>
          <div className="p-d-flex p-ai-center">
            <Button
              className="p-mx-2"
              label="Save and Preview"
              onClick={onSavePreview}
            />
            <Button
              className="p-mx-2 p-button-success"
              label="Save and Publish"
              onClick={onSavePublish}
            />
          </div>
          <Toast ref={toastRef} />
        </div>
        <div className="p-d-flex p-col-10 p-flex-column p-ac-stretch p-mt-3">
          <h3 className="p-mb-0 p-mr-2">Subtitle/Description/Instructions:</h3>
          <InputTextarea
            rows={2}
            autoResize
            value={formData.formSubtitle}
            onChange={(e) =>
              setFormData({
                ...formData,
                formSubtitle: e.target.value
              })
            }
            placeholder="Enter subtitle/description/short instructions here"
          />
        </div>
        <Divider />
        <h2>Items/Questions:</h2>
        <h4>(Drag and drop to rearrange order of items/questions) <small className="p-error">{formError.formEntries}</small></h4>
        <DragDropContext
          onDragEnd={(param) => {
            const currentFormItems = [...formData.formItems];
            const sourceIndex = param.source.index;
            const destIndex = param.destination?.index;
            const [removedItem] = currentFormItems.splice(sourceIndex, 1);
            if (destIndex !== undefined) {
              currentFormItems.splice(destIndex, 0, removedItem);
              setFormData({
                ...formData,
                formItems: currentFormItems
              });
            }
          }}
        >
          <div className="p-sm-12 p-md-8 p-as-center p-mb-5">
            <Droppable droppableId={droppableId}>
              {(provided, _) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {renderField}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Divider />
            {addFieldDropdown}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
