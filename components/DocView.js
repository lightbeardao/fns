

function DocView({ streamId, setStreamId, content, onLoad, updateDoc }) {
  return (
    <div className="w-full max-w-sm mb-4">
      <form className="bg-white rounded p-4 px-2">
        <div className="flex items-center justify-between">
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2" id="streamId" type="text" placeholder="streamId" value={streamId} onChange={e => setStreamId(e.target.value)}></input>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={async () => await onLoad(streamId)}>
            Load
          </button>

          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-2" type="button" onClick={updateDoc}>
            Update
          </button>
        </div>
      </form >
      <div className="border">
        {content}
      </div>
    </div >
  )
}

export default DocView