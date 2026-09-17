// Service to synchronize date choice between girlfriend and boyfriend devices

const STORAGE_KEY = 'gf_troll_date_choice_v2';
const DEFAULT_TOPIC = 'gf_troll_duy_date_choice_2026';

// Read local data
export function getLocalChoice() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// Save local and optionally broadcast to cloud
export async function saveChoice(data) {
  if (typeof window === 'undefined') return;

  const current = getLocalChoice() || {};
  const updated = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  // 1. Save to local storage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('LocalStorage error:', e);
  }

  // 2. Broadcast to cloud topic (ntfy pub/sub - free, fast, zero-config)
  const topic = (typeof window !== 'undefined' && localStorage.getItem('gf_troll_custom_topic')) || DEFAULT_TOPIC;
  try {
    fetch(`https://ntfy.sh/${topic}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Title': '💌 Em ý vừa thao tác trên ứng dụng!',
      },
      body: JSON.stringify({
        type: 'date_choice_update',
        payload: updated,
      }),
    }).catch(() => {});
  } catch (e) {
    // Silently ignore network failures in background
  }

  return updated;
}

// Fetch latest data from cloud
export async function fetchCloudChoice() {
  const topic = (typeof window !== 'undefined' && localStorage.getItem('gf_troll_custom_topic')) || DEFAULT_TOPIC;
  try {
    const res = await fetch(`https://ntfy.sh/${topic}/json?poll=1`, {
      cache: 'no-store',
    });
    if (!res.ok) return getLocalChoice();

    const text = await res.text();
    const lines = text.trim().split('\n').filter(Boolean);

    let latestPayload = null;
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const item = JSON.parse(lines[i]);
        if (item.message) {
          const parsedMsg = typeof item.message === 'string' ? JSON.parse(item.message) : item.message;
          if (parsedMsg?.payload) {
            latestPayload = parsedMsg.payload;
            break;
          }
        }
      } catch (err) {
        // Skip invalid lines
      }
    }

    if (latestPayload) {
      // Sync into local storage for caching
      try {
        const currentLocal = getLocalChoice();
        if (!currentLocal || new Date(latestPayload.updatedAt || 0) >= new Date(currentLocal.updatedAt || 0)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(latestPayload));
          return latestPayload;
        }
      } catch (e) {}
    }
  } catch (e) {
    console.warn('Could not fetch cloud data, falling back to local', e);
  }

  return getLocalChoice();
}

// Clear choice (reset)
export async function clearChoice() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}

  const resetData = {
    selectedDate: null,
    selectedTime: null,
    rejectCount: 0,
    status: 'reset',
    updatedAt: new Date().toISOString(),
  };

  const topic = localStorage.getItem('gf_troll_custom_topic') || DEFAULT_TOPIC;
  try {
    fetch(`https://ntfy.sh/${topic}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'date_choice_reset',
        payload: resetData,
      }),
    }).catch(() => {});
  } catch (e) {}

  return resetData;
}

export function getTopicName() {
  if (typeof window === 'undefined') return DEFAULT_TOPIC;
  return localStorage.getItem('gf_troll_custom_topic') || DEFAULT_TOPIC;
}

