// app/api/leads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["new", "contacted", "qualified", "converted", "archived"] as const;
type ValidStatus = (typeof VALID_STATUSES)[number];

// ────────────── GET ──────────────
export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error("GET /api/leads error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

// ────────────── POST ──────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.name || !body?.email || !body?.service || !body?.message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, email, service, message" },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        name: String(body.name),
        email: String(body.email),
        phone: body.phone ? String(body.phone) : "",
        company: body.business ? String(body.business) : "",
        service: String(body.service),
        budget: body.budget ? String(body.budget) : "",
        message: String(body.message),
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create lead", details: error?.message },
      { status: 500 }
    );
  }
}

// ────────────── PATCH — update status ──────────────
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.id || !body?.status) {
      return NextResponse.json(
        { success: false, error: "Missing id or status" },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    // ✅ Robust id coercion — works for both Int and String ids
    const idValue = /^\d+$/.test(String(body.id)) ? Number(body.id) : String(body.id);

    const lead = await prisma.lead.update({
      where: { id: idValue as any },
      data: { status: body.status as ValidStatus } as any,
    });

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    console.error("PATCH /api/leads error:", error);

    if (error?.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update lead" },
      { status: 500 }
    );
  }
}

// ────────────── DELETE ──────────────
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.id) {
      return NextResponse.json(
        { success: false, error: "Missing id" },
        { status: 400 }
      );
    }

    // ✅ Same robust id coercion
    const idValue = /^\d+$/.test(String(body.id)) ? Number(body.id) : String(body.id);

    await prisma.lead.delete({
      where: { id: idValue as any },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/leads error:", error);

    if (error?.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}
