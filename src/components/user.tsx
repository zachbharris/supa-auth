"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AuthChangeEvent, Session, type User } from "@supabase/supabase-js";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface Props {
  initialUser?: User | null;
}

export default function User({ initialUser }: Props) {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null | undefined>(initialUser);
  const [profile, setProfile] = useState();

  const handleAuthStateChange = useCallback(
    (event: AuthChangeEvent, session: Session | null) => {
      switch (event) {
        case "INITIAL_SESSION":
          setUser(session?.user);
          break;
        case "SIGNED_OUT":
          setUser(null);
      }
    },
    []
  );

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      data.subscription.unsubscribe();
    };
  }, [supabase, handleAuthStateChange]);

  if (!user) {
    return <Link href="/auth">Sign in</Link>;
  }

  return (
    <div>
      <span>{user.email}</span>
      <br />
      <button
        className="px-4 py-2 rounded-md bg-purple-700"
        onClick={handleLogout}
      >
        logout
      </button>
    </div>
  );
}
