# 01 — Project Overview

## Purpose
Corporate website for **QUME Technologies**, a Nepal-based IT company. It presents services, solutions, industries and engineering process, captures project enquiries, publishes insights and job openings, and accepts job applications.

## Target users
Enterprise clients, startups, international clients, government organisations, investors, technology partners, job seekers.

## Public pages
`/` home, `/services`, `/solutions`, `/industries`, `/about`, `/insights`, `/insights/$slug`, `/careers`, `/careers/$id`, `/contact`, `/privacy-policy`, `/terms-and-conditions`.

## Admin
`/admin` (signed-in admins only): enquiries inbox, job postings CRUD, applications list with CV download, insights CRUD.

## Content rules
No invented statistics, clients, awards, testimonials or years of experience. Case studies are clearly labelled placeholders until real ones are supplied.

## Scope
**Must have:** public pages, contact form stored in DB, careers with CV upload, insights blog, admin panel, SEO metadata, accessibility, reduced-motion support, 3D hero visual.
**Should have:** owner email notifications (needs verified email domain), real case studies, real office contact details.
**Future:** multilingual (Nepali), CMS media library, analytics dashboard, newsletter.

## Goals
- Performance: LCP < 2.5s, 3D scene lazy-loaded after hydration.
- Security: RLS on every table, admin role checked server-side, validated input.
- SEO: unique head() per route, semantic HTML, sitemap-ready.
- Accessibility: WCAG 2.1 AA.
