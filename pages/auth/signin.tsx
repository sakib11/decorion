import { getProviders } from "next-auth/react";
import { useRouter } from "next/router";
export default function SignIn({ providers }: any) {
  // const { error } = useRouter().query;
  return (
    <>
      <h1>Login</h1>
      {/* Error message */}
      {/* {error && <SignInError error={error} />} */}
      {/* Login options */}
      {/* {Object.values(providers).map((provider: any) => (
        <div key={provider.name}>...</div>
      ))} */}
    </>
  );
}
// export async function getServerSideProps(context: any) {
//   return { props: { providers: await getProviders() } };
// }
