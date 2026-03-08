"use server";

import { redirect } from "next/navigation";
import { login, logout } from "@/lib/auth";

export async function loginAction(_prev: unknown, formData: FormData) {
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
