export default function Status({ status }) {
  let { success, err, message } = status;
  let defaultState = null;

  if (err) {
    <p className="text-red-700">{err}</p>;
  }
  if (!success && !message) {
    return defaultState;
  }
  return (
    <pre style={{ wordBreak: "break-word", whiteSpace: 'pre-wrap'}}>
      <strong>Status:</strong> {message || (success ? "Success!" : "")}
    </pre>
  );
}
