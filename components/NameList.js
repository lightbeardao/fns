//@ts-check
import Card from "./Card";

export default function NameList({ names }) {
  return (
    <>
      <div className="flex justify-between px-2.5 lg:px-0 items-center">
        <h1 className="text-gray-700 text-2xl font-normal">Your Names</h1>
      </div>

      <div className="mt-4">
        {Object.entries(names).map(([key, value]) => (
          <div key={key}>
            <Card name={key} signatures={value} />
          </div>
        ))}
      </div>
    </>
  );
}
