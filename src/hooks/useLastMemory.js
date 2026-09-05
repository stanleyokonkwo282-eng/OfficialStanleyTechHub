const STORAGE_KEY = "cha_last_memory";

function getLastMemory() {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (!parsed || !parsed.courseId || !parsed.lessonId) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveLastMemory(memory) {
  if (typeof window === "undefined" || !memory) return;
  try {
    const payload = {
      courseId: memory.courseId,
      lessonId: memory.lessonId,
      lessonTitle: memory.lessonTitle || "",
      moduleNumber: memory.moduleNumber || 1,
      lessonNumber: memory.lessonNumber || 1,
      courseTitle: memory.courseTitle || "",
      lastActiveAt: memory.lastActiveAt || new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore quota errors
  }
}

function clearLastMemory() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function useLastMemory() {
  const memory = getLastMemory();

  const updateMemory = (data) => {
    saveLastMemory({
      ...data,
      lastActiveAt: new Date().toISOString(),
    });
  };

  const resetMemory = () => {
    clearLastMemory();
  };

  const formatLastActive = (iso) => {
    if (!iso) return "";
    try {
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return "";
      return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return {
    memory,
    updateMemory,
    resetMemory,
    formatLastActive,
  };
}
