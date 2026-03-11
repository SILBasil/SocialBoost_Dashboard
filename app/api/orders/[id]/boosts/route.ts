import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const boosts = await prisma.boostHistory.findMany({
      where: { orderId: params.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(boosts);
  } catch (error: any) {
    console.error("Error fetching boosts:", error);
    return NextResponse.json(
      { error: "Failed to fetch boosts", details: error?.message },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const { amount, cost, note } = body;

    if (amount === undefined || cost === undefined) {
      return NextResponse.json(
        { error: "Amount and cost are required" },
        { status: 400 },
      );
    }

    // 1. Create the BoostHistory entry
    const boost = await prisma.boostHistory.create({
      data: {
        orderId: params.id,
        amount: parseInt(amount),
        cost: parseFloat(cost),
        note: note || null,
      },
    });

    // 2. Update the Order's totalCost and profit
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { boostHistories: true },
    });

    if (order) {
      const newTotalCost = order.boostHistories.reduce(
        (acc: number, curr: any) => acc + curr.cost,
        0,
      );
      const newProfit = (order.netRevenue || 0) - newTotalCost;

      await prisma.order.update({
        where: { id: params.id },
        data: {
          totalCost: newTotalCost,
          profit: newProfit,
        },
      });
    }

    return NextResponse.json(boost);
  } catch (error: any) {
    console.error("Error creating boost:", error);
    return NextResponse.json(
      { error: "Failed to create boost", details: error?.message },
      { status: 500 },
    );
  }
}
