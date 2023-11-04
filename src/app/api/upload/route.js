//функция api для загрузки файла в базу данных
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/db/prisma";
import db from "@/app/utils/db";

//в параметре request функция получает данные для загрузки в базу
export async function POST(request) {
  const data = await request.formData();
  const file = data.get("file");
  const name = file.name;
  const taskId = data.get("taskId");

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await db.connect();
  await prisma.file.create({
    data: { buffer, taskId, name },
  });
  await db.disconnect();
  console.log("file was uploaded to MongoDb");

  return NextResponse.json({ success: true });
}
