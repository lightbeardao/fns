//@ts-check

import { mutate, query } from "@onflow/fcl";
import Link from "next/link";
import { useState } from "react";
import Form from "../components/Form";
import Layout from "../components/Layout";
import Status from "../components/Status";
import { useTxs } from "../providers/TransactionProvider";
import { getDID, parseDID, uploadMetadata } from "../utils/did-helper";
import { Scripts, Transactions } from "../utils/flow";

export default function Home() {
  const [status, setStatus] = useState({});
  const { addTx } = useTxs();

  const resolveFlowname = async (name) => {
    try {
      let res = await query({
        cadence: Scripts.LOOKUP_NAME,
        args: (arg, t) => [arg(name, t.String)],
      });
      return res;
    } catch (err) {
      console.info(`[FlowNames] ${name} is not registered yet :)`);
    }
  };

  // Create a DID
  // 1. Store data on IPFS
  // 2. Create FlowName with id: default, signature: (publicKey),
  // and content: pointer to data
  const registerDid = async (name, metadata) => {
    let cid = await uploadMetadata(metadata);
    let embeddedContent = JSON.stringify({
      type: "ipfs",
      cid,
    });

    let transactionId = await mutate({
      cadence: Transactions.REGISTER_DID,
      args: (arg, t) => [arg(name, t.String), arg(embeddedContent, t.String)],
      limit: 100,
    });

    let res = await addTx(transactionId);
    setStatus({
      ...res,
      message: `Congrats! You now have ${name}!`,
    });
  };

  // Updating a DID
  // 1. Store data on IPFS
  // 2. Update pointer in Flow
  const updateMetadata = async (name, metadata) => {
    let cid = await uploadMetadata(metadata);
    console.log("[FlowNames] Storing IPFS pointer on Flow");
    let embeddedContent = JSON.stringify({
      type: "ipfs",
      cid,
    });

    let transactionId = await mutate({
      cadence: Transactions.CHANGE_DOCUMENT,
      args: (arg, t) => [arg(name, t.String), arg(embeddedContent, t.String)],
      limit: 100,
    });

    let { success, err } = await addTx(transactionId);
    setStatus({
      success,
      err,
      message: `Congrats! You updated ${name}`,
    });
  };

  return (
    <Layout title="ipfs">
      <main className="border rounded-2xl mx-auto max-w-xl p-4 flex flex-col gap-2">
        <Status status={status} />
        <Form
          fields={[{ placeholder: "ENS-type name (e.g. alice.flow)" }]}
          title="Resolve DID"
          callback={async ([name]) => {
            let did = getDID(name);
            let res = await resolveFlowname(did);
            let doc = await parseDID(res);
            console.log(`${name} => resolved DID Document`, doc);
            setStatus({ message: `Resolved ${name} (check the console!)` });
          }}
        >
          Resolve DID
        </Form>

        <Form
          fields={[{ placeholder: "ENS-type name (e.g. alice.flow)" }]}
          title="Register DID"
          callback={async ([name]) => {
            let did = getDID(name);
            await registerDid(did, { services: [] });
          }}
        >
          Register
        </Form>

        <Form
          fields={[
            { placeholder: "ENS-type name (e.g. alice.flow)" },
            { placeholder: "metadata (has to be valid JSON)" },
          ]}
          title="Set Metadata"
          callback={async ([name, content]) => {
            let did = getDID(name);
            try {
              // check that it parses
              let metadata = JSON.parse(content);
              await updateMetadata(did, metadata);
            } catch {
              console.error("Please double check your metadata");
            }
          }}
        >
          Save IPFS Content
        </Form>

        <Link href="/">
          <a className="text-lg mt-4 p-2 text-indigo-600 hover:text-indigo-400">
            Alright. Ready to log in with your DID?
          </a>
        </Link>
      </main>
    </Layout>
  );
}
