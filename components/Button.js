const Button = ({ children, ...props }) => (
  <button
    className="transition inline-block focus-visible:ring-2 focus-visible:ring-black focus:outline-none py-2.5 px-6 text-base text-gray-600 font-medium rounded-lg hover:shadow-lg"
    style={{
      background:
        "linear-gradient(279.56deg, rgb(238, 255, 245) -52.57%, rgb(186, 233, 239) 126.35%)",
    }}
    {...props}
  >
    {children}
  </button>
);

export default Button;
