// studio/src/app/api/debug-photo-studio/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function walk(dir: string, base: string, results: string[] = []) {
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const full = path.join(dir, entry.name);
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) {
      walk(full, rel, results);
    } else {
      if (rel.toLowerCase().includes("photo-studio")) {
        results.push(rel);
      }
    }
  }
  return results;
}

export async function GET() {
  try {
    // Start at the repository's src folder
    const root = path.join(process.cwd(), "studio", "src");
    if (!fs.existsSync(root)) {
      return NextResponse.json({ error: "studio/src not found on server" }, { status: 500 });
    }
    const matches = walk(root, "studio/src", []);
    return NextResponse.json({ matches });
  } catch (err: any) {
    return NextResponse.json({ error: String(err), stack: err.stack?.split("\n").slice(0,10) }, { status: 500 });
  }
}

