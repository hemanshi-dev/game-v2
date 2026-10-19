import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";

interface MobileSideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSideDrawer({
  isOpen,
  onClose,
}: MobileSideDrawerProps) {
  const { categories } = useCategories();

  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        role="button"
        tabIndex={isOpen ? 0 : -1}
        aria-label="Close menu overlay"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " " || e.key === "Escape")
            onClose();
        }}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-2xs transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Side drawer */}
      <aside
        aria-label="Category Navigation"
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 max-w-[80vw] flex-col bg-white dark:bg-slate-900 shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4 dark:border-slate-800 sm:h-16 sm:px-6">
          <span className="text-base font-semibold text-gray-900 ">
            Categories
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 active:bg-gray-200 :bg-gray-800"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Categories list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/category/all"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center min-h-[44px] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100 active:bg-gray-200 :bg-gray-800 :bg-gray-700"
                  }`
                }
              >
                All Games
              </NavLink>
            </li>
            {categories.map((cat) => (
              <li key={cat._id || cat.slug}>
                <NavLink
                  to={`/category/${cat.slug}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center min-h-[44px] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-100 active:bg-gray-200 :bg-gray-800 :bg-gray-700"
                    }`
                  }
                >
                  {cat.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
