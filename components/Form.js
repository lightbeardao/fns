import { useState } from "react"


function Form({ title, fields, callback, children }) {
  const [text, setText] = useState(fields.map(i => ""))

  return (
    <div className="w-full">
      <form className="bg-white rounded px-2" autoComplete="off">

        {title && <h1 className="w-full text-xl m-2 mt-4 text-center">{title}</h1>
        }
        <div className="flex justify-between gap-4 items-start">
          <div style={{ flex: 2 }}>
            {fields.map(({ placeholder }, i) =>
              <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full" id="text" type="text" data={i} placeholder={placeholder} value={text[i]} onChange={e => {
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
    </div >
  )
}

export default Form