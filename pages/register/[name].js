import Head from 'next/head'
import BackgroundGradient from '../../components/background/Gradient'
import Header from '../../components/background/Header'
import Button from '../../components/Button'
import DivButton from '../../components/DivButton'
import { useState } from 'react'
import { useRouter } from 'next/router'
import * as Dialog from '@radix-ui/react-dialog';
import { styled, keyframes } from '@stitches/react'


const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 0.25 },
});

const StyledOverlay = styled(Dialog.Overlay, {
  backgroundColor: 'black',
  opacity: 0.25,
  position: 'fixed',
  inset: 0,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
});

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});

const StyledContent = styled(Dialog.Content, {
  backgroundColor: 'white',
  borderRadius: 6,
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '450px',
  maxHeight: '85vh',
  padding: 25,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
    willChange: 'transform',
  },
  '&:focus': { outline: 'none' },
});

let prettyName = {
  profilePic: 'Profile Picture',
  website: 'Website',
  twitterProfile: 'Twitter'
}

const Metadata = ({ m, remove }) => {
  console.log(m)
  let { type, uri, updatedAt } = m;
  let relativeDate = updatedAt;
  // TODO: import date-fns
  // Fri, June 11, 2021, 8:15:09 AM

  return (
    <div key={m.type} className="flex flex-col lg:flex-row lg:items-center w-full bg-white rounded-2xl transition shadow-slight hover:shadow-lg backdrop-filter backdrop-blur-3xl p-8 lg:p-10 mt-4">
      <div className="flex items-center mr-auto">
        <img className="h-14 w-14 mr-6 lg:mr-8" src="/img/avatars/1.png" alt="Project Avatar of 8a71da08-6c11-47ab-a25a-24f4b2ebec58" />
        <div className="flex flex-col">
          <h4 className="font-medium text-xl">{prettyName[type] || type}</h4>
          <p className="text-gray-400">{uri}</p>
        </div>
      </div>
      <button className="transition inline-block focus-visible:ring-2 focus-visible:ring-black focus:outline-none py-2.5 px-6 text-base text-gray-600 font-medium rounded-lg hover:shadow-lg lg:order-last lg:ml-5 mt-8 lg:mt-0 bg-red-100" onClick={remove}>Delete</button>

      {updatedAt && <p className="text-gray-400 text-sm text-center lg:ml-auto mt-4 lg:mt-0">Last updated <span title={updatedAt}>{relativeDate}</span></p>}
    </div>
  )
}

const MetadataDialog = ({ preset }) => {
  let { description, fields, name, onSet } = preset
  const [text, setText] = useState(fields.map(i => ""))


  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <DivButton>{name}</DivButton>
      </Dialog.Trigger>
      <StyledOverlay />
      <StyledContent>
        <Dialog.Title className="font-semibold">{name}</Dialog.Title>
        <Dialog.Description className="text-gray-500 font-light mt-2 mb-6">{description}</Dialog.Description>
        {
          fields.map(({ name, placeholder }, i) => (
            <fieldset className="flex gap-4 items-center" key={i}>
              <label className="font-light text-gray-300 uppercase">{name}</label>
              <input className="appearance-none border-2 border-blue-50 rounded p-2 text-green-300 font-semibold leading-tight focus:outline-none focus:shadow-outline w-full placeholder-opacity-25" type="text" placeholder={placeholder} value={text[i]} onChange={e => {
                let c = [...text];
                c[i] = e.target.value;
                setText(c)
              }} />
            </fieldset>
          ))
        }
        <Dialog.Close className="flex mt-4 justify-end w-full">
          <DivButton onClick={() => {
            onSet(text)
          }}>
            Save changes
          </DivButton>
        </Dialog.Close>
      </StyledContent>
    </Dialog.Root>
  );
}

export default function Home({ data }) {
  const router = useRouter()
  const { name } = router.query

  let [metadata, setMeta] = useState([])
  const addMetadata = (type, data) => {
    setMeta([...metadata, { type, ...data }])
  }

  let presets = [
    {
      name: 'Twitter',
      description: "Public Twitter URL",
      fields: [
        { name: 'url', placeholder: 'e.g. https://twitter.com/xLootProject' }
      ],
      onSet: ([uri]) => {
        addMetadata('twitterProfile', { uri })
      }
    },
    {
      name: 'Website',
      description: "Set the homepage for this DID",
      fields: [
        { name: 'url', placeholder: 'e.g. https://google.com' }
      ],
      onSet: ([uri]) => {
        addMetadata('website', { uri })
      }
    },
    {
      name: 'Profile Picture',
      description: "URL of your profile pic",
      fields: [
        { name: 'url', placeholder: 'e.g. https://source.unsplash.com/random/50x50' }
      ],
      onSet: ([uri]) => {
        addMetadata('profilePic', { uri })
      }
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{name} - Create</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BackgroundGradient />
      <Header />

      <main id="start-of-content" className="w-full mx-auto mt-6 mb-16 sm:mt-8 px-2.5 lg:px-7 max-w-screen-md">
        <div className="flex justify-start gap-2 items-baseline">
          <span className="text-green-300 text-4xl">{name}</span>
          <h1 className="text-gray-700 text-2xl font-normal mr-auto">will be your new ID</h1>
          <Button onClick={() => {

          }}>Create!</Button>
        </div>
        <div className="flex justify-center gap-2 items-baseline mt-8">
          <h1 className="text-gray-500 text-lg font-medium mr-4">Want to add some metadata?</h1>
        </div>
        <div className="flex justify-center gap-2 items-baseline mt-2 mb-8">
          {presets.map((preset, i) => (
            <MetadataDialog preset={preset} key={i} />
          ))}
        </div>
        <div className="mt-4"><div>
          <div className="min-w-full">
            {metadata.map((m, idx) => (
              <Metadata m={m} key={idx} remove={() => {
                let c = [...metadata]
                c.splice(idx, 1)
                setMeta(c);
              }} />
            ))}
          </div>
        </div>
        </div>
      </main>
    </div>
  )
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`${process.env.API_NAME}/api/hello`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}
