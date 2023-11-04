//функция api выдающая файл по запросу
import { prisma } from "@/app/utils/db/prisma";
import db from "@/app/utils/db";

//получает от маршрутизатора идентификатор задачи, для которой требуется загрузить файл
export async function GET({ params: { id } }) {
  const taskId = id;
  await db.connect();
  const file = await prisma.file.findMany({ where: { taskId } });
  await db.disconnect();
  console.log(`file with ${taskId} downloaded from Mongo`);

  const buffer = file[0].buffer;
  const headers = new Headers();
  headers.append("Content-Disposition", 'attachment; filename="filename.txt"');
  headers.append("Content-Type", "application/text");

  return new Response(buffer, {
    headers,
  });
}
