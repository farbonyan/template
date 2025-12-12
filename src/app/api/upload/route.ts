import fs from "fs/promises";
import path from "path";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "~/server/auth";
import { db } from "~/server/db";
import { validate } from "~/utils/file";
import { generateUUID } from "~/utils/uuid";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file || !validate(file)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const originalName = file.name;
  const ext = path.extname(originalName).replace(".", "");
  const id = generateUUID();
  const filename = `${id}.${ext}`;
  const uploadDir = path.join(process.cwd(), "uploads");

  await fs.mkdir(uploadDir, { recursive: true });
  const targetPath = path.join(uploadDir, filename);
  await fs.writeFile(targetPath, buffer);

  const saved = await db.attachment.create({
    data: {
      id,
      name: originalName,
      path: filename,
      ext,
      type: file.type,
      size: buffer.length,
    },
  });

  return NextResponse.json(saved);
}
