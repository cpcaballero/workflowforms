import { InputTextarea } from "primereact/inputtextarea";

export const LongText = (props:any) => {
  const {
    onChangeFn,
    value,
    formItem,
  } = props;
  return (
    <div className="p-d-flex p-flex-column p-col-10">
      <InputTextarea
        className="p-my-2"
        onChange={
          (e) => onChangeFn(e.target.value)
        }
        value={value}
        placeholder={`Your answer ${formItem.required ? '(required)' : ''}`}
      />
      {
        formItem.errorMsg?.map((msg:string) => (
          <small className="p-error block">{msg}</small>
        ))
      }
    </div>
  );
}
