import { useState } from "react"
import Button from './DivButton'
import * as Collapsible from '@radix-ui/react-collapsible'
import Table from './Table'

export default function Card({ name, signatures }) {
  let url = `/${name}`
  const [open, setOpen] = useState(false);
  let c = signatures?.length;

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} key={name} className="min-w-full flex flex-col w-full bg-white rounded-2xl transition shadow-slight hover:shadow-lg backdrop-filter backdrop-blur-3xl p-4 lg:p-8 mt-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6" href={url}>
        <div className="flex items-center">
          <img className="h-14 w-14 mr-6 lg:mr-8" src="/img/avatars/1.png" alt="Project Avatar of 8a71da08-6c11-47ab-a25a-24f4b2ebec58" />
          <div>
            <h4 className="font-medium text-xl truncate" style={{ maxWidth: '200px' }}>{name}</h4>
          </div>
        </div>
        <div className="order-last">
          <Collapsible.CollapsibleTrigger>
            <Button>View</Button>
          </Collapsible.CollapsibleTrigger>
        </div>
        <p className="text-gray-400 text-sm text-center lg:ml-auto mt-4 lg:mt-0">Last updated <span title="Fri, June 11, 2021, 8:15:09 AM">4 mo. ago</span></p>
      </div>

      <Collapsible.CollapsibleContent className="mt-6" style={{ position: 'initial' }}>
        <Table fields={
          [{ name: "Signature" }, { name: "Status" }, { name: "Role" }, { name: "+ new", fn: () => console.log("Add new") }]
        } data={
          signatures.map(({ id, signature }) => ({
            id,
            signature,
            status: 'Active', role: 'Admin', functions: {
              remove: () => { console.log("Remove", signature) },
            }
          }))
        } />

      </Collapsible.CollapsibleContent>
    </Collapsible.Root >
  )
}