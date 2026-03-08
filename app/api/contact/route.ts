import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { contactSubmissions } from "@/lib/schema";

const MAX_LENGTH = 5000;

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    if (!checkRateLimit(`contact:${ip}`, 3, 60_000)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { name, projectType, contact, message } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Tu nombre es requerido" },
        { status: 400 },
      );
    }

    if (!projectType || typeof projectType !== "string") {
      return NextResponse.json(
        { error: "Selecciona un tipo de proyecto" },
        { status: 400 },
      );
    }

    if (!contact || typeof contact !== "string" || !contact.trim()) {
      return NextResponse.json(
        { error: "Un correo o teléfono es requerido" },
        { status: 400 },
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Cuéntanos sobre tu proyecto" },
        { status: 400 },
      );
    }

    await db.insert(contactSubmissions).values({
      name: name.trim().slice(0, MAX_LENGTH),
      projectType: projectType.trim().slice(0, 100),
      contact: contact.trim().slice(0, MAX_LENGTH),
      message: message.trim().slice(0, MAX_LENGTH),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Algo salió mal. Intenta de nuevo o escríbenos por WhatsApp." },
      { status: 500 },
    );
  }
}
