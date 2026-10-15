import { resolveRef, type ResolvedRef } from "./relations";

export function getFamilyLink(id: string): ResolvedRef | null {
  return resolveRef(id);
}

export function readingMinutesFor(body: string[]): number {
  const words = body.join(" ").split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
