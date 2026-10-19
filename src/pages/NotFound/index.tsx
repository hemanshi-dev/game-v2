import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <h1 className="text-5xl font-extrabold text-blue-600 sm:text-6xl ">
        404
      </h1>
      <h2 className="mt-4 text-xl font-bold text-gray-900 sm:text-2xl ">
        Page Not Found
      </h2>
      <p className="mt-2 text-xs text-gray-600 sm:text-sm ">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:bg-blue-800"
      >
        Back to Home
      </Link>
    </div>
  );
}
