import { useParams, useNavigate } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";
import CategoryTabs from "./CategoryTabs";
import CategoryGames from "./CategoryGames";

export default function CategoriesPage() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const { categories, isLoading, error } = useCategories();

  // Derive selected category name directly from slug and categories
  const selectedCategoryName = (() => {
    if (!slug || slug.toLowerCase() === "all") return "All";
    if (categories.length > 0) {
      const matched = categories.find(
        (c) =>
          c.slug.toLowerCase() === slug.toLowerCase() ||
          c.name.toLowerCase() === slug.toLowerCase(),
      );
      if (matched) return matched.name;
    }
    return slug.charAt(0).toUpperCase() + slug.slice(1);
  })();

  const handleSelectCategory = (categoryName: string) => {
    if (!categoryName || categoryName.toLowerCase() === "all") {
      navigate("/category/all");
    } else {
      const matched = categories.find(
        (c) => c.name.toLowerCase() === categoryName.toLowerCase(),
      );
      const targetSlug = matched ? matched.slug : categoryName.toLowerCase();
      navigate(`/category/${targetSlug}`);
    }
  };

  return (
    <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8">
      {/* 1. Page Heading & Supporting Text */}
      <div className="mb-4">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl ">
          {selectedCategoryName && selectedCategoryName.toLowerCase() !== "all"
            ? `${selectedCategoryName} Games`
            : "Browse Categories"}
        </h1>
        <p className="mt-1 text-xs text-gray-600 sm:text-sm ">
          Find your next favorite game from existing categories
        </p>
      </div>

      {/* 2. Category Tabs */}
      <CategoryTabs
        categories={categories}
        selectedCategoryName={selectedCategoryName}
        onSelectCategory={handleSelectCategory}
        isLoading={isLoading}
        error={error}
        onRetry={() => {}}
      />

      {/* 3. Category Games Grid & Pagination */}
      <CategoryGames categoryName={selectedCategoryName || "All"} />
    </div>
  );
}
