import { ensureDefaultAdmin } from "./auth";

export async function initializeDatabase() {
  await ensureDefaultAdmin();
}
