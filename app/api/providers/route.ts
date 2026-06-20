import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all providers
export async function GET() {
  try {
    const providers = await prisma.provider.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      providers,
    });
  } catch (error) {
    console.error("GET /api/providers error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch providers",
      },
      { status: 500 }
    );
  }
}

// CREATE provider application
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.name || !body?.email || !body?.skills) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: name, email, skills",
        },
        { status: 400 }
      );
    }

    const provider = await prisma.provider.create({
      data: {
        name: String(body.name),
        email: String(body.email),
        phone: body.phone ? String(body.phone) : "",
        skills: String(body.skills),
        experience: body.experience ? String(body.experience) : "",
        portfolio: body.portfolio ? String(body.portfolio) : "",
        linkedin: body.linkedin ? String(body.linkedin) : "",
      },
    });

    return NextResponse.json({
      success: true,
      provider,
    });
  } catch (error: any) {
    console.error("POST /api/providers error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit application",
      },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing id",
        },
        { status: 400 }
      );
    }

    await prisma.provider.delete({
      where: {
        id: Number(body.id),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error("DELETE /api/providers error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete provider",
      },
      { status: 500 }
    );
  }
}
