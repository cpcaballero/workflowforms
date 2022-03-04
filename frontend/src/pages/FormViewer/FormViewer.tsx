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
import { Calendar } from 'primereact/calendar';
import { FileUpload, FileUploadProps, FileUploadSelectParams, ItemTemplateOptions } from 'primereact/fileupload';
import { Tag } from 'primereact/tag';
import { useNavigate, useParams } from "react-router-dom";
import useCheckLogin from "../../utils/useCheckLogin";
import { v4 as uuidv4 } from 'uuid';

import styles from "./FormViewer.module.css";

import { DEV_BASEPATH, FORM_GET_URL, FORM_UPDATE_URL } from "../../utils/urls";

import axios from "axios";

import {ShortText, LongText} from "../../components";


interface iFormItem {
  text: string,
  subtext?: string,
  schema: string,
  choices: string[],
  required: boolean,
  uuid: string,
  acceptTypes: string[],
  errorMsg? : string[]
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

interface iItemError {
  uuid: string,
  errors: string[],
}

interface formAnswer {
  uuid: string,
  value?: any
}

const fieldTypes = [
  { name: "Short text", value: "TEXT" },
  { name: "Long text", value: "LONG_TEXT" },
  { name: "Yes/No Question", value: "YES_NO" },
  { name: "Single Choice", value: "SINGLE_SELECT" },
  { name: "Multiple Choice", value: "MULTIPLE_SELECT" },
  { name: "Date", value: "DATE" },
  { name: "File", value: "FILE" }
];



export const FormViewer: React.FunctionComponent<{preview: boolean}> = () => {
  const user = useCheckLogin();
  const { formId } = useParams();
  const navigate = useNavigate();
  const { useState, useEffect, useMemo, useRef, useCallback } = React;
  const droppableId = useMemo(() => uuidv4(), []);

  const [profile, setProfile] = useState<any>();
  const addDropdownRef = useRef<null | HTMLDivElement>(null);
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

  const [ formAnswers, setFormAnswers ] = useState<formAnswer[]>([]);

  // const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   return setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value
  //   });
  // };

  useEffect(() => {
    if (user !== undefined) {
      setProfile(user);
    }
  }, [user]);

  useEffect(() => {
    const getForm = async () => {
      try{
        const { data } = await axios.get(`${DEV_BASEPATH}${FORM_GET_URL}/${formId}`);
        setFormStructure(data.form);
      } catch(err:any){
        console.log(err);
      }
    };
    getForm();
  }, [formId]);

  useEffect(() => {
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
  }, [formStructure]);


  const saveAnswer = useCallback((index:number, value:any) => {
    console.log("saveanswer called");
    setFormAnswers((prevState) => {
      prevState[index].value = value;
      return prevState;
    });
  }, []);


  const formHeader = (
    options: any,
    itemNumber: number,
    uuid: string,
    text: string,
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
              <span>{text}</span>
              { subtext && <small className="p-mt-3">{subtext}</small> }
            </span>
          </div>

        </span>
      </div>
    )
  }

  const ItemWrapper = useCallback((props: any) => {
    const {formItem, index} = props;
    return(
      <Panel
        className={
          "p-my-3 " +
          ((
            formItem.errorMsg
          ) && styles.invalidPanel)
        }
        headerTemplate={
          (options) => formHeader(
            options,
            index + 1,
            formItem.uuid,
            formItem.text,
            formItem.subtext,
          )
        }
      >
        {props.children}
      </Panel>
    )
  }, []);

  const formItems = useMemo(() => {
    console.log("renderfield rerender");
    const { formItems } = formStructure;
    return formItems.map(
      (formItem, index) => {
        switch (formItem.schema) {
          case "TEXT":
            return (
              <ItemWrapper
                index={index}
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
            return (
              <ItemWrapper
                index={index}
                formItem={formItem}
              >
                <LongText
                  onChangeFn={(value:any) => saveAnswer(index, value)}
                  formItem={formItem}
                  value={formAnswers[index]?.value}
                />
              </ItemWrapper>
            );
        }
      }
    )
  }, [formAnswers, saveAnswer, formStructure, ItemWrapper]);



  const onSave = async() => {

  }


  return (
    <div className={"p-pt-6 p-px-6"}>
      <div className="p-d-flex p-flex-column p-jc-start">
        <div className={"p-d-flex p-flex-row p-jc-between p-grid " + styles.stickyHeader} >
          <div className="p-d-flex p-flex-column p-col p-sm-10 p-md-8 p-lg-6">
            <div className="p-d-flex p-flex-row p-ai-center">
              <h1 className="p-mb-0 p-mr-2">{formStructure.formTitle}</h1>
            </div>
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
    </div>
  );
}
