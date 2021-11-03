import cx from "classnames";

export default function Status({ status }) {
  let { success, err, message } = status;

  return (
    <pre
      className={cx(err ? "text-red-700" : "")}
      style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
    >
      <strong>Status:</strong>{" "}
      {err ? err : message ? message : success ? "Success!" : ""}
    </pre>
  );
}
