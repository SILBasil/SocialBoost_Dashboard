import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();

    // Convert date strings to Date objects for Prisma
    const data: any = { ...body };
    delete data.id; // Ensure ID is not updated
    delete data.createdAt;
    delete data.updatedAt;

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
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Error updating order" },
      { status: 500 },
    );
  }
}
