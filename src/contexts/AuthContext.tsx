"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 브라우저 클라이언트를 한 번만 생성
  const supabase = React.useMemo(() => createClient(), []);

  useEffect(() => {
    const setData = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth State Change:", event, !!session);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    setData();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = {
    user,
    session,
    isLoading,
    signOut: async () => {
      await supabase.auth.signOut();
      // 로그아웃 후 홈으로 이동하거나 상태 초기화는 호출한 곳에서 처리하거나 여기서 처리
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
