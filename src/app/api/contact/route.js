//данная точка вызова api предназначена для отправки почтового сообщения о создании проекта
// или назначении испольнителя соответствующим пользователям

import { NextResponse } from "next/server";
const nodemailer = require("nodemailer");

// Обрабатывает запрос POST , являясь точкой вызова /api
// в параетре request функция получает данные о проекте или задаче для включения в почтовое отправление
export async function POST(request) {
  const fromUser = process.env.NEXT_PUBLIC_SMTP_USER;
  const password = process.env.NEXT_PUBLIC_SMTP_PASS;
  const host = process.env.NEXT_PUBLIC_SMTP_HOST;
  const port = process.env.NEXT_PUBLIC_SMTP_PORT;

  const data = await request.json();
  const toEmail = await data.mEmail;
  const manager = await data.mName;

  const title = await data.title;
  if (data.description) {
    var dskp = await data.description;
  } else {
    var dskp = "";
  }
  const description = dskp;

  if (await data.password) {
    var pwd = data.password;
    var tLink = process.env.TASKMENTOR_URL;
    var tMsg = "Вы успешно зарегистрированы в системе.";
    var tMsg2 = `Для входа в систему введите свой адрес электоронной почты: <&nbsp;${toEmail}&nbsp;> и пароль: <&nbsp;${pwd}&nbsp;>, пройдя по ссылке: `;
  } else {
    if (await data.taskLink) {
      var tLink = process.env.TASKMENTOR_URL + "/cc/reports/consrep3";
      var tMsg = "Вам назначена новая задача";
      var tMsg2 = "Просмотреть список назначенных задач можно в отчете ";
    } else {
      var tMsg = "Cоздан новый проект";
      var tLink = process.env.TASKMENTOR_URL + "/cc";
      var tMsg2 = "Для перехода к проекту, выберите его из списка по ссылке: ";
    }
  }
  const userLink = tLink;
  const message = tMsg;
  const message2 = tMsg2;

  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    /*
    //for outlook.com 
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
    */
    //secure- for inbox auth
    secure: true,
    auth: {
      user: fromUser,
      pass: password,
    },
  });

  try {
    const mail = await transporter.sendMail({
      from: fromUser,
      to: toEmail,
      replyTo: fromUser,
      subject: `Уведомление системы Ментор Задач `,
      html: `
      <p>Уважаемый ${manager}, </p>
            <p>Сообщение: ${message} </p>
            <p>Название: ${title} </p>
            <p>Описание: ${description} </p>
            <p>${message2} <href=${userLink}>${userLink}</p>
            `,
    });

    return NextResponse.json({ message: "Success: email was sent" });
  } catch (error) {
    console.log(error);
    NextResponse.status(500).json({ message: "COULD NOT SEND MESSAGE" });
  }
}
