import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Header({
  photo,
  email,
  phone,
}: {
  photo?: string;
  email?: string;
  phone?: string;
}) {
  const logOut = () => {
    signOut({ callbackUrl: "/" });
  };
  console.log("emaul", phone);
  return (
    <header className="flex flex-col xs:flex-row justify-between items-center w-full mt-3 border-b pb-7 sm:px-4 px-2 border-gray-500 gap-2">
      <Link href="/dream" className="flex space-x-2 ">
        <Image
          alt="logo"
          src="/decorion.png"
          className="cursor"
          width={150}
          height={70}
        />
      </Link>
      {(email && (
        <div className="flex items-center con">
          <ul className="menuu">
            <li>{email}</li>
            <li>
              <Link
                href="/dashboard"
                className=" hover:text-blue-400 transition"
              >
                <div>Dashboard</div>
              </Link>
            </li>

            <li
              className=" hover:text-blue-400 transition cursor-pointer"
              onClick={logOut}
            >
              Sign Out
            </li>
          </ul>

          {photo ? (
            <Image
              alt="Profile picture"
              src={photo}
              className="w-10 rounded-full makeFloat"
              width={32}
              height={28}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white makeFloat" />
          )}
        </div>
      )) ||
        (phone && (
          <div className="flex items-center con">
            <ul className="menuu">
              <li>{phone}</li>
              <li>
                <Link
                  href="/dashboard"
                  className=" hover:text-blue-400 transition"
                >
                  <div>Dashboard</div>
                </Link>
              </li>

              <li
                className=" hover:text-blue-400 transition cursor-pointer"
                onClick={logOut}
              >
                Sign Out
              </li>
            </ul>

            {photo ? (
              <Image
                alt="Profile picture"
                src={photo}
                className="w-10 rounded-full makeFloat"
                width={32}
                height={28}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white makeFloat" />
            )}
          </div>
        )) || (
          <Link
            className="flex max-w-fit items-center justify-center space-x-2 rounded-lg border border-blue-600 text-white px-5 py-2 text-sm shadow-md hover:bg-blue-400 bg-blue-600 font-medium transition"
            href="/dream"
          >
            <p>Sign Up </p>
          </Link>
        )}
    </header>
  );
}
