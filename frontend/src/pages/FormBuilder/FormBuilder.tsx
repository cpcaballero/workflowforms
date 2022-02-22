import * as React from "react";
import { Button }  from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Divider } from 'primereact/divider';
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown';
import { Panel } from 'primereact/panel';
import { InputSwitch } from 'primereact/inputswitch';
import { RadioButton } from 'primereact/radiobutton';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// import styles from "./FormBuilder.module.css";
// import { PROJECT_CREATE_URL } from "../../utils/urls";
import { useNavigate, useParams } from "react-router-dom";

import useCheckLogin from "../../utils/useCheckLogin";

// import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

interface iFormItem {
  text: string,
  subtext?: string,
  schema: string,
  choices: string[],
  required: boolean,
  uuid: string
}

interface iFormData {
  formTitle: string,
  formItems: iFormItem[],
};

interface iUpdateField {
  value?: any,
  uuid: string, 
  field:string, 
  choiceIndex?:number
}

const fieldTypes = [
  {name: "Short text", value: "TEXT"},
  {name: "Long text", value: "LONG_TEXT"},
  {name: "Yes/No Question", value: "YES_NO"},
  {name: "Single Choice", value: "SINGLE_SELECT"},
  {name: "Multiple Choice", value: "MULTIPLE_SELECT"},
  {name: "Date", value: "DATE"},
  
];


export const FormBuilder: React.FunctionComponent = () => {
  const user = useCheckLogin();
  const {formId} = useParams();
  const navigate = useNavigate();
  const {useState, useEffect, useMemo} = React;
  const droppableId = useMemo(() => uuidv4(), []);
  const [formData, setFormData] = useState<iFormData>({
    formTitle: "",
    formItems: []
  });

  
  const [profile, setProfile] = useState<any>();

  const handleOnChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    return setFormData({
      ...formData, 
      [e.target.name]:e.target.value
    });
  };

  useEffect( () => {
    if(user !== undefined){
      setProfile(user);
    }
  }, [user]);
  
  const addField = (e : DropdownChangeParams) => {
    const {value} = e;
    let tempFormItems = [...formData.formItems];
    const tempFormItem:iFormItem = {
      text: "",
      subtext: "",
      schema: value,
      required: false,
      choices: [],
      uuid: uuidv4()
    }
    tempFormItems.push(tempFormItem);
    setFormData({...formData, formItems: tempFormItems});
  }

  const addFieldDropdown = (
    <div>
      <Dropdown 
        options={fieldTypes} 
        onChange={addField} 
        optionLabel="name" 
        optionValue="value"
        placeholder="Select a Field Type" 
      />
    </div>
  );

  const updateField = (props: iUpdateField) => {
    const { value, uuid, field, choiceIndex} = props;
    let currentFormItems = [...formData.formItems];
    const currentIndex = currentFormItems.findIndex(
      formItem => formItem.uuid === uuid
    );
    switch(field){
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
        if(choiceIndex !== undefined){
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
    }
    setFormData({
      ...formData, 
      formItems: currentFormItems
    });
  }

  const renderField = (formItem: iFormItem) => {
    switch(formItem.schema){
      case "TEXT":
      case "LONG_TEXT":
      case "YES_NO":
      case "DATE":
        return(
          <div className="p-grid">
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
                autoFocus 
                onChange={(e) => updateField({
                  value: e.target.value, 
                  uuid: formItem.uuid, 
                  field: "subtext",
                })}
                className="p-inputtext-sm"
                value={formItem.subtext} 
                placeholder="Optional subtext here"
              />
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
      case "SINGLE_SELECT":
      case "MULTIPLE_SELECT":
        return(
          <div className="p-grid">
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
                autoFocus 
                onChange={(e) => updateField({
                  value: e.target.value, 
                  uuid: formItem.uuid, 
                  field: "subtext",
                })}
                className="p-inputtext-sm p-my-2"
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
                    formItem.choices?.map( (choice, index) => (
                      <li className="p-d-flex p-flex-row p-ai-center">
                        <RadioButton 
                          checked={false} 
                          className="p-mr-3"
                        />
                        <InputText
                          className="p-inputtext-sm p-my-2"
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
    }
  }

  const formHeader = (options:any, itemNumber:number, uuid:string, dragHandleProps:any) => {
    const className=`${options.className} p-d-flex p-jc-between`;
    const titleClassName=`${options.titleClassName}`;
    return(
      <div 
        className={className}
      >
        <span className={titleClassName}>
          <i 
            className="pi pi-bars p-mr-3"
            {...dragHandleProps}
          >
          </i>
          Form Entry #{itemNumber}
        </span>
        <span>
          <Button 
            className="pi pi-trash p-button-danger"
            onClick={(e) => updateField({
              uuid: uuid, 
              field: "field_remove",
            })}
          />
        </span>
      </div>
    )
  }

  
  return(
    <div className={"p-pt-6 p-px-6"}>
      <div className="p-d-flex p-flex-column p-jc-start">
        <div className="p-d-flex p-flex-row p-jc-between p-grid">
            <div className="p-d-flex p-flex-row p-sm-10 p-md-8 p-lg-6">
              <h1 className="p-mb-0 p-mr-2">Form Builder:</h1>
              <InputText 
                className="p-col"
                value={formData.formTitle}
                onChange={(e) => setFormData({...formData, formTitle: e.target.value})}
                placeholder="Enter your form title here"
              />
            </div>
          <div className="p-d-flex p-ai-center">
            <Button 
              className="p-mx-2"
              label="Save and Preview" 

            />
            <Button 
              className="p-mx-2 p-button-success"
              label="Publish"
              
            />
          </div>
        </div>
        
        <Divider />
        <DragDropContext
          onDragEnd={(param) => {
            const currentFormItems = [...formData.formItems];
            const sourceIndex = param.source.index;
            const destIndex = param.destination?.index;
            const [removedItem] = currentFormItems.splice(sourceIndex, 1);
            if(destIndex !== undefined ){
              currentFormItems.splice(destIndex, 0, removedItem);
              setFormData({
                ...formData,
                formItems: currentFormItems
              });
            }
          }}
        >
          <div className="p-sm-12 p-md-8 p-as-center">
            <Droppable droppableId={droppableId}>
              {(provided, _ ) => (
                <div 
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {
                    formData.formItems.map(
                      (formItem, index) => (
                        <Draggable
                          key={formItem.uuid}
                          draggableId={"draggable-"+formItem.uuid}
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
                                className="p-my-3"
                                headerTemplate={(
                                  options) => formHeader(options, index+1, formItem.uuid, {...provided.dragHandleProps})
                                }
                              >
                                {renderField(formItem)}
                              </Panel>

                            </div>
                            
                          )}
                          
                        </Draggable>
                        
                      )
                    )
                  }
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
