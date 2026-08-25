import { createFileRoute } from "@tanstack/react-router";

import { WatchChange } from "@/components/rooted/watch-change";

export const Route = createFileRoute("/tree/$id")({
  component: GuestTreeRoute,
});

function GuestTreeRoute() {
  const { id } = Route.useParams();
  return <WatchChange guestId={id} />;
}
