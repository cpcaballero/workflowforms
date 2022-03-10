import * as React from "react";
import {
  FileUpload,
  FileUploadSelectParams,
  ItemTemplateOptions
} from "primereact/fileupload";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";

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

export const FileUploader = (props:any) => {
  const {
    onChangeFn,
    value,
    formItem,
  } = props;

  const { useState, useEffect } = React;
  const [ fileCount, setFileCount ] = useState(0);



  const onTemplateRemove = (file:any, callback:any) => {
    console.log("onTemplateRemove called");
    setFileCount((prevState) => prevState - 1);
    onChangeFn(undefined);
    callback();
  }

  const itemTemplate = (
    file:any,
    props:ItemTemplateOptions
  ) => {
    return (
      <div className="flex align-items-center flex-wrap">
          <div
            className="flex align-items-center"
            style={{width: '40%'}}
          >
            <img
              alt={""}
              role="presentation"
              src={file.objectURL}
              width={100}
            />
            <span className="flex flex-column text-left p-ml-3">
              {file.name}
            </span>
          </div>
          <Tag
            value={props.formatSize}
            severity="success"
            className="px-3 py-2 p-mx-3"
          />
          <Button
            type="button"
            icon="pi pi-times"
            className="p-button-outlined p-button-rounded p-button-danger p-mx-3 p-py-2"
            onClick={() =>
              onTemplateRemove(
                file,
                props.onRemove
              )
            }
          />
      </div>
    );
  };
  const headerTemplate = (options:any) => {
    const {
      className,
      chooseButton,
      uploadButton,
      cancelButton
    } = options;
    console.log(options);
    console.log(uploadButton);
    return (
        <div
          className={className}
          style={{
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center'
          }}
          >
            {fileCount === 0 && chooseButton}
        </div>
    );
  };
  const onSelectFile = (event:any) => {
    const { originalEvent, files } = event;
    console.log(files);
    console.log(files.length);
    setFileCount((prevState) => prevState + 1);

  };

  const onValidationFail = (file:File) => {
    setFileCount((prevState) => prevState - 1);
  }

  const allowedExtensions = formItem.acceptTypes.split(",").map(
    (acceptType:any) => (
      fileTypes.find(
        type => type.value.includes(acceptType)
      )?.label
    )
  );

  const uploadFile = (e:any) => {
    const { files } = e;
    console.log("UPLOADFILE CALLED")
    console.log(files);
    onChangeFn(files[0]);
  }
  return (
    <div className="p-d-flex p-flex-column p-col-10">
      <FileUpload
        auto={true}
        name="demo"
        url="./upload"
        mode="advanced"
        itemTemplate={itemTemplate}
        headerTemplate={headerTemplate}
        onSelect={(onSelectFile)}
        accept={formItem.acceptTypes.split(",")}
        maxFileSize={10000000}
        onValidationFail={onValidationFail}
        customUpload={true}
        uploadHandler={uploadFile}
      />

        <h5>Filetypes accepted:</h5>
        <ul>
          {
            Array.from(new Set(allowedExtensions)).map(
              (
                acceptType:any,
                index:number
              ) => (
              <li
                key={"fuploader-" + index + "-" + formItem.uuid}
                className="p-d-flex p-flex-row p-ai-center"
              >
                <label className="p-checkbox-label">
                  {acceptType}
                </label>
              </li>
            ))
          }
        </ul>
        {
          formItem.errorMsg?.map( (msg:string) => (
            <small className="p-error block">{msg}</small>
          ))
        }
      </div>
  );
}
