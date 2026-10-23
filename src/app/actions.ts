'use server';

import nodemailer from 'nodemailer';
import { redirect } from 'next/navigation';
import { HONEYPOT_FIELD, clientIp, cleanLine, cleanText, isEmail, rateLimited } from '../lib/formGuard';

const MAX = { name: 80, email: 254, phone: 40, place: 120, msg: 5000 };
const FALLBACK_RECIPIENT = 'pompeyaavemaria@gmail.com';

type Mail = { subject: string; fromName: string; replyTo: string; text: string };

async function deliver({ subject, fromName, replyTo, text }: Mail) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailbox = process.env.SMTP_USER || FALLBACK_RECIPIENT;

  await transporter.sendMail({
    // Send from our own authenticated mailbox; the visitor's address only goes into Reply-To.
    from: { name: fromName, address: mailbox },
    to: mailbox,
    replyTo,
    subject,
    text,
  });
}

/** Runs the shared checks. Redirects (never returns) when the submission should not be mailed. */
async function guard(formData: FormData) {
  // A filled honeypot means a bot: pretend it worked so it does not retry.
  if (cleanText(formData.get(HONEYPOT_FIELD), 200)) redirect('/successful');

  if (rateLimited(await clientIp())) redirect('/404');
}

export async function sendFeedbackMsg(formData: FormData) {
  await guard(formData);

  const name = cleanLine(formData.get('name'), MAX.name);
  const email = cleanLine(formData.get('email'), MAX.email);
  const phone = cleanLine(formData.get('phone'), MAX.phone);
  const msg = cleanText(formData.get('msg'), MAX.msg);

  if (name.length < 3 || msg.length < 3 || !isEmail(email)) redirect('/404');

  try {
    await deliver({
      subject: 'Зворотня форма',
      fromName: name,
      replyTo: email,
      text: `Від імені :${name}\nEmail :${email}\nТелефон :${phone}\nЗвернення :\n\n${msg}`,
    });
  } catch (error) {
    console.error('Mail Error: ', error);
    redirect('/404');
  }

  redirect('/successful');
}

export async function sendFeedbackSvid(formData: FormData) {
  await guard(formData);

  const name = cleanLine(formData.get('name'), MAX.name);
  const surname = cleanLine(formData.get('surname'), MAX.name);
  const email = cleanLine(formData.get('email'), MAX.email);
  const phone = cleanLine(formData.get('phone'), MAX.phone);
  const place = cleanLine(formData.get('place'), MAX.place);
  const msg = cleanText(formData.get('msg'), MAX.msg);

  if (name.length < 2 || msg.length < 3 || !isEmail(email)) redirect('/404');

  try {
    await deliver({
      subject: 'Нове Свідчення',
      fromName: `${name} ${surname}`.trim(),
      replyTo: email,
      text: `Від імені :${name} ${surname}\nМісцевість: ${place}\nEmail :${email}\nТелефон :${phone}\nСвідчення :\n\n${msg}`,
    });
  } catch (error) {
    console.error('Mail Error: ', error);
    redirect('/404');
  }

  redirect('/successful');
}
