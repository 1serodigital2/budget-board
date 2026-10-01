import { ButtonLink } from "../components/ui/Button";
import { EmptyState } from "../components/ui/States";

const NotFoundPage = () => (
  <EmptyState
    className="min-h-[60vh]"
    icon="explore_off"
    title="Page not found"
    description="The page you're looking for doesn't exist or has been moved."
    action={
      <ButtonLink to="/" icon="arrow_back" variant="secondary">
        Back to dashboard
      </ButtonLink>
    }
  />
);

export default NotFoundPage;
