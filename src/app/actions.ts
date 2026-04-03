'use server';

import nodemailer from 'nodemailer';
import { redirect } from 'next/navigation';

export async function sendFeedbackMsg(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const msg = formData.get('msg') as string;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '465', 10),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const messageContent = `Від імені :${name}\nEmail :${email}\nТелефон :${phone}\nЗвернення :\n\n${msg}`;

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.SMTP_USER || 'pompeyaavemaria@gmail.com',
      replyTo: email,
      subject: 'Зворотня форма',
      text: messageContent,
    });
  } catch (error) {
    console.error("Mail Error: ", error);
    redirect('/404');
  }

  redirect('/successful');
}

export async function sendFeedbackSvid(formData: FormData) {
  const name = formData.get('name') as string;
  const surname = formData.get('surname') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const place = formData.get('place') as string;
  const msg = formData.get('msg') as string;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '465', 10),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const messageContent = `Від імені :${name} ${surname}\nМісцевість: ${place}\nEmail :${email}\nТелефон :${phone}\nСвідчення :\n\n${msg}`;

    await transporter.sendMail({
      from: `"${name} ${surname}" <${email}>`,
      to: process.env.SMTP_USER || 'pompeyaavemaria@gmail.com',
      replyTo: email,
      subject: 'Нове Свідчення',
      text: messageContent,
    });
  } catch (error) {
    console.error("Mail Error: ", error);
    redirect('/404');
  }

  redirect('/successful');
}
