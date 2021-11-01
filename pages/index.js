import { query } from "@onflow/fcl";
import Link from "next/Link";
import { useEffect, useState } from "react";
import Button from "../components/DivButton";
import Layout from "../components/Layout";
import NameList from "../components/NameList";
import TextBox from "../components/TextBox";
import { useAuth } from "../providers/AuthProvider";
import { getDID } from "../utils/did-helper";
import { Scripts } from "../utils/flow";

const RegistrationPanel = ({ name, did }) => {
  return (
    <div class="flex items-baseline gap-6">
      <h1 className="text-gray-400 text-2xl font-bold">
        {name} <span className="text-gray-500">is available</span>
      </h1>
      <Link href={`/register/${name}`}>
        <Button
          onClick={async () => {
            try {
              let res = await query({
                cadence: Scripts.LOOKUP_NAME,
                args: (arg, t) => [arg(did, t.String)],
              });
              console.log("seems like it's registered", res);
            } catch (err) {
              // good to go!
              console.log("not registered yet!");
            }
          }}
        >
          Register
        </Button>
      </Link>
    </div>
  );
};

const EmptyState = () => {
  let [text, setText] = useState("");
  let [did, setDID] = useState("");
  let [error, seterror] = useState(null);
  let placeholder = "Your username";

  useEffect(async () => {
    try {
      let did = getDID(text);
      setDID(did);

      try {
        let res = await query({
          cadence: Scripts.LOOKUP_NAME,
          args: (arg, t) => [arg(did, t.String)],
        });
        console.log(`${text}`, res);
        seterror(`Whoa! You found ${text} (registered)`);
      } catch (err) {
        // good to go!
        console.log(`${text} - not registered yet!`);
        seterror(null);
      }
    } catch (e) {
      if (text.includes(" ")) {
        seterror("FlowNames says: no spaces!");
      } else {
        seterror("Uh-oh! something went wrong.. try again?");
      }
    }
  }, [text]);

  return (
    <div className="flex flex-col items-center gap-8">
      <h1 className="text-green-300 leading-relaxed text-right text-6xl font-bold">
        Your DID <br />
        Starts here
      </h1>
      <p className="text-green-300 leading-relaxed text-lg font-bold">
        You can register any ENS address, and also special ones!
      </p>
      <form
        className="w-full rounded p-4 flex items-center gap-4"
        autoComplete="off"
      >
        <div className="w-full" style={{ flexGrow: 1 }}>
          <TextBox
            error={error}
            placeholder={placeholder}
            key={placeholder}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          ></TextBox>
        </div>
      </form>

      {error ? (
        <div class="flex flex-col items-end">
          <p className="text-gray-400 font-bold">{error}</p>
        </div>
      ) : (
        <RegistrationPanel name={text} did={did} />
      )}
    </div>
  );
};

export default function Home() {
  const { user, loggedIn, logIn, logOut } = useAuth();
  const [names, setNames] = useState(null);

  useEffect(async () => {
    try {
      let res = await query({
        cadence: Scripts.LIST_MY_NAMES,
        args: (arg, t) => [arg(user?.addr, t.Address)],
      });
      setNames(res);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <Layout title="Welcome to FlowNames">
      <main
        id="start-of-content"
        className="w-full mx-auto mt-6 mb-16 sm:mt-8 px-2.5 lg:px-7 max-w-screen-md pb-4"
      >
        <EmptyState />
        <div className="m-6"/>
        {names && <NameList names={names} />}
      </main>
    </Layout>
  );
}
