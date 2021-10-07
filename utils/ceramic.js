import { TileDocument } from '@ceramicnetwork/stream-tile'

export const getRewardSchema = async (ceramic) => {
  const schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Reward",
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "message": { "type": "string" }
    },
    "required": [
      "message",
      "title"
    ]
  }
  const metadata = {
    controllers: [ceramic.did.id] // this will set yourself as the controller of the schema
  }
  const rewardSchema = await TileDocument.create(ceramic, schema, metadata)
  return rewardSchema;
}

export const makeTile = async (ceramic, rewardSchema) => {
  return await TileDocument.create(
    ceramic,
    { title: 'hello', message: 'world!' },
    {
      controllers: [ceramic.did.id],
      family: 'Reward',
      schema: rewardSchema.commitId.toString(),
    },
  )
}
