'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/axios";

export default function AdminProtegida({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await api.get("/usuario/info");
        if (res.data?.resposta?.role !== "admin") {
          router.replace("/");
        }
      } catch {
        router.replace("/");
      } finally {
        setLoading(false);
      }
    }
    checkAdmin();
  }, [router]);

  if (loading) return null;

  return children;
}