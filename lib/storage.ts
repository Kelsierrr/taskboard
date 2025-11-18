// Simple localStorage helpers (safe for client components)
const BOARDS_KEY = "taskboard_boards"; // [{id,name,description}]
const BOARD_KEY = (id: string) => `taskboard_board_${id}`; // {name, description, lists}

export type StoredBoardMeta = { id: string; name: string; description?: string };
export type StoredList = { id: string; title: string; tasks: any[] };
export type StoredBoardData = { name: string; description?: string; lists: StoredList[] };

export function loadBoards(): StoredBoardMeta[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOARDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
export function saveBoards(boards: StoredBoardMeta[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(BOARDS_KEY, JSON.stringify(boards));
}

export function loadBoardData(id: string): StoredBoardData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(BOARD_KEY(id));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export function saveBoardData(id: string, data: StoredBoardData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(BOARD_KEY(id), JSON.stringify(data));
}

export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// --- new helpers ---
export function updateBoardMeta(id: string, updater: (m: StoredBoardMeta) => StoredBoardMeta) {
  const all = loadBoards();
  const idx = all.findIndex((m) => m.id === id);
  if (idx === -1) return;
  all[idx] = updater(all[idx]);
  saveBoards(all);
}

export function deleteBoard(id: string) {
  if (typeof window === "undefined") return;
  // remove meta
  const all = loadBoards().filter((m) => m.id !== id);
  saveBoards(all);
  // remove per-board data
  localStorage.removeItem(`taskboard_board_${id}`);
}
