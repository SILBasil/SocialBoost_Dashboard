import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        endDate: "asc",
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        orderId: body.orderId,
        clientName: body.clientName,
        chatLink: body.chatLink,
        targetLink: body.targetLink,
        platform: body.platform,
        service: body.service,
        totalAmount: body.totalAmount,
        startDate: body.startDate ? new Date(body.startDate) : new Date(),
        endDate: body.endDate ? new Date(body.endDate) : null,
        status: body.status || "pending",
        price: body.price,
        originalCount: body.originalCount,
        foreignAmount: body.foreignAmount,
        foreignBonus: body.foreignBonus,
        thaiAmount: body.thaiAmount,
        thaiBonus: body.thaiBonus,
        foreignDone: body.foreignDone || 0,
        thaiDone: body.thaiDone || 0,
        notes: body.notes,
        speed: body.speed || "normal",
        providerLink: body.providerLink || null,
        targetPlatformAmount: body.targetPlatformAmount
          ? parseInt(body.targetPlatformAmount)
          : null,
        feePercentage: body.feePercentage
          ? parseFloat(body.feePercentage)
          : 13.0,
        feeAmount: body.price
          ? (body.price *
              (body.feePercentage ? parseFloat(body.feePercentage) : 13.0)) /
            100
          : 0,
        netRevenue: body.price
          ? body.price -
            (body.price *
              (body.feePercentage ? parseFloat(body.feePercentage) : 13.0)) /
              100
          : 0,
      },
    });
    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error?.message || String(error),
      },
      { status: 500 },
    );
  }
}
