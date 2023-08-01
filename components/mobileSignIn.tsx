import { signIn } from "next-auth/react";
import { Fragment, useState } from "react";
import { StartVerification } from "./StartVerification";
import { EnterVerificationCode } from "./CheckVerification";
import Link from "next/link";

export function MobileAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [serverError, setSeverError] = useState(false);

  const onChangeEmailInputHandler = (val: string) => {
    setSeverError(false);
    setEmail(val);
  };

  const onChangePasswordInputHandler = (val: string) => {
    setSeverError(false);
    setPassword(val);
  };

  const startVerification = async ({
    email,
    password,
  }: Record<string, string>) => {
    setIsLoading(true);

    signIn("credentials", {
      email,
      password,
      redirect: false,
    }).then(({ ok, error }: any) => {
      if (ok) {
        window.location.replace("/dream");
      } else {
        console.log("dfg", error);
        setSeverError(true);
        setIsLoading(false);

        // toast("Credentials do not match!", { type: "error" });
      }
    });
  };

  return (
    <div className="h-[310px] flex flex-col items-center space-y-6 max-w-[670px] -mt-15">
      <div className=" mts">Or</div>
      <div className="max-w-xl text-white mts">Sign in with email</div>
      <form
        action=""
        onSubmit={async (event) => {
          event.preventDefault();
          await startVerification({ email, password });
        }}
        className="formClass loginFormClass"
      >
        <div className="mb-5">
          <input
            type="email"
            placeholder="Enter Email"
            required
            className="text-black extendedInput"
            onChange={(event) => onChangeEmailInputHandler(event.target.value)}
          />
        </div>

        <div className="mb-5">
          <input
            type="password"
            required
            placeholder="Enter Password"
            className="text-black extendedInput"
            onChange={(event) =>
              onChangePasswordInputHandler(event.target.value)
            }
          />
        </div>

        {serverError && (
          <div className="errormsg signinerrmsg">Invalid credentials</div>
        )}

        <div className="mt-10">
          {serverError === true && isLoading === false && (
            <button
              disabled
              className="bg-blue-500  text-white font-bold py-2 px-4 rounded cursor-not-allowed disabled:opacity-75"
              type="submit"
            >
              Login
            </button>
          )}

          {serverError === false && isLoading === false && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Login
            </button>
          )}

          {!serverError && isLoading === true && (
            // <button
            //   className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            //   type="submit"
            // >
            //   Continue with Email
            // </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              <svg
                aria-hidden="true"
                role="status"
                className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="#1C64F2"
                ></path>
              </svg>
              Loading...
            </button>
          )}
        </div>

        <div className="mt-4">
          <span>Don't remember password? </span>
          <Link
            href="/auth/reset-password"
            className=" bg-blue-500  text-white font-bold py-1 px-1 rounded"
          >
            Reset Password
          </Link>
        </div>

        <div className="mt-4">
          <span>Don't have an account? </span>
          <Link
            href="/auth/email-sign-up"
            className=" bg-blue-500  text-white font-bold py-1 px-1 rounded"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
