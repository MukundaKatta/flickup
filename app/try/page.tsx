"use client";

import { useState } from "react";
import Link from "next/link";

interface Clip {
  timestamp: string;
  hook: string;
  excerpt: string;
}

const PLACEHOLDER_TRANSCRIPT = `Welcome back to the show. Today we're talking about the creator economy and why most podcasters are leaving money on the table. I've been doing this for six years, and the number one mistake I see is that people record incredible content and then let it sit on Spotify, untouched, for months. Nobody's going back to listen to episode 47. But a 60-second clip? That travels. That gets shared. That gets you new subscribers who never would have found the RSS feed. We interviewed 200 top creators last quarter and 94% said short-form clips were their fastest-growing traffic source. The second mistake is manual clipping. I used to spend four hours per episode just scrubbing through audio, trying to find the moments that would pop. Four hours. And half the time I'd pick the wrong ones. The ones that feel good in context don't always translate out of context. What actually works is punchlines, pattern interrupts, and surprising stats. A sentence that stands alone. That's the formula. The third thing I want to talk about is platform-tuning. TikTok captions need to be bigger. Reels want a hook in the first two seconds or the algorithm buries you. YouTube Shorts gives you 60 seconds so you can go deeper. One clip is not a one-size-fits-all. You need to remix for each platform or you're wasting distribution. I'll leave you with this: the podcast is the source of truth. Everything else is packaging. If you nail the packaging, the source speaks for itself.`;

function detectClips(transcript: string): Clip[] {
  // Split into sentences by punctuation
  const sentences = transcript
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // Score sentences by: length (medium = good), presence of numbers/stats, strong openers
  const scored = sentences.map((s, i) => {
    let score = 0;
    const wordCount = s.split(/\s+/).length;

    // Prefer punchy sentences (10-30 words)
    if (wordCount >= 10 && wordCount <= 30) score += 3;
    else if (wordCount >= 5 && wordCount < 10) score += 1;

    // Boost sentences with numbers/stats
    if (/\d+/.test(s)) score += 3;

    // Boost sentences with strong openers
    if (/^(the|that|this|what|why|nobody|one|if|i've|i used)/i.test(s)) score += 2;

    // Boost sentences with exclamation energy words
    if (/travels|pops|buries|wasting|nail|formula|mistake|incredible|fastest/i.test(s)) score += 2;

    // Slightly prefer sentences in the middle/later of the transcript (past intro)
    if (i > sentences.length * 0.2) score += 1;

    return { s, score, i };
  });

  // Pick top 3, spread them out (no two adjacent)
  const sorted = [...scored].sort((a, b) => b.score - a.score);
  const picked: typeof scored = [];
  for (const candidate of sorted) {
    if (picked.length >= 3) break;
    const tooClose = picked.some((p) => Math.abs(p.i - candidate.i) < 2);
    if (!tooClose) picked.push(candidate);
  }

  // Sort by original position so timestamps are ascending
  picked.sort((a, b) => a.i - b.i);

  // Estimate rough timestamps: assume ~120 wpm average podcast speed
  let wordOffset = 0;
  const sentenceWordCounts = sentences.map((s) => s.split(/\s+/).length);

  return picked.map((p) => {
    // Count words before this sentence
    const wordsBeforeThis = sentenceWordCounts
      .slice(0, p.i)
      .reduce((acc, n) => acc + n, 0);
    const totalSeconds = Math.round((wordsBeforeThis / 120) * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const timestamp = `${mins}:${secs.toString().padStart(2, "0")}`;

    // Generate a one-line hook from the sentence
    const words = p.s.split(/\s+/);
    const hook =
      words.length <= 12
        ? p.s.replace(/[.!?]$/, "")
        : words.slice(0, 12).join(" ") + "...";

    return { timestamp, hook, excerpt: p.s };
  });

  void wordOffset; // satisfy TS
}

export default function TryPage() {
  const [transcript, setTranscript] = useState("");
  const [clips, setClips] = useState<Clip[] | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = transcript.trim();
    if (!text) return;
    setClips(detectClips(text));
  }

  function handleReset() {
    setClips(null);
    setTranscript("");
  }

  function handleLoadSample() {
    setTranscript(PLACEHOLDER_TRANSCRIPT);
    setClips(null);
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Flickup
        </Link>
        <Link
          href="/#waitlist"
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          Get early access
        </Link>
      </nav>

      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
            Clip finder · v0 preview
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Paste a transcript. Get your best clips.
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            We detect clipworthy moments by sentence structure, length, and punch. Real AI coming
            soon.
          </p>
        </div>

        {clips === null ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste your podcast transcript here…"
              rows={12}
              required
              className="w-full rounded-2xl border border-neutral-300 bg-white px-5 py-4 text-sm leading-relaxed placeholder-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-900/10 resize-none"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-full bg-neutral-900 px-7 py-3.5 font-medium text-white transition hover:bg-neutral-700"
              >
                Find clipworthy moments →
              </button>
              <button
                type="button"
                onClick={handleLoadSample}
                className="rounded-full border border-neutral-300 px-5 py-3.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-900"
              >
                Load sample
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-emerald-700">
                3 clipworthy moments found
              </p>
              <button
                onClick={handleReset}
                className="text-xs text-neutral-500 underline hover:text-neutral-800"
              >
                Try another transcript
              </button>
            </div>

            {clips.map((clip, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                        {clip.timestamp}
                      </span>
                      <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                        Clip {idx + 1}
                      </span>
                    </div>
                    <p className="text-base font-semibold text-neutral-900 leading-snug">
                      {clip.hook}
                    </p>
                    <p className="mt-2 text-sm text-neutral-500 leading-relaxed line-clamp-2">
                      {clip.excerpt}
                    </p>
                  </div>
                  <div className="shrink-0 aspect-[9/16] w-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-end p-1">
                    <span className="text-[8px] text-white font-bold">{clip.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
              <p className="text-sm font-semibold text-emerald-900">
                Want 60 clips from a full episode, with captions and scheduling?
              </p>
              <Link
                href="/#waitlist"
                className="mt-3 inline-block rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Join the waitlist
              </Link>
            </div>

            <p className="text-center text-xs text-neutral-400">
              This is a v0 preview — clip detection uses heuristics, not AI.{" "}
              <Link href="/#waitlist" className="underline hover:text-neutral-600">
                Join the waitlist
              </Link>{" "}
              for the real thing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
