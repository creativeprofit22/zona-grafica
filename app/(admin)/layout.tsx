import { verifySession } from "@/lib/auth";
import AdminNav from "./AdminNav";
import { logoutAction } from "./actions";
import styles from "./admin.module.css";
import LoginForm from "./LoginForm";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authenticated = await verifySession();

  if (!authenticated) {
    return <LoginForm />;
  }

  return (
    <div className={styles.adminShell}>
      <nav className={styles.sidebar}>
        <p className={styles.sidebarBrand}>Zona Gráfica</p>
        <AdminNav />
        <div className={styles.sidebarSpacer} />
        <form action={logoutAction}>
          <button type="submit" className={styles.logoutButton}>
            Sign Out
          </button>
        </form>
      </nav>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
