import Layout from "./Layout";
import Button from "./Button";

export default function LoginScreen({ loginFn }) {
  return (
    <Layout>
      <main
        id="start-of-content"
        className="w-full mx-auto mt-6 mb-16 sm:mt-8 px-2.5 lg:px-7 max-w-screen-md"
      >
        <div className="flex justify-between px-2.5 lg:px-0 items-center">
          <div className="text-xl leading-loose">
            FlowNames is the easiest, sleekest <br /> decentralized identity
            provider.
          </div>
          <Button onClick={() => loginFn()}>Get Started</Button>
        </div>
      </main>
    </Layout>
  );
}
