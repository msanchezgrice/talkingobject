Below is a drop‑in markdown file (ROADMAP_V2.md) you can add to the repository root.
It is written as a set of instructions that Claude Sonnet 4.0 (or any other AI pair‑programmer) can follow phase‑by‑phase.
Each phase ends with clear Deliverables and an Exit Checklist so you can merge, test, or revert with minimal risk.

⸻


# Talking Objects v2 Roadmap 🚦

**Goal:** ship real‑time voice, persistent memory, location chat, Twitter/X syndication, and a full UI refresh without rewriting the stack.

<details>
<summary>TL;DR – why this plan</summary>

* We keep the existing **Next 15 + Supabase** skeleton; replacing it would throw away functioning auth, DB, and deployment.  [oai_citation:0‡supabase.com](https://supabase.com/docs/guides/functions/schedule-functions?utm_source=chatgpt.com) [oai_citation:1‡supabase.com](https://supabase.com/blog/supabase-cron?utm_source=chatgpt.com)  
* **OpenAI TTS (`tts‑1`)** is cheap ($0.015 / 1 k chars) and already covered by our account, while **ElevenLabs** offers <300 ms latency and premium cloned voices at ~$0.0002 / char for Pro. We'll ship both behind a toggle.  [oai_citation:2‡community.openai.com](https://community.openai.com/t/precise-pricing-for-tts-api/634297?utm_source=chatgpt.com) [oai_citation:3‡platform.openai.com](https://platform.openai.com/docs/guides/text-to-speech?utm_source=chatgpt.com) [oai_citation:4‡elevenlabs.io](https://elevenlabs.io/pricing?utm_source=chatgpt.com) [oai_citation:5‡elevenlabs.io](https://elevenlabs.io/pricing/api?utm_source=chatgpt.com) [oai_citation:6‡elevenlabs.io](https://elevenlabs.io/blog/how-do-you-optimize-latency-for-conversational-ai?utm_source=chatgpt.com) [oai_citation:7‡elevenlabs.io](https://elevenlabs.io/docs/models?utm_source=chatgpt.com)  
* Memory will mirror the pattern used by ChatGPT ("facts" in a vector store plus daily summaries) and what Alexa calls *persistent attributes*.  [oai_citation:8‡techradar.com](https://www.techradar.com/computing/artificial-intelligence/chatgpt-can-remember-more-about-you-than-ever-before-should-you-be-worried?utm_source=chatgpt.com) [oai_citation:9‡developer.amazon.com](https://developer.amazon.com/en-US/docs/alexa/alexa-skills-kit-sdk-for-python/manage-attributes.html?utm_source=chatgpt.com)  
* X posting is throttled to 300 updates / 3 h per user; randomised timing via **Vercel Cron** keeps our feed natural (Hobby plan triggers anywhere in a 59‑minute window).  [oai_citation:10‡developer.twitter.com](https://developer.twitter.com/en/docs/twitter-api/v1/rate-limits?utm_source=chatgpt.com) [oai_citation:11‡developer.twitter.com](https://developer.twitter.com/en/docs/twitter-api/rate-limits?utm_source=chatgpt.com) [oai_citation:12‡vercel.com](https://vercel.com/docs/cron-jobs/usage-and-pricing?utm_source=chatgpt.com)

</details>

---

## Phase 0 – Fork & Safety Net (½ day)

| Step | Action |
|------|--------|
| 0.1 | Fork `msanchezgrice/talkingobject → talkingobjects‑v2` (GitHub UI). |
| 0.2 | Copy this file into `/ROADMAP_V2.md`. |
| 0.3 | Enable **Vercel Preview Deployments** on the fork; production domain stays on the old repo. |
| 0.4 | Tag the current main branch `v1.0.0` for instant rollback. ||

**Exit checklist**

- [ ] Preview deployment green  
- [ ] v1.0.0 git tag pushed  

---

## Phase 1 – LLM Provider Abstraction (1–2 days)

### Tasks
1. **Create `lib/aiProvider.ts`**

```ts
export interface AIMessage { role: 'user'|'assistant'|'system'; content: string }
export interface LLMTool { name: string; schema: unknown }
export async function chatLLM(
  messages: AIMessage[],
  tools?: LLMTool[]
): Promise<AIMessage>
```

2. Replace existing lib/anthropic.ts calls with the interface above.
3. Implement provider: OpenAI
   • Use openai.chat.completions.create({ model:'gpt-4o-mini', stream:true, ... }) for text.
   • Add audio.speech.create wrapper for TTS.  
4. Feature flag (NEXT_PUBLIC_USE_ANTHROPIC=false) so we can roll back.

**Deliverables**
• lib/aiProvider.ts + tests
• Updated server actions / API routes

**Exit checklist**
• CI unit tests pass for Claude and OpenAI
• Manual chat works in preview with both flags

⸻

## Phase 2 – Voice Layer (3–4 days)

### Tasks
1. **POST /api/voice/:agentId**
   • Accept WAV/PCM blob → Whisper (openai.audio.transcriptions.create).
   • Forward transcript to chatLLM.
   • Return stream: ReadableStream<Uint8Array> from TTS provider.
2. **Add TTS provider selector**
   • lib/tts.ts routes to openaiTTS() or elevenLabsTTS() based on agent or user preference.
   • ElevenLabs creds via env ELEVEN_API_KEY.  
3. **Front‑end**
   • Add MicButton.tsx (hold‑to‑talk) and audio element for playback.
   • Cache returned MP3/opus in Supabase Storage.

**Deliverables**
• Voice API route
• Mic UI
• Supabase bucket voiceresponses

**Exit checklist**
• Latency < 700 ms with OpenAI, < 350 ms with ElevenLabs on test page.  
• Fallback to text when audio disabled

⸻

## Phase 3 – Memory & Daily Summaries (3 days)

### Tasks
1. **DB migrations**

```sql
create table user_memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users,
  key text,
  value text,
  embedding vector(1536),
  updated_at timestamptz default now()
);

create table daily_summaries (
  agent_id uuid references agents,
  summary_date date,
  summary text,
  embedding vector(1536),
  primary key (agent_id, summary_date)
);
```

2. **Classifier hook**
   • After every user message, call mini‑prompt "Is this a lasting fact?"; if yes, upsert to user_memory.
3. **Nightly summariser**
   • Supabase Edge Scheduler at 23:50 local runs SQL → GPT‑4o summary → insert into daily_summaries.  
4. **Retrieval**
   • Pre‑chat: cosine‑similarity top 3 user_memory + last 20 messages + yesterday's summary.

**Deliverables**
• Migration scripts in /supabase/migrations
• New lib/memory.ts
• Docs section in README

**Exit checklist**
• Memory toggle in user settings
• Summaries appear in DB next day

⸻

## Phase 4 – Explore 2.0 & Location Chat (2 days)

### Tasks
1. Add city varchar (or PostGIS point) column to agents.
2. /explore Server Component
   • Query by distinct city, group agents inside CityAccordion.
3. "Chat with this place" button links to /chat?agent=<id> pre‑loading system prompt with geo context.

**Exit checklist**
• Page renders ≤ 200 ms server‑time
• Deep link opens the right chat thread

⸻

## Phase 5 – Twitter / X Syndication (3 days)

### Tasks
1. **tweet_queue table:**

```sql
create table tweet_queue (
  id bigserial primary key,
  agent_id uuid,
  payload text,
  not_before timestamptz,
  tried int default 0
);
```

2. **/api/cron/tweet Edge Function**
   • SELECT * FROM tweet_queue WHERE not_before <= now() ORDER BY random() LIMIT 10  
   • Post via twitter-api-v2 (two‑legged bearer).  
   • Respect 300‑tweets‑per‑3 h limit (counter in KV / table).  
3. **Queue filler**
   • After nightly summary (#Phase 3) insert 10 tweets with not_before = now() + random() * interval '6 hours'.
4. **Cron schedule**
   • Vercel Cron */15 * * * * (every 15 min) – Hobby plan already adds up to 59 min jitter.  

**Exit checklist**
• Tweets visible on staging X account
• No 429 rate‑limit logs

⸻

## Phase 6 – Visual Redesign (Parallel / 1 week)
• Swap Tailwind tokens, adopt shadcn/ui components.
• Run Percy visual tests to guard regressions.

⸻

## Phase 7 – QA & Launch (1 week)
• Mobile smoke‑tests
• Performance budget: FCP < 1.8 s on 4G
• GDPR/CCPA privacy copy for memory feature

⸻

## Rollback Strategy
1. Merge each phase behind a feature flag (NEXT_PUBLIC_V2_PHASE_X).
2. If metrics regress, disable flag → old path activates instantly.
3. v1.0.0 tag remains deployed at v1.talkingobjects.ai for 30 days.

⸻

## Appendix A – Reference Material
• OpenAI TTS pricing & docs  
• ElevenLabs pricing & latency specs  
• Supabase Edge Function scheduler  
• ChatGPT memory announcement analysis  
• Alexa persistent attributes (DynamoDB)  
• Twitter posting limits  
• node‑twitter‑api‑v2 examples  
• Vercel Cron jitter window (Hobby)  

⸻

Copy‑paste this file into the repo, create phase-1 branch, and let Claude crank through each section. Good luck!

---

### How to use

1. **Add** `ROADMAP_V2.md` exactly as above.  
2. When you spin up Claude Sonnet 4.0 in your IDE, give it a simple prompt:

> "Please start with **Phase 1** in `ROADMAP_V2.md`, open a new branch, and push a PR when the exit checklist is green."

3. Review, merge, flip the feature flag, and move to the next phase. 