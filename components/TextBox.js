import cx from "classnames";

export default function TextBox({ error = false, color, ...props }) {
  return (
    <input
      className={cx(
        error ? "text-red-300" : color || "text-green-300",
        "text-center text-3xl font-semibold bg-gradient-to-r from-gray-50 to-white appearance-none border-b-2 border-blue-50 rounded py-6 px-3 leading-tight focus:outline-none focus:shadow-outline w-full"
      )}
      id="text"
      type="text"
      {...props}
    ></input>
  );
}
