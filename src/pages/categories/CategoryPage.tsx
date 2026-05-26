import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import H1 from "../../components/ui/Heading";
import { getCategoryById } from "../../api/category";
import { useAuth } from "../../context/AuthContext";
import Alert from "../../components/ui/Alert";

const CategoryPage = () => {
  const { user } = useAuth();
  const params = useParams();
  const categoryId = params.id;
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories", categoryId],
    queryFn: () =>
      getCategoryById({ userId: user!.uid, categoryId: categoryId! }),
    enabled: !!user?.uid && !!categoryId,
  });

  if (isLoading) {
    return <Alert message="Loading category detail..." />;
  }

  if (isError) {
    return (
      <Alert
        type="error"
        message={error.message || "Unable to fetch category"}
      />
    );
  }

  if (!data) {
    return <Alert message="No category data available." />;
  }

  return (
    <>
      <H1>Category detail</H1>
      <div>Category name: {data.category}</div>
      <div>Color: {data.color}</div>
      <div>
        Creation date:{" "}
        {data.createdAt?.toDate
          ? data.createdAt.toDate().toLocaleDateString()
          : "No date"}
      </div>
    </>
  );
};

export default CategoryPage;
