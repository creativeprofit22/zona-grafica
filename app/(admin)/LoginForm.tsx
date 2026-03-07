"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import styles from "./admin.module.css";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <div className={styles.loginPage}>
      <form action={action} className={styles.loginForm}>
        <h1 className={styles.loginTitle}>Douro Digital</h1>
        <p className={styles.loginSubtitle}>Admin Panel</p>

        {state?.error && <p className={styles.loginError}>{state.error}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className={styles.loginInput}
        />

        <button type="submit" disabled={pending} className={styles.loginButton}>
          {pending ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
