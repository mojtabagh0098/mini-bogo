const { PrismaClient } = require("@prisma/client");
const fs = require("fs/promises");

const prisma = new PrismaClient();

async function run() {
  const rules = await prisma.bogoRule.findMany();
  await fs.writeFile(
    "./extensions/product-discount/discount-rules.json",
    JSON.stringify({ rules }, null, 2)
  );
  console.log("✅ BOGO rules exported for function");
}

run();
