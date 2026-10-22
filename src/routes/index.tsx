import { createFileRoute } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Appearance | Site preferences" },
      { name: "description", content: "Choose your light or dark appearance preference." },
      { property: "og:title", content: "Appearance | Site preferences" },
      { property: "og:description", content: "Choose your light or dark appearance preference." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const { theme } = useTheme();
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <section aria-labelledby="appearance-heading" className="w-full max-w-xs">
        <h1 id="appearance-heading" className="text-xl font-semibold">Appearance</h1>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
          <span className="text-sm text-muted-foreground" aria-live="polite">{theme === "dark" ? "Dark mode" : "Light mode"}</span>
          <ThemeToggle />
        </div>
      </section>
    </main>
  );
}
