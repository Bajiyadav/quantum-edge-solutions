import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all leads
export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, leads });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

// DELETE a lead
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.lead.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}

// PATCH to update status
export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    const lead = await prisma.lead.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ success: true, lead });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update lead" },
      { status: 500 }
    );
  }
}
