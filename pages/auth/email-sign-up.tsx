import Head from "next/head";
import Header from "../../components/Header";
import { signIn, useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import Image from "next/image";
import { EmailInput } from "../../components/auth/signup/EmailInput";
import { OTPInputComponent } from "../../components/auth/signup/OtpInput";
import { PasswordInput } from "../../components/auth/signup/PasswordInput";

export default function EmailSignUp() {
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");

  const updateStep = (value: number) => {
    setStep(value);
  };

  const updateEmail = (value: string) => {
    setEmail(value);
  };

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Decorion</title>
      </Head>
      <Header
        photo={session?.user?.image || undefined}
        email={session?.user?.email || undefined}
        phone={(session?.user as any)?.phone || undefined}
      />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
        <div className="flex flex-col items-center max-w-[670px]">
          <button
            onClick={() => signIn("google")}
            className="bg-gray-200 text-black font-semibold py-3 px-6 rounded-2xl flex items-center space-x-2"
          >
            <Image
              src="/google.png"
              width={20}
              height={20}
              alt="google's logo"
            />
            <span>Continue with Google</span>
          </button>
          <div className="mb-5 mt-5">Or</div>
        </div>

        {step === 1 && (
          <EmailInput
            updateStep={updateStep}
            updateEmail={updateEmail}
          ></EmailInput>
        )}

        {step === 2 && (
          <OTPInputComponent
            updateStep={updateStep}
            email={email}
          ></OTPInputComponent>
        )}

        {step === 3 && <PasswordInput email={email}></PasswordInput>}
      </main>
    </div>
  );
}
