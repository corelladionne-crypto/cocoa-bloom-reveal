import { createFileRoute } from "@tanstack/react-router";

import { getTree } from "@/lib/tree.server";
import { RootedExperience } from "./index";

export const Route = createFileRoute("/tree/$id")({
  staleTime: 0,
  loader: async ({ params }) => getTree({ data: { id: params.id } }),
  component: GuestTreeRoute,
});

function GuestTreeRoute() {
  const { id } = Route.useParams();
  const tree = Route.useLoaderData();

  return <RootedExperience guestId={id} existingTree={tree} />;
}
