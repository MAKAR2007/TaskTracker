//функция для созднания нового пользователя

import User from "@/app/models/user";
import db from "@/app/utils/db";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

//в параметрах  req передаются (функцией принимаются) данные пользователя для добавления в систему
export async function POST(req) {
  // if (req.method !== 'POST') {
  //   return;
  // }
  const data = await req.json();
  //console.log(data);
  //console.log("data.image=", data.image);
  const { name, email, password, role, image } = data;
  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 5
  ) {
    return NextResponse.json({ error: "Validation error" }, { status: 422 });
  }

  await db.connect();

  //функция проверки на уникальность добавляемого пользователя (эл. почта должна быть уникальной)
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    await db.disconnect();
    return NextResponse.json(
      { error: "User with such email exists already!" },
      { status: 422 },
    );
  }

  const newUser = new User({
    name,
    email,
    password: bcryptjs.hashSync(password),
    role,
    image,
  });

  const user = await newUser.save();
  await db.disconnect();
  return NextResponse.json(
    {
      message: "Created user!",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    },
    { status: 201 },
  );
}
