import { useEffect, useState } from "react";

export function PasswordInput({ email }: any) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [confirmPasswordIntialError, setConfirmPasswordIntialError] =
    useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const [showSubmit, setShowSubmit] = useState(false);

  type dataKey = "email" | "name" | "password";

  const saveName = async (data: Record<dataKey, string>) => {
    setIsLoading(true);
    const { email, name, password } = data;

    const res = await fetch("/api/save-name", {
      method: "POST",
      body: JSON.stringify({ email, name, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.status === 200) {
      window.location.replace("/dream");
    } else {
      window.location.replace("/auth/email-sign-up");
    }
  };

  const onChangeNameHandler = (val: string) => {
    setName(val);

    if (val.length < 3) {
      setNameError(true);
    } else {
      setNameError(false);
    }
  };

  const onChangePasswordHandler = (val: string) => {
    setPassword(val);

    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!re.test(val)) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const onChangeConfirmPasswordHandler = (val: string) => {
    if (password !== val) {
      setConfirmPasswordError(true);
      setConfirmPasswordIntialError(true);
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordIntialError(false);
    }
  };

  useEffect(() => {
    if (!nameError && !passwordError && !confirmPasswordIntialError) {
      setShowSubmit(true);
    } else {
      setShowSubmit(false);
    }
  }, [nameError, passwordError, confirmPasswordIntialError]);

  return (
    <form
      action=""
      onSubmit={async (event) => {
        event.preventDefault();
        await saveName({ email, name, password });
      }}
      className="formClass"
    >
      <div className="mb-10">
        <input
          type="text"
          placeholder="Enter Name"
          className="text-black extendedInput"
          onChange={(event) => onChangeNameHandler(event.target.value)}
        />
      </div>
      {nameError && (
        <div className="errormsg nameerror errormsgcolor">Invalid Name</div>
      )}
      <div className="mb-10">
        <input
          type="text"
          placeholder="Enter Password"
          className="text-black extendedInput"
          onChange={(event) => onChangePasswordHandler(event.target.value)}
        />
      </div>
      {passwordError && (
        <div className="errormsg passworderror errormsgcolor">
          Invalid Password
        </div>
      )}

      <div className="mb-10">
        <input
          type="text"
          placeholder="Confirm Password"
          className="text-black extendedInput"
          onChange={(event) =>
            onChangeConfirmPasswordHandler(event.target.value)
          }
        />
      </div>
      {confirmPasswordError && (
        <div className="errormsg cpassworderror errormsgcolor">
          Invalid confirm Password
        </div>
      )}

      <div>
        {!showSubmit && !isLoading && (
          <button
            disabled
            type="submit"
            className="py-2.5 px-5 mr-2  text-sm font-medium text-gray-900 bg-white rounded border border-gray-200  dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center opacity-50 cursor-not-allowed"
          >
            Submit
          </button>
        )}

        {showSubmit && !isLoading && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Submit
          </button>
        )}

        {isLoading && (
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
    </form>
  );
}
