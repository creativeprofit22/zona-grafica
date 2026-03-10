import { expect, test } from "@playwright/test";

const pages = [
  { path: "/", title: "Zona Gráfica" },
  { path: "/portafolio", title: "Portafolio" },
  { path: "/servicios", title: "Servicios" },
  { path: "/nosotros", title: "Nosotros" },
  { path: "/contacto", title: "Contacto" },
  { path: "/blog", title: "Blog" },
];

for (const { path, title } of pages) {
  test(`${path} loads and contains "${title}" in title`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(new RegExp(title, "i"));
  });
}

test("navigation links are visible", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation");
  await expect(nav).toBeVisible();
  for (const label of ["Portafolio", "Servicios", "Nosotros", "Contacto"]) {
    await expect(
      nav.getByRole("link", { name: new RegExp(label, "i") }),
    ).toBeVisible();
  }
});

test("contact form renders", async ({ page }) => {
  await page.goto("/contacto");
  await expect(page.locator("form")).toBeVisible();
  await expect(page.getByRole("button", { name: /enviar/i })).toBeVisible();
});

test("homepage has hero section", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("GRÁFICA")).toBeVisible();
});

test("service accordion shows all 6 services", async ({ page }) => {
  await page.goto("/");
  const heading = page.getByRole("heading", { name: /Lo que hacemos/i });
  await expect(heading).toBeAttached();
  for (const service of [
    "Branding",
    "Editorial",
    "Web",
    "Fotografía",
    "Ilustración",
    "Cartelería",
  ]) {
    await expect(
      page.getByText(service, { exact: false }).first(),
    ).toBeAttached();
  }
});
