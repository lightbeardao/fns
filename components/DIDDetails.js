export default function DIDDetails({ doc }) {
  if (!doc) return null;

  console.log("d: ", doc);
  return <div>Already found!</div>;
}
