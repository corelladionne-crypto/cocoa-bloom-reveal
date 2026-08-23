import { createFileRoute } from "@tanstack/react-router";

import { LocalTreeExperience } from "@/components/rooted/local-tree-experience";

export const Route = createFileRoute("/tree/$id")({
  component: GuestTreeRoute,
});

function GuestTreeRoute() {
  const { id } = Route.useParams();
  return <LocalTreeExperience guestId={id} />;
}
