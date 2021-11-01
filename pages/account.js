import { currentUser, query } from "@onflow/fcl";
import Link from "next/Link";
import { useEffect, useState } from "react";
import { UndrawAddUser } from "react-undraw-illustrations";
import Card from "../components/Card";
import Button from "../components/DivButton";
import Form from "../components/Form";
import Layout from "../components/Layout";
import { useAuth } from "../providers/AuthProvider";
import { getServerResponse, signIn } from "../utils/backend";
import { getDID } from "../utils/did-helper";
import { Scripts } from "../utils/flow";


const EmptyState = () => {
  return (
    <div className="flex flex-col items-center gap-8">
      <UndrawAddUser primaryColor="#6c68fb" height="250px" />
      <h1 className="text-gray-700 text-2xl font-bold">
        Cool, you have no names!
      </h1>
      <Link href="/register">
        <Button>Register your first name</Button>
      </Link>
    </div>
  );
};

export default function Home() {
  const { user, loggedIn, logIn, logOut } = useAuth();
  const [names, setNames] = useState(null);

  const signMessage = async (hexMessage) => {
    try {
      let c = await currentUser().signUserMessage(hexMessage);
      return c;
    } catch (error) {
      console.log(error);
    }
  };

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

  const Content = ({ names }) => (
    <>
      <div className="m-6" />

      <Form
        fields={[{ placeholder: "name (e.g. alice.eth)" }]}
        title="Sign in w/ Flowname"
        callback={async ([login]) => {
          // here, we pass "login" for interactivity
          // but actually, we should just pass in what we want to sign in as
          let { challenge } = await signIn({ name: login });
          let compositeSignatures = await signMessage(challenge);
          console.log("Signed", compositeSignatures);

          let loggedIn = await getServerResponse(
            challenge,
            compositeSignatures
          );
          console.log("Verified?", loggedIn);
        }}
      >
        Login
      </Form>

      <Form
        fields={[
          { placeholder: "ENS name used to create DID (e.g. alice.eth)" },
        ]}
        title="Sign in w/ DID"
        callback={async ([login]) => {
          // here, we pass "login" for interactivity
          // but actually, we should just pass in what we want to sign in as
          let did = getDID(login);
          let { challenge } = await signIn({ name: did });
          let compositeSignatures = await signMessage(challenge);
          console.log("Signed", compositeSignatures);

          let loggedIn = await getServerResponse(
            challenge,
            compositeSignatures
          );
          console.log("Verified?", loggedIn);
        }}
      >
        Login
      </Form>

      <div className="m-6" />

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

  return (
    <Layout title="Home">
      <main
        id="start-of-content"
        className="w-full mx-auto mt-6 mb-16 sm:mt-8 px-2.5 lg:px-7 max-w-screen-md"
      >
        {names ? <Content names={names} /> : <EmptyState />}
      </main>
    </Layout>
  );
}
