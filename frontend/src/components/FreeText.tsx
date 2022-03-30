import { Panel } from "primereact/panel";

export const FreeText = (props:any) => {
  const {
    onChangeFn,
    value,
    formItem,
  } = props;
  return (
    <Panel
      className="p-my-3"
      style={{borderTop: "1px solid #c8c8c8"}}
    >
      <div className="p-d-flex p-flex-column p-col-10">
        <div
          style={{
            whiteSpace: "pre-wrap",
            fontSize: "1rem",
          }}
        >
          {value}
        </div>
      </div>
    </Panel>
  );
}
