import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
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
    const body = await request.json();
    const order = await prisma.order.create({
      data: {
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
