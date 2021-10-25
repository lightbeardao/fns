import { useState } from "react"


function InputButton({ hint, placeholder, callback, children }) {
  const [text, setText] = useState('')
  return (
    <div className="w-full">
      <form className="bg-white rounded px-2">

        {hint && <p className="text-sm overflow-hidden mb-2">
          {hint}
        </p>}
        <div className="flex items-center justify-between">
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2" id="text" type="text" placeholder={placeholder} value={text} onChange={e => setText(e.target.value)}></input>
          <button className="bg-blue-500 w-48 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={async () => await callback(text)}>
            {children}
          </button>
        </div>
      </form >
    </div >
  )
}

export default InputButton