import { useState } from "react"
import Button from './Button'
import * as Collapsible from '@radix-ui/react-collapsible'

export default function Card({ name, signatures }) {
  let url = `/${name}`
  const [open, setOpen] = useState(false);
  let c = signatures?.length;

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="min-w-full flex flex-col w-full bg-white rounded-2xl transition shadow-slight hover:shadow-lg backdrop-filter backdrop-blur-3xl p-4 lg:p-8 mt-4">
      <div className="flex flex-col lg:flex-row lg:items-center" href={url}>
        <div className="flex items-center">
          <img className="h-14 w-14 mr-6 lg:mr-8" src="/img/avatars/1.png" alt="Project Avatar of 8a71da08-6c11-47ab-a25a-24f4b2ebec58" />
          <div>
            <h4 className="font-medium text-xl">{name}</h4>
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
        <div className="p-4 flex items-baseline justify-between max-w-md mx-auto border-b-2 border-green-200">
          <div className="text-green-900">{c == 1 ? "1 signature" : `${c} signatures`}</div>
          <Button>Add New</Button>
        </div>

        {signatures.map(s => (
          <div className="p-4 flex items-baseline justify-between max-w-sm mx-auto">
            <div>{s}</div>
            <Button>Remove</Button>
          </div>
        ))}
      </Collapsible.CollapsibleContent>
    </Collapsible.Root >
  )
}