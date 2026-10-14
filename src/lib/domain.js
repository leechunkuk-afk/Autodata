export const effects = [
  {
    id: "pop",
    name: "팝 인",
    use: "핵심 문장 하나를 짧게 강조할 때",
    avoid: "긴 안내문 전체를 한꺼번에 강조할 때",
  },
  {
    id: "fade",
    name: "페이드 인",
    use: "차분하게 제목이나 설명을 보여줄 때",
    avoid: "순간적인 타이밍이 중요한 강조 장면",
  },
  {
    id: "slide",
    name: "슬라이드 인",
    use: "이름표·단계 안내를 순서대로 보여줄 때",
    avoid: "화면에 이미 움직임이 많은 장면",
  },
];
export function timeToSeconds(value) {
  const text = String(value).trim();
  if (!/^\d+(?::\d{1,2}){0,2}(?:\.\d+)?$/.test(text)) return NaN;
  const parts = text.split(":").map(Number);
  if (parts.length > 1 && parts.slice(1).some((p) => p >= 60)) return NaN;
  return parts.reduce((sum, p) => sum * 60 + p, 0);
}
export function validateClips(clips) {
  return clips.flatMap((clip, index) => {
    const start = timeToSeconds(clip.start),
      end = timeToSeconds(clip.end);
    const errors = [];
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start)
      errors.push(
        `${index + 1}번: 끝 시간은 시작 시간보다 뒤여야 합니다. 시간은 초 또는 분:초로 적어주세요.`,
      );
    if (!clip.text.trim())
      errors.push(`${index + 1}번: 화면에 넣을 자막을 적어주세요.`);
    return errors;
  });
}
export function buildVideoPrompt({ filename, ratio, clips }) {
  return `아래 주문으로 영상 편집을 진행해 줘.\n영상 파일: ${filename.trim() || "[파일 이름을 입력하세요]"}\n화면 비율: ${ratio}\n\n${clips.map((c, i) => `${i + 1}. ${c.start}~${c.end} / 자막: ${c.text} / 효과: ${effects.find((e) => e.id === c.effect)?.name || c.effect} / 위치: ${c.position}`).join("\n")}\n\n먼저 파일 접근과 필요한 편집 도구를 확인해 줘. 원본 영상과 음성을 보존하고 결과는 별도 파일로 저장해 줘. 첫 구간을 짧게 만들어 글자 잘림·읽는 시간·음성 동기화를 확인한 뒤 나머지 구간에 적용해 줘. 실행할 수 없으면 편집 지시표로 제공하고, 실행했다고 말하지 마.`;
}
export function buildMeeting({ title, date, decisions, tasks, questions }) {
  const escapeCell = (v) =>
    (v.trim() || "미정").replace(/\|/g, "\\|").replace(/\n/g, " ");
  return `# ${title.trim() || "회의록"}\n\n날짜: ${date || "미정"}\n\n## 결정 사항\n${decisions.trim() || "미정 — 확정된 결정이 없습니다."}\n\n## 할 일\n| 할 일 | 담당자 | 기한 |\n| --- | --- | --- |\n${tasks.map((t) => `| ${escapeCell(t.task)} | ${escapeCell(t.owner)} | ${escapeCell(t.due)} |`).join("\n")}\n\n## 추가 확인\n${questions.trim() || "없음"}\n\n※ 빈 담당자·기한은 미정으로 표시했습니다. 공유 전에 원문과 대조하세요.`;
}
export const labels = ["예약 변경", "취소", "사람 확인"];
export const sampleCases = [
  {
    id: 1,
    text: "내일 예약 시간을 오후 3시로 변경하고 싶어요.",
    expected: "예약 변경",
  },
  { id: 2, text: "예약을 취소해 주세요.", expected: "취소" },
  { id: 3, text: "영업시간이 어떻게 되나요?", expected: "사람 확인" },
  {
    id: 4,
    text: "취소하지 말고 예약 시간을 변경해 주세요.",
    expected: "예약 변경",
  },
  {
    id: 5,
    text: "방문을 못 할 것 같아요. 어떻게 하면 되나요?",
    expected: "사람 확인",
  },
  { id: 6, text: "예약 날짜를 옮길 수 있나요?", expected: "예약 변경" },
];
export function classify(text, changeWords, cancelWords) {
  const contains = (words) =>
    words
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean)
      .some((w) => text.includes(w));
  const change = contains(changeWords),
    cancel = contains(cancelWords);
  if (change === cancel) return "사람 확인";
  return change ? "예약 변경" : "취소";
}
export function evaluate(cases, changeWords, cancelWords) {
  const rows = cases.map((c) => ({
    ...c,
    actual: classify(c.text, changeWords, cancelWords),
  }));
  return {
    rows,
    correct: rows.filter((r) => r.actual === r.expected).length,
    review: rows.filter((r) => r.actual === "사람 확인").length,
    total: rows.length,
  };
}
