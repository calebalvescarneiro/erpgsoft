export interface OfflinePayload<T> {
  timestamp: number;
  data: T;
}

export function persistOffline<T>(key: string, data: T) {
  const payload: OfflinePayload<T> = { timestamp: Date.now(), data };
  localStorage.setItem(key, JSON.stringify(payload));
}

export function readOffline<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as OfflinePayload<T>;
    return parsed.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to parse offline cache', error);
    return fallback;
  }
}
