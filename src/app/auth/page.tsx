"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function AuthPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleAuthRedirect = useCallback(
    (event: AuthChangeEvent, session: Session | null) => {
      if (session) {
        router.push("/");
      }
    },
    [router]
  );

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(handleAuthRedirect);

    return () => {
      data.subscription.unsubscribe();
    };
  }, [handleAuthRedirect, supabase]);

  return (
    <div className="max-w-lg mx-auto">
      <Auth
        supabaseClient={supabase}
        providers={[]}
        appearance={{ theme: ThemeSupa }}
        theme="dark"
      />
    </div>
  );
}
