import Link from "next/link";

export default function Footer() {
  return (
    <footer className="h-16 sm:h-20 w-full sm:pt-2 pt-4 border-t mt-5 flex sm:flex-row flex-col items-center px-3 space-y-3 sm:mb-0 mb-3 border-gray-500">
      <div className="text-white" style={{ margin: "0 auto" }}>
        <p>© 2023 Decorion. Powered by Decorion</p>
      </div>
    </footer>
  );
}
