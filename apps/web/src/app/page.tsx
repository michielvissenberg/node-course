"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace(isAuthenticated() ? "/users" : "/login");
    router.replace(isAuthenticated() ? "/products" : "/login");
    router.replace(isAuthenticated() ? "/fridges" : "/login");
    router.replace(isAuthenticated() ? "/recipes" : "/login");
  }, [router]);
  return null;
}