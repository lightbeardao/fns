import { BounceLoader } from "react-spinners";

export default function TxDetails({ id }) {
  return (
    <div className="p-3 bg-white rounded-xl flex space-between items-center gap-2">
      <span className="italic text-gray-400">Submitted</span>
      <a
        className="font-medium italic text-green-300"
        href={`${process.env.NEXT_PUBLIC_FLOW_EXPLORER}/transaction/${id}`}
      >
        {id.slice(0, 12)}...
      </a>
      <div className="pr-4" style={{ width: 30, height: 30 }}>
        <BounceLoader
          size={30}
          color={"rgb(96,229,168)"}
          speedMultiplier={0.75}
        />
      </div>
    </div>
  );
}
