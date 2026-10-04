import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Field } from "@/components/site/Field";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff sign in — QUME Technologies" },
      { name: "description", content: "Sign in to the QUME Technologies admin area." },
      { property: "og:title", content: "Staff sign in — QUME Technologies" },
      { property: "og:description", content: "Admin access for QUME Technologies staff." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [msg, setMsg] = useState<{ kind: "err" | "ok"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    setBusy(true);
    setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg({ kind: "err", text: error.message });
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      setBusy(false);
      if (error) return setMsg({ kind: "err", text: error.message });
      setMsg({ kind: "ok", text: "Check your email to confirm your account. An existing admin must then grant you access." });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link to="/"><Logo /></Link>
        <h1 className="mt-10 text-2xl font-bold">{mode === "in" ? "Staff sign in" : "Create staff account"}</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Field label="Email" name="email" type="email" required autoComplete="email" />
          <Field label="Password" name="password" type="password" required minLength={8} autoComplete={mode === "in" ? "current-password" : "new-password"} />
          {msg && <p role="alert" className={msg.kind === "err" ? "text-sm text-destructive" : "text-sm text-primary"}>{msg.text}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={busy}>{busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}</Button>
        </form>
        <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-5 text-sm text-muted-foreground hover:text-primary">
          {mode === "in" ? "Need an account? Create one" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
