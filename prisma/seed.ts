import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Utility to parse date strings like "5/11/2025" or "10/3/2026"
function parseThaiDate(dateStr: string) {
  if (!dateStr || dateStr.trim() === "") return null;
  const [day, month, year] = dateStr.split("/").map(Number);
  // Simple check for year format
  const yearToUse = year < 100 ? 2000 + year : year;
  return new Date(yearToUse, month - 1, day);
}

async function main() {
  console.log("Cleaning database...");
  await prisma.order.deleteMany({});
  console.log("Start migrating user data...");

  const userData = [
    {
      targetLink:
        "https://www.instagram.com/maymiigfl?igsh=NzJzbW04dmRkN3ds&utm_source=qr",
      platform: "ig",
      service: "ฟอล",
      serviceType: "ต่างชาติ",
      originalCount: 2602,
      foreignAmount: 2100,
      foreignBonus: 500,
      totalAmount: 5202,
      startDate: "5/11/2025",
      endDate: "5/11/2025",
      timeSpent: "1",
      status: "done",
    },
    {
      targetLink:
        "https://www.instagram.com/jp_jannii?igsh=NWF6bWd6ZGIyNDRz&utm_source=qr",
      platform: "ig",
      service: "ฟอล",
      serviceType: "ผสม",
      originalCount: 15,
      foreignAmount: 1100,
      foreignBonus: 500,
      thaiAmount: 200,
      thaiBonus: 50,
      totalAmount: 1865,
      startDate: "14/11/2025",
      status: "done",
    },
    {
      targetLink:
        "https://www.instagram.com/evethitapa?igsh=MWNkNDUwNW9qaGl4MA%3D%3D&utm_source=qr",
      platform: "ig",
      service: "ฟอล",
      serviceType: "ต่างชาติ",
      originalCount: 1238,
      foreignAmount: 5000,
      foreignBonus: 500,
      totalAmount: 6738,
      startDate: "24/11/2025",
      status: "done",
    },
    {
      targetLink: "https://www.instagram.com/aispecialist.th",
      platform: "ig",
      service: "ฟอล",
      serviceType: "ไทย",
      originalCount: 2,
      thaiAmount: 3100,
      thaiBonus: 300,
      totalAmount: 3402,
      startDate: "11/12/2025",
      status: "done",
    },
    {
      targetLink:
        "https://www.instagram.com/natachaseq?igsh=MWE3cnk4cDNiZ3RlZA==",
      clientName: "natachaseq",
      chatLink: "https://chat.fastwork.co/message/UH0JVU5V",
      platform: "ig",
      service: "ฟอล",
      serviceType: "ผสม",
      price: 350,
      originalCount: 789,
      foreignAmount: 1200,
      foreignDone: 580,
      thaiAmount: 250,
      thaiDone: 0,
      totalAmount: 2239,
      startDate: "1/3/2026",
      status: "working",
      notes: "ทยอยทำ",
    },
    {
      targetLink:
        "https://www.instagram.com/voyade.official?igsh=MXJ2aXcwY3V2aDA2aA==",
      clientName: "voyade.official",
      chatLink: "https://chat.fastwork.co/message/OPY7DB2U",
      platform: "ig",
      service: "ฟอล",
      serviceType: "ต่างชาติ",
      price: 700,
      originalCount: 7,
      foreignAmount: 5300,
      foreignBonus: 500,
      foreignDone: 4900,
      totalAmount: 5807,
      startDate: "9/3/2026",
      status: "working",
    },
    {
      targetLink:
        "https://www.instagram.com/pkmnnd?igsh=MXd6eG92dG45cDUzZg%3D%3D&utm_source=qrr",
      clientName: "pkmnn",
      chatLink: "https://chat.fastwork.co/message/1T5AXEDU",
      platform: "ig",
      service: "ฟอล",
      serviceType: "ไทย",
      price: 350,
      originalCount: 305,
      thaiAmount: 450,
      thaiBonus: 50,
      thaiDone: 356,
      totalAmount: 805,
      startDate: "9/3/2026",
      status: "working",
    },
    {
      targetLink:
        "https://www.instagram.com/voyade.cn?igsh=MWRzZDdjbWl1c3h6Zw%3D%3D&utm_source=qr",
      clientName: "voyade.cn",
      chatLink: "https://chat.fastwork.co/message/5B3MGSRH",
      platform: "ig",
      service: "ฟอล",
      serviceType: "ต่างชาติ",
      price: 350,
      originalCount: 5,
      foreignAmount: 2300,
      foreignBonus: 200,
      foreignDone: 2600,
      totalAmount: 2505,
      startDate: "9/3/2026",
      status: "working",
    },
    {
      targetLink:
        "https://www.instagram.com/k._kanoon?igsh=eHU2MWhucnVjempt&utm_source=qr",
      clientName: "k._kanoo",
      chatLink: "https://chat.fastwork.co/message/D6RVOWMC",
      platform: "ig",
      service: "ฟอล",
      serviceType: "ต่างชาติ",
      price: 350,
      originalCount: 1006,
      foreignAmount: 2300,
      foreignBonus: 200,
      foreignDone: 600,
      totalAmount: 3506,
      startDate: "9/3/2026",
      status: "working",
      notes: "ทยอยทำ",
    },
    {
      targetLink:
        "https://www.instagram.com/kungdeseoul.surgery?igsh=bnRjOXUwbmQ0bzkz&utm_source=qr",
      clientName: "kungdeseoul.surger",
      chatLink: "https://chat.fastwork.co/message/PBZKVWFT",
      platform: "ig",
      service: "ฟอล",
      serviceType: "ผสม",
      price: 1300,
      originalCount: 11,
      foreignAmount: 4300,
      foreignDone: 2000,
      thaiAmount: 700,
      thaiDone: 0,
      totalAmount: 5011,
      startDate: "10/3/2026",
      status: "working",
    },
    {
      targetLink:
        "https://www.instagram.com/parimm_pim?igsh=dnNtNm54cWlqdWt4&utm_source=qr",
      clientName: "parimm_pim",
      chatLink: "https://chat.fastwork.co/message/TIMWFPRO",
      platform: "ig",
      service: "ฟอล",
      serviceType: "ไทย",
      price: 350,
      originalCount: 5684,
      thaiAmount: 450,
      thaiBonus: 50,
      thaiDone: 0,
      totalAmount: 6184,
      startDate: "10/3/2026",
      status: "working",
    },
    {
      targetLink: "https://www.tiktok.com/@pimpimparimm?_r=1&_t=ZS-94ZK54B2XoL",
      clientName: "pimpimparimm",
      chatLink: "https://chat.fastwork.co/message/6G8GYMKD",
      platform: "tiktok",
      service: "ตต",
      serviceType: "ต่างชาติ",
      price: 350,
      originalCount: 4143,
      foreignAmount: 2000,
      foreignBonus: 500,
      foreignDone: 0,
      totalAmount: 6143,
      status: "pending",
    },
  ];

  for (const item of userData) {
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    await prisma.order.create({
      data: {
        orderId: orderId,
        targetLink: item.targetLink,
        clientName: item.clientName || "Unknown",
        chatLink: item.chatLink,
        platform: item.platform,
        service: item.service,
        serviceType: item.serviceType,
        price: item.price,
        originalCount: item.originalCount,
        foreignAmount: item.foreignAmount || 0,
        foreignBonus: item.foreignBonus || 0,
        foreignDone: item.foreignDone || 0,
        thaiAmount: item.thaiAmount || 0,
        thaiBonus: item.thaiBonus || 0,
        thaiDone: item.thaiDone || 0,
        totalAmount: item.totalAmount || 0,
        startDate: parseThaiDate(item.startDate || ""),
        endDate: parseThaiDate(item.endDate || ""),
        timeSpent: item.timeSpent,
        status: item.status as any,
        notes: item.notes,
      },
    });
  }

  console.log("Migration finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
