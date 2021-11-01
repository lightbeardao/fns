import { useState } from "react";
import Button from "./Button";
import * as Collapsible from "@radix-ui/react-collapsible";

function Form({ title, fields, callback, children }) {
  const [text, setText] = useState(fields.map((i) => ""));
  const [open, setOpen] = useState(false);
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.CollapsibleTrigger>
        {open ? (
          <h1 className="w-full m-2 mx-auto p-2 px-4 text-center shadow-lg bg-blue-100 rounded-2xl">
            {title}
          </h1>
        ) : (
          <h1 className="w-full m-2 mx-auto p-2 px-4 text-center shadow-lg bg-blue-50 rounded-2xl">
            {title}
          </h1>
        )}
      </Collapsible.CollapsibleTrigger>

      <Collapsible.CollapsibleContent>
        <form className="rounded p-4" autoComplete="off">
          <div className="flex justify-between gap-4 items-start">
            <div className="flex flex-col gap-1" style={{ flex: 2 }}>
              {fields.map(({ placeholder }, i) => (
                <input
                  className="appearance-none border-b-2 border-blue-50 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                  id="text"
                  type="text"
                  data={i}
                  placeholder={placeholder}
                  key={placeholder}
                  value={text[i]}
                  onChange={(e) => {
                    let c = [...text];
                    c[i] = e.target.value;
                    setText(c);
                  }}
                ></input>
              ))}
            </div>
            <Button
              onClick={async (e) => {
                e.preventDefault();
                await callback(text);
              }}
            >
              {children}
            </Button>
          </div>
        </form>
      </Collapsible.CollapsibleContent>
    </Collapsible.Root>
  );
}

export default Form;
