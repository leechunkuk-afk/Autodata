import { useState, useEffect } from "react";
export function useStoredState(key, initial) {
  const fullKey = `autodata:v1:${key}`;
  const [value, setValue] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(fullKey));
      return saved === null
        ? initial
        : Array.isArray(initial)
          ? Array.isArray(saved)
            ? saved
            : initial
          : typeof saved === typeof initial
            ? saved
            : initial;
    } catch {
      return initial;
    }
  });
  const [saveError, setSaveError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(fullKey, JSON.stringify(value));
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }, [fullKey, value]);
  return [value, setValue, saveError];
}
export function downloadText(filename, text) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
