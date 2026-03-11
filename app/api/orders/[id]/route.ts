import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Verify ownership first
    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (existingOrder.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Convert date strings to Date objects for Prisma
    const data: any = { ...body };
    delete data.id; // Ensure ID is not updated
    delete data.createdAt;
    delete data.updatedAt;
    delete data.userId; // Prevent hijacking

    if (data.startDate) {
      const date = new Date(data.startDate);
      data.startDate = !isNaN(date.getTime()) ? date : null;
    }
    if (data.endDate) {
      const date = new Date(data.endDate);
      data.endDate = !isNaN(date.getTime()) ? date : null;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: data,
    });
    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      {
        error: "Error updating order",
        details: error?.message || String(error),
      },
      { status: 500 },
    );
  }
}
