import { STORAGE_KEYS } from "./ccps-rules.js";

export function readStore(name, fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[name]);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}
export function writeStore(name, value) {
  localStorage.setItem(STORAGE_KEYS[name], JSON.stringify(value));
}
export { STORAGE_KEYS };

