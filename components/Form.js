import { useState } from "react"
import * as Collapsible from '@radix-ui/react-collapsible'

function Form({ title, fields, callback, children }) {
  const [text, setText] = useState(fields.map(i => ""))
  const [open, setOpen] = useState(false);
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.CollapsibleTrigger>
        {open ?
          <h1 className="w-full m-2 mx-auto p-2 px-4 text-center shadow-lg bg-blue-100 rounded-2xl">{title}</h1> :
          <h1 className="w-full m-2 mx-auto p-2 px-4 text-center shadow-lg bg-blue-50 rounded-2xl">{title}</h1>}
      </Collapsible.CollapsibleTrigger>

      <Collapsible.CollapsibleContent>
        <form className="bg-white rounded p-4" autoComplete="off">
          <div className="flex justify-between gap-4 items-start">
            <div className="flex flex-col gap-1" style={{ flex: 2 }}>
              {fields.map(({ placeholder }, i) =>
                <input className="appearance-none border-b-2 border-blue-50 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full" id="text" type="text" data={i} placeholder={placeholder} value={text[i]} onChange={e => {
                  let c = [...text];
                  c[i] = e.target.value;
                  setText(c)
                }}></input>
              )}
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1" type="button" onClick={async () => await callback(text)}>
              {children}
            </button>
          </div>
        </form >
      </Collapsible.CollapsibleContent>
    </Collapsible.Root >
  )
}

export default Form