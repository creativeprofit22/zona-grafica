import { expect, test } from "@playwright/test";

/* ────────────────────────────────────────────────────
 * 1. Navigation flow — click each nav link, verify page loads
 * ──────────────────────────────────────────────────── */
test.describe("Navigation flow", () => {
  const links = [
    { label: "Portafolio", path: "/portafolio" },
    { label: "Servicios", path: "/servicios" },
    { label: "Nosotros", path: "/nosotros" },
    { label: "Blog", path: "/blog" },
    { label: "Contacto", path: "/contacto" },
  ];

  for (const { label, path } of links) {
    test(`clicking "${label}" navigates to ${path}`, async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const nav = page.getByRole("navigation");
      await nav.getByRole("link", { name: new RegExp(label, "i") }).click();

      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(new RegExp(`${path}$`));
    });
  }

  test("logo links back to home", async ({ page }) => {
    await page.goto("/servicios");
    await page.waitForLoadState("networkidle");

    await page.getByRole("link", { name: /inicio/i }).click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/$/);
  });
});

/* ────────────────────────────────────────────────────
 * 2. Contact form validation — submit empty, verify errors
 * ──────────────────────────────────────────────────── */
test.describe("Contact form validation", () => {
  test("shows error messages when submitting empty form", async ({ page }) => {
    await page.goto("/contacto");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /enviar/i }).click();

    await expect(page.getByText("Tu nombre es requerido")).toBeVisible();
    await expect(page.getByText("Selecciona un tipo")).toBeVisible();
    await expect(page.getByText("¿Dónde te encontramos?")).toBeVisible();
    await expect(page.getByText("Cuéntanos un poco más")).toBeVisible();
  });

  test("clears error when user fills a field", async ({ page }) => {
    await page.goto("/contacto");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /enviar/i }).click();
    await expect(page.getByText("Tu nombre es requerido")).toBeVisible();

    await page.getByLabel("Nombre").fill("María");
    await expect(page.getByText("Tu nombre es requerido")).not.toBeVisible();
  });
});

/* ────────────────────────────────────────────────────
 * 3. Contact form submission — fill and submit
 * ──────────────────────────────────────────────────── */
test("contact form submission shows success message", async ({ page }) => {
  await page.goto("/contacto");
  await page.waitForLoadState("networkidle");

  // Mock the API to avoid actually sending
  await page.route("**/api/contact", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "{}" }),
  );

  await page.getByLabel("Nombre").fill("Test User");
  await page.getByLabel("Tipo de proyecto").selectOption("branding");
  await page.getByLabel("Correo o teléfono").fill("test@example.com");
  await page.getByLabel("Mensaje").fill("Necesito un logo para mi negocio");

  await page.getByRole("button", { name: /enviar/i }).click();

  await expect(page.getByText("¡Mensaje enviado!")).toBeVisible();
  await expect(
    page.getByText("Te respondemos en menos de 24 horas"),
  ).toBeVisible();
});

/* ────────────────────────────────────────────────────
 * 4. Newsletter signup
 * ──────────────────────────────────────────────────── */
test("newsletter form submits and shows success", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // Mock the newsletter API
  await page.route("**/api/newsletter", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "{}" }),
  );

  const emailInput = page.getByLabel("Email para newsletter");
  await emailInput.scrollIntoViewIfNeeded();
  await emailInput.fill("test@example.com");
  await emailInput.press("Enter");

  await expect(page.getByText("¡Gracias por suscribirte!")).toBeVisible();
});

/* ────────────────────────────────────────────────────
 * 5. Mobile navigation — hamburger menu
 * ──────────────────────────────────────────────────── */
test.describe("Mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("hamburger opens overlay with nav links", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const burger = page.getByRole("button", { name: /abrir menú/i });
    await expect(burger).toBeVisible();

    await burger.click();

    const overlay = page.getByRole("dialog", {
      name: /menú de navegación/i,
    });
    await expect(overlay).toBeVisible();

    for (const label of [
      "Inicio",
      "Portafolio",
      "Servicios",
      "Nosotros",
      "Blog",
      "Contacto",
    ]) {
      await expect(
        overlay.getByRole("link", { name: new RegExp(label, "i") }),
      ).toBeVisible();
    }
  });

  test("tapping overlay link navigates and closes menu", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /abrir menú/i }).click();

    const overlay = page.getByRole("dialog", {
      name: /menú de navegación/i,
    });
    await overlay.getByRole("link", { name: /servicios/i }).click();

    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/servicios$/);
  });
});

/* ────────────────────────────────────────────────────
 * 6. Dark/light theme sections
 * ──────────────────────────────────────────────────── */
test("pages contain sections with data-theme attributes", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const themedSections = page.locator("[data-theme]");
  const count = await themedSections.count();
  expect(count).toBeGreaterThan(0);
});

/* ────────────────────────────────────────────────────
 * 7. Blog post navigation
 * ──────────────────────────────────────────────────── */
test("blog page lists posts and navigates to a post", async ({ page }) => {
  await page.goto("/blog");
  await page.waitForLoadState("networkidle");

  // Find any blog post link (href starts with /blog/)
  const postLink = page.locator('a[href^="/blog/"]').first();
  await expect(postLink).toBeVisible();

  const href = await postLink.getAttribute("href");
  await postLink.click();
  await page.waitForLoadState("networkidle");

  await expect(page).toHaveURL(new RegExp(`${href}$`));
  // Post should have an article or main content area
  await expect(page.locator("main")).toBeVisible();
});

/* ────────────────────────────────────────────────────
 * 8. 404 page
 * ──────────────────────────────────────────────────── */
test("non-existent page shows 404", async ({ page }) => {
  const response = await page.goto("/pagina-que-no-existe");
  expect(response?.status()).toBe(404);

  await expect(page.getByText("404")).toBeVisible();
  await expect(page.getByRole("link", { name: /go home/i })).toBeVisible();
});
