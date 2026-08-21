import { createFileRoute } from "@tanstack/react-router";
import { getTree } from "@/lib/tree.server";
import { RootedExperience } from "@/routes/index";

export const Route = createFileRoute("/tree/$id")({
  loader: ({ params }) => getTree({ data: { id: params.id } }),
  component: TreeRoute,
});

function TreeRoute() {
  const tree = Route.useLoaderData();
  const { id } = Route.useParams();
  return <RootedExperience guestId={id} existingTree={tree} />;
}
