import * as bcrypt from "bcrypt";

export async function encryptPassword(password: string): Promise<string> {
  if (!process.env.COST) {
    throw new Error("COST is not defined!");
  }
  const encryptedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.COST!)
  );
  return encryptedPassword;
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
}
