import { PrismaClient } from "@prisma/client";

import fs from "fs";
import path from "path";

const prismaClientSingleton = () => {
  // Check for CA cert content in environment (for Vercel/Production)
  if (process.env.TIDB_CA_CERT) {
    const certPath = "/tmp/isrgrootx1.pem";
    try {
      // Always write or verify the cert exists in the working directory
      fs.writeFileSync(certPath, process.env.TIDB_CA_CERT);
      const exists = fs.existsSync(certPath);
      const stats = exists ? fs.statSync(certPath) : null;
      console.log(
        `[Prisma] SSL certificate prepared at ${certPath}. Exists: ${exists}, Size: ${stats?.size}`,
      );
    } catch (error: any) {
      console.error("[Prisma] Error writing SSL certificate:", error.message);
    }
  } else {
    console.warn("[Prisma] TIDB_CA_CERT not found in environment variables.");
  }
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
