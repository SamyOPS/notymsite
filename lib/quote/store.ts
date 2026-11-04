"use client";

import { useSyncExternalStore } from "react";
import {
  addLine,
  parseLines,
  removeLine,
  setLineQuantity,
  type QuoteLine,
} from "./lines";

/**
 * Sélection de produits pour la demande de devis, conservée dans le
 * localStorage du visiteur (pas de compte client). Synchronisée entre onglets.
 */

const STORAGE_KEY = "notym:devis:v1";
const EMPTY: QuoteLine[] = [];

let cache: QuoteLine[] | null = null;
const listeners = new Set<() => void>();

function read(): QuoteLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? parseLines(JSON.parse(raw)) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): QuoteLine[] {
  cache ??= read();
  return cache;
}

function getServerSnapshot(): QuoteLine[] {
  return EMPTY;
}

function write(next: QuoteLine[]) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Stockage indisponible (navigation privée, quota) : la sélection reste en mémoire.
  }
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  cache = null;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

/** Événement émis à chaque ajout (rebond du compteur dans le header). */
export const QUOTE_ADDED_EVENT = "notym:devis-ajout";

export function addToQuote(productId: string, quantity = 1) {
  write(addLine(getSnapshot(), productId, quantity));
  window.dispatchEvent(new Event(QUOTE_ADDED_EVENT));
}

export function updateQuoteQuantity(productId: string, quantity: number) {
  write(setLineQuantity(getSnapshot(), productId, quantity));
}

export function removeFromQuote(productId: string) {
  write(removeLine(getSnapshot(), productId));
}

export function clearQuote() {
  write(EMPTY);
}

export function useQuoteLines(): QuoteLine[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Nombre de références distinctes dans la sélection. */
export function useQuoteCount(): number {
  return useQuoteLines().length;
}
