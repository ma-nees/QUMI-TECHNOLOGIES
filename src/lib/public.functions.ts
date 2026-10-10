// Email templates for contact and career submissions.
// All user-supplied values are escaped before being placed in HTML.

export type Brand = {
  name: string;
  tagline: string;
  website: string;
  supportEmail: string;
  address: string;
  timezone: string;
};

export function getBrand(): Brand {
  return {
    name: process.env.COMPANY_NAME || "QUMI Technologies",
    tagline: process.env.COMPANY_TAGLINE || "Engineering excellence, delivered with care",
    website: process.env.COMPANY_WEBSITE || "",
    supportEmail: process.env.SMTP_USER || "",
    address: process.env.COMPANY_ADDRESS || "",
    timezone: process.env.COMPANY_TIMEZONE || "Asia/Kolkata",
  };
}

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function makeReference(prefix: "CT" | "AP"): string {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  const rand = crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `${prefix}-${ymd}-${rand}`;
}

export function formatTimestamp(brand: Brand, date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: brand.timezone,
  }).format(date);
}

const C = {
  navy: "#0f2742",
  accent: "#b08d57",
  text: "#1f2933",
  muted: "#6b7785",
  line: "#e3e8ee",
  page: "#f3f5f8",
  card: "#ffffff",
  panel: "#f8fafc",
};

const FONT = "'Segoe UI', Helvetica, Arial, sans-serif";

function layout(brand: Brand, opts: { preheader: string; eyebrow: string; title: string; body: string; footerNote: string }): string {
  const site = brand.website
    ? `<a href="${escapeHtml(brand.website)}" style="color:${C.accent};text-decoration:none;">${escapeHtml(brand.website.replace(/^https?:\/\//, ""))}</a>`
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};font-family:${FONT};color:${C.text};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};padding:32px 12px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${C.card};border:1px solid ${C.line};border-radius:6px;overflow:hidden;">
      <tr>
        <td style="background:${C.navy};padding:28px 36px;">
          <div style="font-size:20px;font-weight:600;letter-spacing:1.5px;color:#ffffff;text-transform:uppercase;">${escapeHtml(brand.name)}</div>
          <div style="font-size:12px;color:#aebbd0;margin-top:4px;letter-spacing:0.4px;">${escapeHtml(brand.tagline)}</div>
        </td>
      </tr>
      <tr><td style="height:3px;background:${C.accent};font-size:0;line-height:0;">&nbsp;</td></tr>
      <tr>
        <td style="padding:36px 36px 8px 36px;">
          <div style="font-size:11px;font-weight:600;letter-spacing:2px;color:${C.accent};text-transform:uppercase;">${escapeHtml(opts.eyebrow)}</div>
          <h1 style="margin:10px 0 0 0;font-size:24px;line-height:1.3;font-weight:600;color:${C.navy};">${escapeHtml(opts.title)}</h1>
        </td>
      </tr>
      <tr><td style="padding:16px 36px 36px 36px;font-size:15px;line-height:1.65;color:${C.text};">${opts.body}</td></tr>
      <tr>
        <td style="background:${C.panel};border-top:1px solid ${C.line};padding:22px 36px;font-size:12px;line-height:1.6;color:${C.muted};">
          <div>${escapeHtml(opts.footerNote)}</div>
          <div style="margin-top:10px;">
            <strong style="color:${C.navy};">${escapeHtml(brand.name)}</strong>${brand.address ? ` &nbsp;|&nbsp; ${escapeHtml(brand.address)}` : ""}${site ? ` &nbsp;|&nbsp; ${site}` : ""}
          </div>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function detailTable(rows: Array<[string, string | null | undefined]>): string {
  const body = rows
    .filter(([, v]) => v !== undefined)
    .map(
      ([label, value], i, arr) => `
      <tr>
        <td style="padding:12px 16px;width:150px;font-size:12px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;color:${C.muted};vertical-align:top;${i < arr.length - 1 ? `border-bottom:1px solid ${C.line};` : ""}">${escapeHtml(label)}</td>
        <td style="padding:12px 16px;font-size:14px;color:${C.text};vertical-align:top;${i < arr.length - 1 ? `border-bottom:1px solid ${C.line};` : ""}">${value ? escapeHtml(value) : `<span style="color:${C.muted};">Not provided</span>`}</td>
      </tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.line};border-radius:4px;background:${C.panel};margin:20px 0;">${body}</table>`;
}

function quoteBlock(label: string, text: string): string {
  return `
  <div style="margin:24px 0 0 0;">
    <div style="font-size:12px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;color:${C.muted};margin-bottom:8px;">${escapeHtml(label)}</div>
    <div style="border-left:3px solid ${C.accent};background:${C.panel};padding:16px 20px;font-size:14px;line-height:1.7;color:${C.text};white-space:pre-wrap;">${escapeHtml(text)}</div>
  </div>`;
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 0 0;"><tr><td style="background:${C.navy};border-radius:4px;"><a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.4px;">${escapeHtml(label)}</a></td></tr></table>`;
}

/* ---------------------------- Contact: internal ---------------------------- */

export type ContactData = { name: string; email: string; company?: string | null; topic?: string | null; message: string };

export function contactNotification(brand: Brand, d: ContactData, ref: string) {
  const when = formatTimestamp(brand);
  const subject = `[${ref}] New enquiry: ${d.topic || "General enquiry"} - ${d.name}`;
  const html = layout(brand, {
    preheader: `${d.name} has submitted a new enquiry via the website.`,
    eyebrow: "Website enquiry",
    title: "A new enquiry has been received",
    body: `
      <p style="margin:0;">A message was submitted through the contact form. Reply directly to this email to respond to the sender.</p>
      ${detailTable([
      ["Reference", ref],
      ["Received", when],
      ["Name", d.name],
      ["Email", d.email],
      ["Organisation", d.company],
      ["Topic", d.topic],
    ])}
      ${quoteBlock("Message", d.message)}
      ${button(`mailto:${d.email}?subject=${encodeURIComponent(`Re: ${d.topic || "Your enquiry"} [${ref}]`)}`, "Reply to sender")}`,
    footerNote: "This is an automated notification generated by the website contact form. Please retain the reference number for follow-up.",
  });
  const text = [
    `New website enquiry [${ref}]`,
    `Received: ${when}`,
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Organisation: ${d.company || "Not provided"}`,
    `Topic: ${d.topic || "Not provided"}`,
    "",
    "Message:",
    d.message,
  ].join("\n");
  return { subject, html, text };
}

/* ---------------------------- Contact: acknowledgement ---------------------------- */

export function contactAcknowledgement(brand: Brand, d: ContactData, ref: string) {
  const subject = `We have received your enquiry [${ref}]`;
  const html = layout(brand, {
    preheader: "Thank you for contacting us. Your enquiry has been logged and assigned a reference number.",
    eyebrow: "Acknowledgement of receipt",
    title: `Thank you, ${d.name.split(" ")[0]}`,
    body: `
      <p style="margin:0 0 14px 0;">Thank you for contacting ${escapeHtml(brand.name)}. We confirm that your enquiry has been received and logged with the reference below.</p>
      ${detailTable([
      ["Reference", ref],
      ["Topic", d.topic || "General enquiry"],
      ["Status", "Received - awaiting review"],
    ])}
      <p style="margin:0 0 14px 0;">A member of our team will review your message and respond within two business days. If your matter is time-sensitive, reply to this email quoting your reference number and we will prioritise it.</p>
      ${quoteBlock("A copy of your message", d.message)}
      <p style="margin:28px 0 0 0;">Kind regards,<br /><strong style="color:${C.navy};">Client Relations</strong><br />${escapeHtml(brand.name)}</p>`,
    footerNote: "You are receiving this message because this address was used to submit a form on our website. If this was not you, you may disregard this email.",
  });
  const text = [
    `Dear ${d.name},`,
    "",
    `Thank you for contacting ${brand.name}. Your enquiry has been received.`,
    `Reference: ${ref}`,
    "",
    "A member of our team will respond within two business days. For urgent matters, reply to this email quoting your reference number.",
    "",
    "Kind regards,",
    `Client Relations, ${brand.name}`,
  ].join("\n");
  return { subject, html, text };
}

/* ---------------------------- Careers: internal ---------------------------- */

export type ApplicationData = {
  name: string;
  email: string;
  phone?: string | null;
  portfolio_url?: string | null;
  cover_letter?: string | null;
  resume_path: string;
};

export function applicationNotification(brand: Brand, d: ApplicationData, jobTitle: string, ref: string) {
  const when = formatTimestamp(brand);
  const subject = `[${ref}] Application received: ${jobTitle} - ${d.name}`;
  const html = layout(brand, {
    preheader: `${d.name} has applied for ${jobTitle}.`,
    eyebrow: "Recruitment",
    title: "A new application has been submitted",
    body: `
      <p style="margin:0;">A candidate has applied for the position of <strong>${escapeHtml(jobTitle)}</strong>.</p>
      ${detailTable([
      ["Reference", ref],
      ["Received", when],
      ["Position", jobTitle],
      ["Candidate", d.name],
      ["Email", d.email],
      ["Phone", d.phone],
      ["Portfolio", d.portfolio_url],
      ["Resume file", d.resume_path],
    ])}
      ${d.cover_letter ? quoteBlock("Cover letter", d.cover_letter) : ""}
      ${button(`mailto:${d.email}?subject=${encodeURIComponent(`Your application for ${jobTitle} [${ref}]`)}`, "Contact candidate")}`,
    footerNote: "This is an automated notification from the careers portal. Candidate data is confidential and should be handled in accordance with company policy.",
  });
  const text = [
    `New application [${ref}]`,
    `Position: ${jobTitle}`,
    `Received: ${when}`,
    `Candidate: ${d.name}`,
    `Email: ${d.email}`,
    `Phone: ${d.phone || "Not provided"}`,
    `Portfolio: ${d.portfolio_url || "Not provided"}`,
    `Resume file: ${d.resume_path}`,
    "",
    d.cover_letter ? `Cover letter:\n${d.cover_letter}` : "",
  ].join("\n");
  return { subject, html, text };
}

/* ---------------------------- Careers: acknowledgement ---------------------------- */

export function applicationAcknowledgement(brand: Brand, d: ApplicationData, jobTitle: string, ref: string) {
  const subject = `Your application for ${jobTitle} [${ref}]`;
  const html = layout(brand, {
    preheader: `We have received your application for ${jobTitle}.`,
    eyebrow: "Application received",
    title: `Thank you for applying, ${d.name.split(" ")[0]}`,
    body: `
      <p style="margin:0 0 14px 0;">We confirm receipt of your application to ${escapeHtml(brand.name)}. Our recruitment team will review your profile against the requirements of the role.</p>
      ${detailTable([
      ["Reference", ref],
      ["Position", jobTitle],
      ["Status", "Received - under review"],
    ])}
      <p style="margin:0 0 14px 0;">Shortlisted candidates will be contacted to arrange the next stage. Due to the volume of applications, we may only be able to respond to candidates who progress. Please keep your reference number for any correspondence.</p>
      <p style="margin:28px 0 0 0;">Kind regards,<br /><strong style="color:${C.navy};">Talent Acquisition</strong><br />${escapeHtml(brand.name)}</p>`,
    footerNote: "Your personal data is processed solely for recruitment purposes and handled confidentially.",
  });
  const text = [
    `Dear ${d.name},`,
    "",
    `Thank you for applying for ${jobTitle} at ${brand.name}.`,
    `Reference: ${ref}`,
    "",
    "Our team will review your application. Shortlisted candidates will be contacted for the next stage.",
    "",
    "Kind regards,",
    `Talent Acquisition, ${brand.name}`,
  ].join("\n");
  return { subject, html, text };
}

/* ---------------------------- Data Fetching ---------------------------- */
import { supabase } from "@/integrations/supabase/client";
import { createServerFn } from "@tanstack/react-start";
import { contactSchema, applicationSchema } from "./schemas";
import nodemailer from "nodemailer";

export async function fetchCompanySettings() {
  // @ts-ignore - company_settings might not be in types.ts yet
  const { data, error } = await supabase
    .from('company_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    console.error("fetchCompanySettings error:", error);
    return null;
  }
  return data;
}

export const listJobs = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('is_open', true)
      .order('created_at', { ascending: false });
    return data || [];
  });

export const getJob = createServerFn({ method: "GET" })
  .validator((d: { id: string }) => d)
  .handler(async ({ data: { id } }) => {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    return data;
  });

import fs from 'fs';
import path from 'path';

function getEnv(key: string): string {
  if (process.env[key]) return process.env[key] as string;
  try {
    const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env'), 'utf-8');
    for (const line of envFile.split('\n')) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match && match[1].trim() === key) {
        return match[2].trim().replace(/^"|"$/g, '');
      }
    }
  } catch (e) { }
  return "";
}

function getTransporter() {
  const port = Number(getEnv("SMTP_PORT") || 465);
  return nodemailer.createTransport({
    host: getEnv("SMTP_HOST") || "smtp.gmail.com",
    port: port,
    secure: port === 465,
    auth: {
      user: getEnv("SMTP_USER"),
      pass: getEnv("SMTP_PASSWORD") || getEnv("SMTP_PASS"),
    },
  });
}

export const submitContact = createServerFn({ method: "POST" })
  .validator(contactSchema)
  .handler(async ({ data }) => {
    const payload = { ...data };
    delete (payload as any).website;

    const { error } = await supabase
      .from('contact_submissions')
      .insert([payload]);
    if (error) throw error;

    try {
      const brand = getBrand();
      // Ensure we have an email set for fallback
      brand.supportEmail = brand.supportEmail || getEnv("SMTP_USER");
      const ref = makeReference("CT");
      const notification = contactNotification(brand, payload, ref);
      const ack = contactAcknowledgement(brand, payload, ref);
      const transporter = getTransporter();

      // Fire and forget emails so they don't block the UI
      transporter.sendMail({
        from: `"${brand.name}" <${getEnv("SMTP_USER")}>`,
        to: brand.supportEmail,
        subject: notification.subject,
        html: notification.html,
      }).catch(console.error);

      transporter.sendMail({
        from: `"${brand.name}" <${getEnv("SMTP_USER")}>`,
        to: payload.email,
        subject: ack.subject,
        html: ack.html,
      }).catch(console.error);
    } catch (e) {
      console.error("Failed to send contact emails:", e);
    }

    return { ok: true };
  });

export const submitApplication = createServerFn({ method: "POST" })
  .validator((d: any) => d) // Using any since we add resume_path to raw payload
  .handler(async ({ data }) => {
    const payload = { ...data };
    delete payload.website;

    const { error } = await supabase
      .from('job_applications')
      .insert([payload]);
    if (error) {
      console.error("Database insert error:", error);
      throw error;
    }

    try {
      const brand = getBrand();
      brand.supportEmail = brand.supportEmail || getEnv("SMTP_USER");
      const ref = makeReference("AP");

      let jobTitle = "General Application";
      if (payload.job_id) {
        const { data: job } = await supabase.from('jobs').select('title').eq('id', payload.job_id).single();
        if (job) jobTitle = job.title;
      }

      const notification = applicationNotification(brand, payload, jobTitle, ref);
      const ack = applicationAcknowledgement(brand, payload, jobTitle, ref);
      const transporter = getTransporter();

      transporter.sendMail({
        from: `"${brand.name}" <${getEnv("SMTP_USER")}>`,
        to: brand.supportEmail,
        subject: notification.subject,
        html: notification.html,
      }).catch(console.error);

      transporter.sendMail({
        from: `"${brand.name}" <${getEnv("SMTP_USER")}>`,
        to: payload.email,
        subject: ack.subject,
        html: ack.html,
      }).catch(console.error);
    } catch (e) {
      console.error("Failed to send application emails:", e);
    }

    return { ok: true };
  });