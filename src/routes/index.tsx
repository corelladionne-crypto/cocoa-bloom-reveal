import { createFileRoute } from "@tanstack/react-router";

import { SeedOfChange } from "@/components/rooted/seed-of-change";

export const Route = createFileRoute("/")({
  component: HomeRoute,
  head: () => ({
    meta: [
      { title: "Plant the Seed of Change — ASU Changing Futures" },
      {
        name: "description",
        content:
          "A Palo Verde seed becomes roots, stories and a desert tree — the digital continuation of the ASU Changing Futures seed package.",
      },
      { property: "og:title", content: "Plant the Seed of Change — ASU Changing Futures" },
      {
        property: "og:description",
        content: "From seed to Palo Verde: access, learning, opportunity, community and impact.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function HomeRoute() {
  return <SeedOfChange guestId="home" />;
}
