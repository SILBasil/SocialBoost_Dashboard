import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
        endDate: body.deadline ? new Date(body.deadline) : null,
        status: "pending",
      },
    });
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
