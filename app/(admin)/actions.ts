"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { login, logout } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function loginAction(_prev: unknown, formData: FormData) {
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    hdrs.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(`login:${ip}`, 5, 300_000)) {
    return { error: "Demasiados intentos. Espera 5 minutos." };
  }

  const password = formData.get("password") as string;
  const success = await login(password);

  if (!success) {
    return { error: "Invalid password" };
  }

  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin");
}
