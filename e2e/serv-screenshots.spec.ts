import { test } from "@playwright/test";

test("servicios screenshots", async ({ page }) => {
  await page.goto("/servicios", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  await page.screenshot({ path: "/tmp/serv-01-hero.png" });

  const scrollPositions = [800, 1200, 2000, 2800, 3600, 5000, 7000];
  for (let i = 0; i < scrollPositions.length; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollPositions[i]);
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: `/tmp/serv-${String(i + 2).padStart(2, "0")}-scroll${scrollPositions[i]}.png`,
    });
  }

  const info = await page.evaluate(() => {
    const cards = document.querySelectorAll("[data-service]");
    const positions: {
      service: string | null;
      offsetTop: number;
      height: number;
      wrapperPosition: string;
      wrapperZIndex: string;
    }[] = [];
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const wrapper = card.parentElement;
      const ws = wrapper ? getComputedStyle(wrapper) : null;
      positions.push({
        service: card.getAttribute("data-service"),
        offsetTop: Math.round(rect.top + window.scrollY),
        height: Math.round(rect.height),
        wrapperPosition: ws?.position ?? "",
        wrapperZIndex: ws?.zIndex ?? "",
      });
    });
    return {
      pageHeight: document.body.scrollHeight,
      cardCount: cards.length,
      cards: positions,
    };
  });
  console.log(JSON.stringify(info, null, 2));
});
