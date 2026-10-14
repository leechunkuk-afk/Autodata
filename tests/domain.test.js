import { test } from "node:test";
import assert from "node:assert/strict";
import {
  timeToSeconds,
  validateClips,
  buildMeeting,
  buildVideoPrompt,
  classify,
  evaluate,
  sampleCases,
} from "../src/lib/domain.js";
import { guides } from "../src/content/guides.js";
import { terms } from "../src/content/terms.js";

test("video time accepts seconds and timestamps, rejects malformed intervals", () => {
  assert.equal(timeToSeconds("01:23.5"), 83.5);
  assert.equal(timeToSeconds("1:02:03"), 3723);
  assert.equal(timeToSeconds("0"), 0);
  for (const bad of ["", "-1", "1:60", "1:90:00", "NaN", "1e3"])
    assert.ok(Number.isNaN(timeToSeconds(bad)), bad);
  assert.equal(validateClips([{ start: "10", end: "9", text: " " }]).length, 2);
  assert.equal(
    validateClips([{ start: "00:12", end: "00:16", text: "읽을 자막" }]).length,
    0,
  );
});
test("meeting preserves unknown values and escapes table separators", () => {
  const output = buildMeeting({
    title: "회의",
    date: "",
    decisions: "",
    questions: "",
    tasks: [{ task: "A|B\n확인", owner: "", due: "" }],
  });
  assert.match(output, /날짜: 미정/);
  assert.ok(output.includes("A\\|B 확인 | 미정 | 미정"));
  assert.match(output, /확정된 결정이 없습니다/);
});
test("video prompt reflects settings and asks for evidence before full work", () => {
  const output = buildVideoPrompt({
    filename: "test.mp4",
    ratio: "9:16",
    clips: [
      {
        start: "3",
        end: "8",
        text: "새 자막",
        effect: "slide",
        position: "화면 중앙",
      },
    ],
  });
  for (const expected of [
    "test.mp4",
    "9:16",
    "3~8",
    "새 자막",
    "슬라이드 인",
    "화면 중앙",
    "실행했다고 말하지 마",
  ])
    assert.ok(output.includes(expected));
});
test("ambiguous and absent keywords route to human review", () => {
  assert.equal(classify("취소하지 말고 변경", "변경", "취소"), "사람 확인");
  assert.equal(classify("문의입니다", "", ""), "사람 확인");
  assert.equal(classify("날짜 변경 요청", "변경, 옮", "취소"), "예약 변경");
  const result = evaluate(sampleCases, "변경, 옮", "취소");
  assert.equal(result.total, 6);
  assert.equal(result.correct, 5);
  assert.equal(result.review, 3);
});
test("every guide has valid related resources, sources and actionable content", () => {
  const ids = new Set(guides.map((g) => g.id));
  assert.equal(ids.size, guides.length);
  for (const g of guides) {
    assert.equal(g.sections.length, 3);
    assert.equal(g.checks.length, 3);
    assert.ok(g.prompt.length > 80);
    assert.equal(new URL(g.source).hostname, "nondev-thinking.web.app");
    for (const r of g.related) assert.ok(ids.has(r), `${g.id} -> ${r}`);
    if (g.lab) assert.ok(["meeting", "video", "classify"].includes(g.lab));
  }
  assert.equal(new Set(terms.map((t) => t.id)).size, terms.length);
  assert.equal(terms.length, 30);
  assert.ok(terms.every((t) => t.meaning && t.example && t.action));
});
