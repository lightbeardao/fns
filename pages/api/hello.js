// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  const data = { name: 'John doe' }
  res.status(200).json(JSON.stringify(data))
}
