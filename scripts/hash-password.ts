import bcrypt from "bcrypt";

const password = process.argv[2];
if (!password) {
  console.error("Usage: bun scripts/hash-password.ts <password>");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 13);
console.log("Set this in your .env:");
console.log(`ADMIN_PASSWORD=${hash}`);
