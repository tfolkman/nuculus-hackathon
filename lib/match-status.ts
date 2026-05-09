"use client";

import { Match } from "@/lib/types";

const STORAGE_KEY = "nucleus_match_statuses";

export type PersistedMatchStatus = {
  status: Match["status"];
  reviewedAt: string;
  reviewer?: string;
  affinitySyncStatus: Match["affinitySyncStatus"];
};

function getStore(): Record<string, PersistedMatchStatus> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setStore(store: Record<string, PersistedMatchStatus>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function makeKey(sourceId: string, targetId: string): string {
  return `${sourceId}--${targetId}`;
}

export function getMatchStatus(sourceId: string, targetId: string): PersistedMatchStatus | null {
  const store = getStore();
  return store[makeKey(sourceId, targetId)] || null;
}

export function setMatchStatus(
  sourceId: string,
  targetId: string,
  status: Match["status"],
  affinitySyncStatus: Match["affinitySyncStatus"] = "not_synced",
  reviewer?: string
): void {
  const store = getStore();
  store[makeKey(sourceId, targetId)] = {
    status,
    reviewedAt: new Date().toISOString(),
    reviewer,
    affinitySyncStatus,
  };
  setStore(store);
}

export function getAllMatchStatuses(): Record<string, PersistedMatchStatus> {
  return getStore();
}

export function clearMatchStatus(sourceId: string, targetId: string): void {
  const store = getStore();
  delete store[makeKey(sourceId, targetId)];
  setStore(store);
}
