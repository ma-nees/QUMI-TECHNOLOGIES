import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/manrope";
import "@fontsource-variable/space-grotesk";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import React, { Suspense, lazy } from "react";
const Global3DBackground = lazy(() => import("@/components/three/Global3DBackground"));
import { Button } from "@/components/ui/button";

function NotFoundComponent() {
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-start justify-center py-10">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 text-4xl font-bold">This page doesn't exist.</h1>
      <p className="mt-3 text-muted-foreground">It may have been moved, or the link may be incorrect.</p>
      <Button asChild className="mt-8">
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="container-site flex min-h-[60vh] flex-col items-start justify-center py-10">
      <h1 className="text-2xl font-bold">This page didn't load</h1>
      <p className="mt-2 text-muted-foreground">Something went wrong on our end. Please try again.</p>
      <div className="mt-6 flex gap-3">
        <Button
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Try again
        </Button>
        <Button variant="outline" asChild>
          <a href="/">Go home</a>
        </Button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "QUMI Technologies — Software, Cloud & Data Engineering from Nepal" },
      { name: "description", content: "QUMI Technologies is a Nepal-based technology partner building software, cloud, data and AI systems." },
      { name: "author", content: "QUMI Technologies" },
      { name: "theme-color", content: "#0047AB" },
      { property: "og:site_name", content: "QUMI Technologies" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preload", as: "style", href: appCss },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { ThemeProvider } from "next-themes";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const bare = pathname.startsWith("/admin") || pathname.startsWith("/auth");
  const [shouldLoad3D, setShouldLoad3D] = React.useState(false);

  useEffect(() => {
    const handleInteraction = () => setShouldLoad3D(true);
    
    // Load on first interaction
    window.addEventListener('scroll', handleInteraction, { once: true, passive: true });
    window.addEventListener('mousemove', handleInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', handleInteraction, { once: true, passive: true });
    
    // Fallback: load after 3.5 seconds regardless
    const timer = setTimeout(() => setShouldLoad3D(true), 3500);

    return () => {
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      clearTimeout(timer);
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
      {shouldLoad3D && (
        <Suspense fallback={null}>
          <Global3DBackground />
        </Suspense>
      )}
      <div className="relative z-10 flex min-h-screen flex-col bg-transparent pointer-events-none">
        <div className="pointer-events-auto flex-1 flex flex-col">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Skip to content
          </a>
          {!bare && <Header />}
          <main id="main" className="flex-1">
            <Outlet />
          </main>
          {!bare && <Footer />}
        </div>
      </div>
      <Toaster position="bottom-right" />
    </QueryClientProvider>
    </ThemeProvider>
  );
}
