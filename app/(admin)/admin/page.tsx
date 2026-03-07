import DeviceDonutChart from "@/components/admin/charts/DeviceDonutChart";
import TopPagesBarChart from "@/components/admin/charts/TopPagesBarChart";
import ViewsLineChart from "@/components/admin/charts/ViewsLineChart";
import { db } from "@/lib/db";
import { pageViews } from "@/lib/schema";
import { count, desc, sql } from "drizzle-orm";
import styles from "../admin.module.css";

export const metadata = {
  title: "Admin — Douro Digital",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [
    totalResults,
    todayResults,
    uniquePagesResults,
    topReferrers,
    thisWeekResults,
    lastWeekResults,
    dailyViews,
    topPages,
    devices,
  ] = await Promise.all([
    db.select({ count: count() }).from(pageViews),
    db
      .select({ count: count() })
      .from(pageViews)
      .where(sql`${pageViews.createdAt} >= CURRENT_DATE`),
    db
      .select({ count: sql<number>`COUNT(DISTINCT ${pageViews.path})` })
      .from(pageViews),
    db
      .select({ referrer: pageViews.referrer, views: count() })
      .from(pageViews)
      .where(
        sql`${pageViews.referrer} IS NOT NULL AND ${pageViews.referrer} != ''`,
      )
      .groupBy(pageViews.referrer)
      .orderBy(desc(count()))
      .limit(1),
    db
      .select({ count: count() })
      .from(pageViews)
      .where(sql`${pageViews.createdAt} >= CURRENT_DATE - INTERVAL '7 days'`),
    db
      .select({ count: count() })
      .from(pageViews)
      .where(
        sql`${pageViews.createdAt} >= CURRENT_DATE - INTERVAL '14 days' AND ${pageViews.createdAt} < CURRENT_DATE - INTERVAL '7 days'`,
      ),
    db
      .select({
        date: sql<string>`DATE(${pageViews.createdAt})`.as("date"),
        views: count(),
      })
      .from(pageViews)
      .where(sql`${pageViews.createdAt} >= CURRENT_DATE - INTERVAL '30 days'`)
      .groupBy(sql`DATE(${pageViews.createdAt})`)
      .orderBy(sql`DATE(${pageViews.createdAt})`),
    db
      .select({ path: pageViews.path, views: count() })
      .from(pageViews)
      .groupBy(pageViews.path)
      .orderBy(desc(count()))
      .limit(10),
    db
      .select({ device: pageViews.device, views: count() })
      .from(pageViews)
      .groupBy(pageViews.device)
      .orderBy(desc(count())),
  ]);

  const [totalResult] = totalResults;
  const [todayResult] = todayResults;
  const [uniquePagesResult] = uniquePagesResults;
  const [topReferrer] = topReferrers;
  const [thisWeek] = thisWeekResults;
  const [lastWeek] = lastWeekResults;

  const trendPct =
    lastWeek.count > 0
      ? Math.round(((thisWeek.count - lastWeek.count) / lastWeek.count) * 100)
      : null;

  return (
    <>
      <h1>Dashboard</h1>
      <div className={styles.cardGrid}>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Total Views</p>
          <p className={styles.cardValue}>
            {totalResult.count.toLocaleString()}
            {trendPct !== null && (
              <span
                className={`${styles.cardTrend} ${trendPct >= 0 ? styles.cardTrendUp : styles.cardTrendDown}`}
              >
                {trendPct >= 0 ? "+" : ""}
                {trendPct}%
              </span>
            )}
          </p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Today</p>
          <p className={styles.cardValue}>
            {todayResult.count.toLocaleString()}
          </p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Unique Pages</p>
          <p className={styles.cardValue}>
            {uniquePagesResult.count.toLocaleString()}
          </p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardLabel}>Top Referrer</p>
          <p className={styles.cardValue}>{topReferrer?.referrer ?? "—"}</p>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <ViewsLineChart data={dailyViews} />
      </div>

      <div className={styles.chartRow2}>
        <TopPagesBarChart
          data={topPages.map((r) => ({ page: r.path, views: r.views }))}
        />
        <DeviceDonutChart
          data={devices.map((r) => ({
            name: r.device ?? "Unknown",
            value: r.views,
          }))}
        />
      </div>
    </>
  );
}
