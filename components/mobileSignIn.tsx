import { signIn } from "next-auth/react";
import { Fragment, useState } from "react";
import { StartVerification } from "./StartVerification";
import { EnterVerificationCode } from "./CheckVerification";

export function MobileAuth() {
  const [hasStartedVerification, setHasStartedVerification] = useState(false);
  const [error, setError] = useState(false);
  const [credentials, setCredentials] = useState({});
  const startVerification = async ({ phone }: Record<string, any>) => {
    await fetch("/api/start-verification", {
      method: "POST",
      body: JSON.stringify({ phone }),
      headers: { "Content-Type": "application/json" },
    });
    setCredentials({ phone });
    setHasStartedVerification(true);
  };
  const checkVerification = async ({
    verificationCode,
  }: Record<string, any>) => {
    signIn("credentials", {
      ...credentials,
      verificationCode,
      redirect: false,
    }).then(({ ok, error }: any) => {
      if (ok) {
        window.location.replace("/dream");
      } else {
        console.log("dfg", error);
        setError(true);
        // toast("Credentials do not match!", { type: "error" });
      }
    });
  };
  return (
    <div className="h-[250px] flex flex-col items-center space-y-6 max-w-[670px] -mt-8">
      <div className="max-w-xl text-white">Sign in With mobile</div>
      {!hasStartedVerification ? (
        <StartVerification onSubmit={startVerification} />
      ) : (
        <EnterVerificationCode
          onSubmit={checkVerification}
          error={error}
          setError={setError}
        />
      )}
      <div className="errorVerification">
        {error && <p>Code didn't match. Pls try again </p>}
      </div>
    </div>
  );
}
