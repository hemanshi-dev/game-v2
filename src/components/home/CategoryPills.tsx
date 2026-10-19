import { Link } from "react-router-dom";

const pills = [
  {
    name: "Action",
    color: "bg-red-500",
    path: "/category/action",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    name: "Adventure",
    color: "bg-green-600",
    path: "/category/adventure",
    icon: "M3 21l9-18 9 18H3zm9-13.5L7.5 18h9L12 7.5z",
  },
  {
    name: "Puzzle",
    color: "bg-purple-600",
    path: "/category/puzzle",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z",
  },
  {
    name: "Racing",
    color: "bg-blue-600",
    path: "/category/racing",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V8h2v4zm4 4h-2v-2h2v2zm0-4h-2V8h2v4z",
  },
  {
    name: "Sports",
    color: "bg-orange-500",
    path: "/category/sports",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-14h-2v4H7v2h4v4h2v-4h4V8h-4z",
  },
  {
    name: "Girls",
    color: "bg-pink-500",
    path: "/category/girls",
    icon: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  },
  {
    name: "Simulation",
    color: "bg-teal-600",
    path: "/category/simulation",
    icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm4-4H7v-2h9v2zm0-4H7V7h9v2z",
  },
  {
    name: "More",
    color: "bg-gray-500",
    path: "/categories",
    icon: "M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
  },
];

export default function CategoryPills() {
  return (
    <section className="px-4 py-2 lg:px-8">
      <div className="flex gap-4 overflow-x-auto pb-4 pt-2 [scrollbar-width:none]">
        {pills.map((p) => (
          <Link
            key={p.name}
            to={p.path}
            className={`flex min-w-[120px] flex-col items-center justify-center gap-2 rounded-2xl ${p.color} py-4 text-white shadow-sm transition-transform hover:scale-105 active:scale-95`}
          >
            <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
              <path d={p.icon} />
            </svg>
            <span className="text-[15px] font-bold">{p.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
