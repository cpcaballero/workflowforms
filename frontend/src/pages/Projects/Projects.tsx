import * as React from "react";
import { Button }  from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import {
  FilterMatchMode,
  FilterOperator,
} from 'primereact/api';
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { confirmDialog } from 'primereact/confirmdialog';

import styles from "./Projects.module.css";
import {
  DEV_BASEPATH,
  FORM_PREVIEW_URL,
  FORM_VIEW_EDITABLE_URL,
  PROJECT_CREATE_URL,
  PROJECT_GET_ALL_URL,
  FORMITEM_EMAIL_ID,
  FORMITEM_FIRST_NAME_ID,
  FORMITEM_MIDDLE_NAME_ID,
  FORMITEM_LAST_NAME_ID,
  FORMITEM_BIRTHDATE_ID,
  FORMITEM_GENDER_ID,
  PROJECT_FORM_BUILDER_URL,
  FORM_PUBLISH_URL,
  PROJECTS_URL,
  FORM_UNPUBLISH_URL,
} from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";
import { Toast } from "primereact/toast";


interface iFormData {
  projectName: string,
  stages: string[],
  user: any
}

export const Projects: React.FunctionComponent<{user: any}> = (props) => {
  const { user } = props;
  const navigate = useNavigate();
  const {useState, useEffect, useRef} = React;
  const addStageTextRef = useRef<any>(null);
  const toastRef = useRef<any>(null);
  const [formData, setFormData] = useState<iFormData>({
    projectName: "",
    stages: [],
    user: user
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

  const [projects, setProjects] = useState();

  const filters = {
    // 'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'form.formTitle': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    'form.isPublished': { value: null, matchMode: FilterMatchMode.EQUALS },
    'form.formEntries.length': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    'stages.length': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    'createdBy._id': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    'dateCreated': { value: null, matchMode: FilterMatchMode.BETWEEN },
  };

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
          {
            ...formData,
            stages: draftStages,
            defaultFormItems: [
              FORMITEM_EMAIL_ID,
              FORMITEM_FIRST_NAME_ID,
              FORMITEM_MIDDLE_NAME_ID,
              FORMITEM_LAST_NAME_ID,
              FORMITEM_GENDER_ID,
              FORMITEM_BIRTHDATE_ID,
            ]
          }
        );
        navigate(`${PROJECT_FORM_BUILDER_URL}/${project.data.project.form}`);
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
    const getAllProjects = async () => {
      const projectsDetails = await axios.get(`${DEV_BASEPATH}${PROJECT_GET_ALL_URL}`);
      setProjects(projectsDetails.data);
    };
    getAllProjects();
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);


  useEffect( () => {
    setNewStage("");
    addStageTextRef?.current?.focus();
  }, [draftStages]);

  const createdByTemplate = (row:any) => {
    return (<>
      {row.createdBy.lastName},
      {" "}
      {row.createdBy.firstName}
      {" "}
      {row.createdBy.middleName && row.createdBy.middleName[0]}
    </>);
  }

  const dateFilterTemplate = (options:any) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        dateFormat="mm/dd/yy"
        placeholder="mm/dd/yyyy"
        mask="99/99/9999"
      />
    );
}

  const respondentsTemplate = (row:any) => {
    return (
      <>
        {
          row.form
            ? row.form.formEntries.length
            : 0
        }
      </>
    );
  }

  const viewForm = (form: any) => {
    const basePath = window.location.host;
    const protocol = window.location.protocol;
    let newWindowPath = "";

    if (form.formEntries && form.formEntries.length > 0) {
      //preview only
      // navigate(`/form/preview/${form._id}`);
      newWindowPath = `${protocol}//${basePath}${FORM_PREVIEW_URL}/${form._id}`
    } else if (form.formEntries && form.formEntries.length === 0) {
        //preview and editable
        newWindowPath = `${protocol}//${basePath}${FORM_VIEW_EDITABLE_URL}/${form._id}`
    } else {
      // preview and editable
      newWindowPath = `${protocol}//${basePath}${FORM_VIEW_EDITABLE_URL}/${form._id}`
    }
    window.open(newWindowPath, "_blank")?.focus();

  }

  const publishForm = async (formId:string) => {
    await axios.get(
      `${FORM_PUBLISH_URL}/${formId}`
    );
    toastRef?.current?.show({
      severity: "success",
      summary: "Form Published",
      detail: "Your form is now published and accessible to the public. This page will be refreshed shortly.",
      life: 5000
    });
    setTimeout(function () {
      window.location.reload();
    }, 4000);
  }

  const unpublishForm = async (formId:string) => {
    await axios.get(
      `${FORM_UNPUBLISH_URL}/${formId}`
    );
    toastRef?.current?.show({
      severity: "success",
      summary: "Form Unpublished",
      detail: "Your form is now unpublished and hidden from the public. This page will be refreshed shortly.",
      life: 5000
    });
    setTimeout(function () {
      window.location.reload();
    }, 4000);
  }

  const confirmPublishAction = async (options:any) => {
    const {
      action,
      formId,
      projectName,
      formTitle
    } = options;

    confirmDialog({
      message: `Are you sure you want to ${action} form titled "${formTitle}" under project "${projectName}"?`,
      header: `Action: ${action} form`,
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: action === "publish"
        ? async () => await publishForm(formId)
        : async () => await unpublishForm(formId),
      reject: () => {},
  });
  };

  const actionsTemplate = (row:any) => {
    return (
    <div className="p-d-flex p-flex-row" >
      <Button
        className="p-button p-button-rounded p-button-outlined p-mx-3"
        icon="pi pi-sign-in"
        tooltip="Manage respondents/entries"
        tooltipOptions={{
          position: "top"
        }}
      />
      <Button
        className="p-button p-button-rounded p-button-outlined p-mx-3"
        icon="pi pi-align-justify"
        tooltip="View form items/questions"
        tooltipOptions={{
          position: "top"
        }}
        onClick={() => viewForm(row.form)}
      />
      <Button
        className="p-button p-button-rounded p-button-outlined p-mx-3"
        icon={
          row.form?.isPublished === "Yes"
            ? "pi pi-ban"
            : "pi pi-check"
        }
        tooltip={
          row.form?.isPublished === "Yes"
            ? "Unpublish form"
            : (row.form?.formItems.length === 0)
              ? "Cannot publish form without items/questions"
              : "Publish form"
        }
        tooltipOptions={{
          position: "top",
          showOnDisabled: true
        }}
        disabled={row.form?.formItems.length === 0}
        onClick={
          () => confirmPublishAction(
            {
              action: row.form.isPublished === "Yes"
                ? "unpublish"
                : "publish",
              formId: row.form._id,
              projectName: row.projectName,
              formTitle: row.form.formTitle
            }
          )
        }
      />
    </div>);
  }

  const createdDateTemplate = (row:any) => {
    const createdDate = moment(row.dateCreated);
    return <>{createdDate.tz("Asia/Manila").format("MMM DD, YYYY hh:mm A")}</>
  }

  const publishedTemplate = (row:any) => {
    return (
      <Tag
        value={row.form?.isPublished || "No"}
        icon={
          row.form?.isPublished === "Yes"
            ? "pi pi-check"
            : "pi pi-times"
        }
        severity={
          row.form?.isPublished === "Yes"
            ? "success"
            : "danger"
        }
      >
      </Tag>
    );
  }

  const publishedItemFilterTemplate = (option:any) => {
    return (
      <Tag
          value={option}
          icon={
            option === "Yes"
              ? "pi pi-check"
              : "pi pi-times"
            }
          severity={
            option === "Yes"
              ? "success"
              : "danger"
          }
        >
        </Tag>
      );
  }

  const publishedFilterElement = (options:any) => {
    return (
      <Dropdown
        value={options.value}
        options={["Yes", "No"]}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        itemTemplate={publishedItemFilterTemplate}
        placeholder="Select a Status"
        className="p-column-filter"
        showClear
      />
    );
  }

  const filterDate = (value:any, filter: any) => {
    const momentValue = moment(value).tz("Asia/Manila");
    const momentFilter = moment(filter).tz("Asia/Manila");
    if (value === undefined || value === null) {
      return false;
    }
    if (
      filter === undefined
        || filter === null
        || (typeof filter === 'string'
        && filter.trim() === '')
    ) {
      return true;
    }
    return momentValue.dayOfYear() === momentFilter.dayOfYear();
  }

  const filterCreator = (value: any, filter: any) => {
    if (value === undefined || value === null) {
      return false;
    }
    if (
      filter === undefined
        || filter === null
        || (typeof filter === 'string'
        && filter.trim() === '')
    ) {
      return true;
    }
    const currentValue = value.lastName + ", " + value.firstName + " " + (value.middleName && value.middleName[0]);
    return currentValue.toLowerCase().includes(filter.toLowerCase());
  }

  return(
    <div className={styles.projectWrapper + " p-pt-6 p-px-6"}>
      <div className="p-d-flex p-jc-start p-ai-start p-flex-row">
        <h1>Projects</h1>
        <Toast ref={toastRef} />
        <Button
          label="Create"
          className="p-ml-5"
          onClick={() => setCreateProjectModal(true)}
        />
      </div>
      <div className="p-d-flex p-jc-center p-mt-6">
        <DataTable
          style={{flex: "1"}}
          value={projects}
          paginator
          rows={10}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rowsPerPageOptions={[10,25,50]}
          dataKey="id"
          // onValueChange={filteredData => console.log(filteredData)}
          // selection={selectedCustomers}
          // onSelectionChange={e => setSelectedCustomers(e.value)}
          // filters={filters}
          filterDisplay="menu"
          // loading={loading}
          responsiveLayout="scroll"
          // filters={null}
          // globalFilterFields={['name', 'country.name', 'representative.name', 'balance', 'status']}
          emptyMessage="No projects found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} projects">
          <Column
            field="projectName"
            header="Project Name"
            showFilterOperator={false}
            showAddButton={false}
            sortable
            filter
          />
          <Column
            field="form.formTitle"
            header="Form Title"
            showFilterOperator={false}
            showAddButton={false}
            sortable
            filter
          />
          <Column
            header="Published"
            field="form.isPublished"
            body={publishedTemplate}
            showFilterOperator={false}
            showFilterMatchModes={false}
            filterElement={publishedFilterElement}
            showAddButton={false}
            sortable
            filter
          />
          <Column
            header="Respondents"
            field="form.formEntries.length"
            body={respondentsTemplate}
            showFilterOperator={false}
            dataType="numeric"
            showAddButton={false}
            sortable
            filter
          />
          <Column
            field="stages.length"
            header="Stages"
            showFilterOperator={false}
            dataType="numeric"
            showAddButton={false}
            sortable
            filter
          />
          <Column
            field="createdBy"
            body={createdByTemplate}
            header="Created By"
            showFilterOperator={false}
            showFilterMatchModes={false}
            filterMatchMode="custom"
            filterFunction={(value,filter) => filterCreator(value,filter)}
            showAddButton={false}
            sortable
            filter
          />
          <Column
            field="dateCreated"
            body={createdDateTemplate}
            header="Date Created"
            showFilterOperator={false}
            dataType="date"
            filterElement={dateFilterTemplate}
            showFilterMatchModes={false}
            filterMatchMode="custom"
            filterFunction={(value, filter) => filterDate(value, filter)}
            showAddButton={false}
            sortable
            filter
          />
          <Column
            body={actionsTemplate}
            header="Actions"
          />
        </DataTable>
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
