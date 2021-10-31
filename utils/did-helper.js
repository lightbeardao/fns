import namehash from 'eth-ens-namehash'

export function getDID(name) {
  let hash = namehash.hash(name)
  let did = `did:flow:${hash}`
  console.log(`\n\n[DID] Calculating hash for ${name}...`)
  console.log(`[DID] ${did}`)
  return did
}