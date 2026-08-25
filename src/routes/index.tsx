import { createFileRoute } from "@tanstack/react-router";

import { WatchChange } from "@/components/rooted/watch-change";

export const Route = createFileRoute("/")({ component: HomeRoute });

function HomeRoute() {
  return <WatchChange guestId="home" />;
}
