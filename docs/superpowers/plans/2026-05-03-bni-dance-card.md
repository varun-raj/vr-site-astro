# BNI Dance Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a professional, digital BNI Dance Card at `/bni/dance-card` that reflects Varun's personal brand and technical expertise.

**Architecture:** A single Astro page powered by a JSON data file for easy updates. It will use the existing `Main.astro` layout and follow the site's monochromatic, typography-focused design system.

**Tech Stack:** Astro, Tailwind CSS, JSON.

---

### Task 1: Create Data Structure

**Files:**
- Create: `src/content/bni.json`

- [ ] **Step 1: Create the JSON data file**

```json
{
  "profile": {
    "name": "Varun Raj Manoharan",
    "role": "Founder, FoundrySoft",
    "tagline": "AI & Future-Tech Navigator",
    "image": "/assets/press-kit/picture_four.jpg"
  },
  "gains": [
    {
      "id": "0",
      "label": "Goals",
      "content": "Expanding FoundrySoft to be a global brand in AI and future tech."
    },
    {
      "id": "1",
      "label": "Accomplishments",
      "content": "Shipped an end-to-end ecommerce website with exceptional design in just one month."
    },
    {
      "id": "2",
      "label": "Interests",
      "content": "Homelab, 3D printing, electronics, and building tiny hobby projects."
    },
    {
      "id": "3",
      "label": "Networks",
      "content": "Corporate connections, travel agencies, hospital/healthcare administration."
    },
    {
      "id": "4",
      "label": "Skills",
      "content": "Rapid technology adoption, AI-leveraged problem solving, and design-forward development."
    }
  ],
  "referrals": {
    "triggers": [
      "We don't know how to figure out a technology.",
      "I want to build something but I don't have a tech team.",
      "My website is old and outdated; I want a new one."
    ],
    "ideal_partners": [
      "Travel Agency owners/connectors",
      "Corporate Consultants",
      "Healthcare/Hospital Administrators"
    ]
  }
}
```

- [ ] **Step 2: Commit data structure**

```bash
git add src/content/bni.json
git commit -m "chore: add BNI dance card data structure"
```

---

### Task 2: Create Page Shell and Header

**Files:**
- Create: `src/pages/bni/dance-card.astro`

- [ ] **Step 1: Scaffolding with Layout and Header**

```astro
---
import Main from "../../layouts/Main.astro";
import bniData from "../../content/bni.json";
---

<Main
  meta={{
    title: `BNI Dance Card | ${bniData.profile.name}`,
    description: `One-to-One preparation for ${bniData.profile.name}, ${bniData.profile.role}.`,
  }}
>
  <div class="space-y-16 pt-4">
    <header class="flex flex-col-reverse items-start gap-8 md:flex-row md:items-center md:justify-between">
      <div class="space-y-3 max-w-xl">
        <h1 class="font-mono text-2xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          {bniData.profile.name}
        </h1>
        <p class="text-base text-zinc-500 dark:text-zinc-400">
          {bniData.profile.role} · <span class="text-zinc-400">{bniData.profile.tagline}</span>
        </p>
      </div>
      <div class="relative inline-block">
        <img
          src={bniData.profile.image}
          width={120}
          height={120}
          class="size-20 bg-zinc-100 object-cover dark:bg-zinc-800 rounded-xl"
          alt="Profile Picture"
        />
        <div class="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-xl"></div>
      </div>
    </header>

    <!-- Content sections will go here -->

    <footer class="pt-8 border-t border-zinc-100 dark:border-zinc-900">
      <p class="font-mono text-xxs uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        BNI 1-to-1 Preparation · FoundrySoft
      </p>
    </footer>
  </div>
</Main>
```

- [ ] **Step 2: Commit page shell**

```bash
git add src/pages/bni/dance-card.astro
git commit -m "feat: add BNI dance card page shell"
```

---

### Task 3: Implement GAINS Profile Section

**Files:**
- Modify: `src/pages/bni/dance-card.astro`

- [ ] **Step 1: Add GAINS Grid**

```astro
<!-- Inside <Main> after the header -->
<section class="space-y-8">
  <div>
    <span class="font-mono text-xxs uppercase tracking-widest text-zinc-400 block mb-6">[1] GAINS Profile</span>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
      {bniData.gains.map((item) => (
        <div class="group space-y-2">
          <div class="flex items-center gap-2 font-mono text-xxs uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
            <span class="size-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
            {item.label}
          </div>
          <p class="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {item.content}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit GAINS section**

```bash
git add src/pages/bni/dance-card.astro
git commit -m "feat: implement GAINS profile section"
```

---

### Task 4: Implement Referral Triggers Section

**Files:**
- Modify: `src/pages/bni/dance-card.astro`

- [ ] **Step 1: Add Referral Triggers and Partners**

```astro
<!-- Inside <Main> after GAINS section -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-zinc-100 dark:border-zinc-900">
  <section class="space-y-6">
    <span class="font-mono text-xxs uppercase tracking-widest text-zinc-400 block">[2] Referral Triggers</span>
    <p class="text-xs text-zinc-500 dark:text-zinc-500 italic">Listen for these cues in conversation:</p>
    <ul class="space-y-4">
      {bniData.referrals.triggers.map((trigger) => (
        <li class="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400">
          <span class="text-zinc-300 dark:text-zinc-700 font-mono">“</span>
          {trigger}
          <span class="text-zinc-300 dark:text-zinc-700 font-mono">”</span>
        </li>
      ))}
    </ul>
  </section>

  <section class="space-y-6">
    <span class="font-mono text-xxs uppercase tracking-widest text-zinc-400 block">[3] Ideal Partners</span>
    <p class="text-xs text-zinc-500 dark:text-zinc-500 italic">Who I want to meet:</p>
    <div class="flex flex-wrap gap-2">
      {bniData.referrals.ideal_partners.map((partner) => (
        <span class="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-mono">
          {partner}
        </span>
      ))}
    </div>
  </section>
</div>
```

- [ ] **Step 2: Commit Referrals section**

```bash
git add src/pages/bni/dance-card.astro
git commit -m "feat: implement referral triggers and partners"
```

---

### Task 5: Final Review and Polish

**Files:**
- Modify: `src/pages/bni/dance-card.astro`

- [ ] **Step 1: Add "Schedule 1-to-1" CTA**

```astro
<!-- Inside <Main> before the footer -->
<section class="pt-12">
  <a 
    href="mailto:varun@foundrysoft.io?subject=BNI 1-to-1 Meeting Request"
    class="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-lg text-sm font-medium hover:scale-105 transition-transform duration-300"
  >
    Schedule a 1-to-1
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  </a>
</section>
```

- [ ] **Step 2: Final Commit**

```bash
git add src/pages/bni/dance-card.astro
git commit -m "feat: add CTA and finalize BNI dance card"
```
