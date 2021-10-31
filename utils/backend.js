import { query, verifyUserSignatures } from '@onflow/fcl'
import { Scripts } from '../utils/flow'

/*
  this is our very simple implementation of server-side logic.

  For authentication purposes, the server should store a record
  of claims by users (login attempts) and the issued challenges.

  This will be used to check any client responses!
*/
let challengeToName = {}

/*
  As the first step in auth flow, the server will send a challenge to the user

  Normally, the user will say: "I want to sign in as xyz.foo"
  We then generate something - the challenge - for the user to try to verify
  - Make sure to include a nonce, to avoid replay attacks
*/

export function signIn({ name }) {
  let c = `Do you want to sign in as ${name}?`
  const hexMessage = Buffer.from(c).toString("hex");
  challengeToName[hexMessage] = name;
  return { challenge: hexMessage }
}

/*
  The client will pass along the compositeSignatures, as well as the nonce (e.g. challenge)
  that was given.

  This logic is meant to run on a server. If verified, the server should generate a new Token
  in the form of a JWS - this would be similar to what the client would get from Google after
  verification.
*/
export async function getServerResponse(challenge, compositeSignatures) {
  if (!compositeSignatures) return;

  try {
    let verified = await verifyUserSignatures(challenge, compositeSignatures);
    if (!verified) return false;

    let name = challengeToName[challenge]
    let address = compositeSignatures[0]?.addr;
    let res = await query({
      cadence: Scripts.AUTHORIZED_ON_NAME,
      args: (arg, t) => [arg(address, t.Address), arg(name, t.String)]
    })
    console.log('[server] Valid token:', res)
    if (!res) return false;
  } catch (error) {
    console.log(error)
    return false;
  }

  return true;
}