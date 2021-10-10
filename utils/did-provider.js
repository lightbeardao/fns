import ThreeIdProvider from '3id-did-provider'
import * as fcl from "@onflow/fcl"

const USE_LOCAL = false;
const USE_DEV_WALLET = true;

const wallet_api = USE_DEV_WALLET ? "http://localhost:7001/fcl/authn" : "https://fcl-discovery.onflow.org/testnet/authn";
const node_api = USE_LOCAL ? "http://localhost:8080" : "https://access-testnet.onflow.org"

fcl.config()
  .put("env", "testnet")
  .put("accessNode.api", node_api)
  .put("discovery.wallet", wallet_api)
  .put("app.detail.title", "Test Harness")
  .put("app.detail.icon", "https://i.imgur.com/r23Zhvu.png")
  .put("service.OpenID.scopes", "email email_verified name zoneinfo")
  .put("0xFlowToken", "0x7e60df042a9c0868")


export const signMessage = async (msg) => {
  const MSG = Buffer.from(msg).toString("hex")
  try {
    let c = await fcl.currentUser().signUserMessage(MSG)
    return c
  } catch (error) {
    console.log(error)
  }
}

export const verifySignatures = async (message, compositeSignatures) => {
  try {
    const MSG = Buffer.from(message).toString("hex")
    return await fcl.verifyUserSignatures(MSG, compositeSignatures)
  } catch (error) {
    console.log(error)
  }
}

/*
   getEntropy reduces the message to a 32-byte array
*/
export const getEntropy = async (signedMessage) => {
  const compositeSignatures = signedMessage;
  const { signature } = compositeSignatures[0];
  return signature.slice(0, 32);
}

/* 
  getPermission is called with the following 
  
  {
    type: 'authenticate',
    origin: 'https://my.app.origin',
    payload: {
        paths: ['/path/1', '/path/2']
    }
  }
  
  If the user approves, the function should return the paths array. 
  If they decline, it will return an empty array
 
*/
const getPermission = async (request) => {
  console.log('getPermission', request);

  // allow everything
  return request.payload.paths
}

export async function getProvider(ceramic, signedMessage) {
  const authId = 'flowAuthentication';
  const authSecret = await getEntropy(signedMessage);
  console.log('authSecret', authSecret)

  const threeId = await ThreeIdProvider.create({
    getPermission,
    authSecret,
    ceramic,
    authId,
  })

  const provider = threeId.getDidProvider()
  return provider
}

export { fcl };