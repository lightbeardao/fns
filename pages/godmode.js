import {
  authenticate,
  currentUser,
  mutate,
  query,
  unauthenticate,
} from "@onflow/fcl";
import { useState } from "react";
import Button from "../components/Button";
import Form from "../components/Form";
import Layout from "../components/Layout";
import Status from "../components/Status";
import { useTxs } from "../providers/TransactionProvider";
import { getServerResponse, signIn } from "../utils/backend";
import { Scripts, Transactions } from "../utils/flow";

export default function Home() {
  const [status, setStatus] = useState({ message: "Welcome!" });
  const { addTx } = useTxs();

  const signMessage = async (hexMessage) => {
    try {
      let c = await currentUser().signUserMessage(hexMessage);
      return c;
    } catch (error) {
      setStatus({ err: error });
    }
  };

  const listMyNames = async (user) => {
    try {
      let res = await query({
        cadence: Scripts.LIST_MY_NAMES,
        args: (arg, t) => [arg(user?.addr, t.Address)],
      });
      setStatus({ message: "Open console to see the tokens you own!" });

      console.log("Tokens you own:");
      for (let [name, tokens] of Object.entries(res)) {
        console.log(name, tokens);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const submitFlowTx = async ({ cadence, args }) => {
    let transactionId = await mutate({
      cadence,
      args,
      limit: 100,
    });
    return addTx(transactionId);
  };

  const resolveFlowname = async (name) => {
    try {
      let res = await query({
        cadence: Scripts.LOOKUP_NAME,
        args: (arg, t) => [arg(name, t.String)],
      });

      setStatus({ message: "Open console to see name contents" });
      console.log("Contents of name", res);
      console.log("authSignatures", res.authSignatures);
    } catch (err) {
      setStatus({ err: `${name} is not registered yet :)` });
    }
  };

  const signInAs = async (name) => {
    let user = await currentUser().snapshot();
    console.log("Signing in...", name);
    try {
      let res = await query({
        cadence: Scripts.AUTHORIZED_ON_NAME,
        args: (arg, t) => [arg(user?.addr, t.Address), arg(name, t.String)],
      });
      setStatus({ message: `Signed in with token ${res}` });
    } catch (err) {
      setStatus({ err: `Can't sign in as ${name}` });
    }
  };

  const addSignature = async (name, id, signature) => {
    let { success, err } = await submitFlowTx({
      cadence: Transactions.ADD_SIGNATURE,
      args: (arg, t) => [
        arg(name, t.String),
        arg(id, t.String),
        arg(signature, t.String),
      ],
    });
    setStatus({ success, err, message: "Added signature" });
  };
  const removeSignature = async (name, signature) => {
    let { success, err } = await submitFlowTx({
      cadence: Transactions.REMOVE_SIGNATURE,
      args: (arg, t) => [arg(name, t.String), arg(signature, t.String)],
    });
    setStatus({ success, err, message: "Removed signature!" });
  };

  const registerName = async (name, id, signature, url) => {
    let { success, err } = await submitFlowTx({
      cadence: Transactions.REGISTER_NAME,
      args: (arg, t) => [
        arg(name, t.String),
        arg(id, t.String),
        arg(signature, t.String),
        arg(url, t.String),
      ],
    });
    setStatus({ success, err, message: `Registered ${name}` });
  };
  const resetCollection = async () => {
    let { success, err } = await submitFlowTx({
      cadence: Transactions.RESET_COLLECTION,
    });
    setStatus({ success, err, message: "Reset collection" });
  };
  const createCollection = async () => {
    let { success, err } = await submitFlowTx({
      cadence: Transactions.CREATE_COLLECTION,
    });
    setStatus({ success, err, message: "Created collection" });
  };

  return (
    <Layout>
      <main className="border rounded-2xl mx-auto max-w-xl p-4 flex flex-col gap-2">
        <Status status={status} />

        {/* <Button onClick={async () => {
          await createCollection()
        }} >Create Collection</Button>

        <Button onClick={async () => {
          await resetCollection()
        }}>Destroy collection</Button> */}

        <Form
          fields={[
            { placeholder: "name (e.g. alice.eth)" },
            { placeholder: "signature" },
            { placeholder: "content" },
          ]}
          title="Register a Flowname"
          callback={async ([name, signature, content]) => {
            let id = "default";
            await registerName(name, id, signature, content);
          }}
        >
          Register
        </Form>

        <Form
          fields={[
            { placeholder: "name you own (e.g. alice.eth)" },
            { placeholder: "key name (e.g. key-1)" },
            { placeholder: "signature" },
          ]}
          title="Add additional signature"
          callback={async ([name, id, signature]) => {
            await addSignature(name, id, signature);
          }}
        >
          Add Signature
        </Form>

        <Form
          fields={[
            { placeholder: "name you own (e.g. alice.eth)" },
            { placeholder: "signature to revoke" },
          ]}
          title="Revoke a signature"
          callback={async ([name, signature]) => {
            await removeSignature(name, signature);
          }}
        >
          Revoke
        </Form>

        <Form
          fields={[{ placeholder: "alice.eth" }]}
          title="Look up any FlowName"
          callback={async ([name]) => {
            await resolveFlowname(name);
          }}
        >
          Resolve
        </Form>

        <Form
          fields={[{ placeholder: "alice.eth" }]}
          title="Local Sign in"
          callback={async ([name]) => {
            await signInAs(name);
          }}
        >
          Sign in
        </Form>

        <Button
          onClick={async () => {
            await listMyNames(await currentUser().snapshot());
          }}
        >
          List my names
        </Button>

        <Button
          onClick={async () => {
            await authenticate();
            const cc = await currentUser().snapshot();
            console.log("Current user", cc);
            setStatus({ ...status, message: "Logged in" });
          }}
        >
          Get current user (or sign in)
        </Button>

        <Button
          onClick={async () => {
            await unauthenticate();
            setStatus({ ...status, message: "Logged out" });
          }}
        >
          Sign out
        </Button>

        <Form
          fields={[{ placeholder: "name (e.g. alice.eth)" }]}
          title="Full Sign in w/ Flowname"
          callback={async ([login]) => {
            // here, we pass "login" for interactivity
            // but actually, we should just pass in what we want to sign in as
            let { challenge } = await signIn({ name: login });
            let compositeSignatures = await signMessage(challenge);
            console.log("Signed", compositeSignatures);
            setStatus({ message: "Signed" });

            let loggedIn = await getServerResponse(
              challenge,
              compositeSignatures
            );
            console.log("Verified?", loggedIn);
            setStatus({
              message: `Verified? ${loggedIn} (Open console to see full logs)`,
            });
          }}
        >
          Login
        </Form>
      </main>
    </Layout>
  );
}
