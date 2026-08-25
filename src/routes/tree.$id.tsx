import { createFileRoute } from "@tanstack/react-router";

import { SeedOfChange } from "@/components/rooted/seed-of-change";

export const Route = createFileRoute("/tree/$id")({
  component: GuestTreeRoute,
  head: () => ({
    meta: [
      { title: "Your Seed — ASU Changing Futures" },
      {
        name: "description",
        content: "Your Palo Verde seed, its roots and the Changing Futures stories that grow from them.",
      },
      { property: "og:title", content: "Your Seed — ASU Changing Futures" },
      { property: "og:description", content: "A seed can change a future. The future is ours to change." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function GuestTreeRoute() {
  const { id } = Route.useParams();
  return <SeedOfChange guestId={id} />;
}
