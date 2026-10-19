const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white pt-6 pb-20 text-center text-xs text-gray-500 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500 lg:py-6">
      <div className="mx-auto w-full px-4">
        <p className="font-semibold text-gray-700 dark:text-slate-400">PlayRush</p>
        <p className="mt-1">
          &copy; {currentYear} PlayRush. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
