import { useState } from "react";
import {
  Plus,
  Trash2,
  RotateCcw,
  Play,
  Check,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { labs } from "./Labs";
import {
  Breadcrumb,
  Field,
  ExportButtons,
  StorageNotice,
  LinkButton,
} from "../components/UI";
import { useStoredState } from "../lib/storage";
import {
  effects,
  buildMeeting,
  buildVideoPrompt,
  validateClips,
  labels,
  sampleCases,
  evaluate,
} from "../lib/domain";
const meetingExample = {
  title: "가을 행사 준비 회의",
  date: "2026-10-15",
  decisions:
    "행사 안내는 한 장으로 정리한다.\n참가 신청은 다음 회의에서 최종 확인한다.",
  tasks: [
    { task: "안내문 초안 작성", owner: "민지", due: "2026-10-19" },
    { task: "행사 장소 확인", owner: "", due: "" },
  ],
  questions: "행사 장소와 최종 참가 인원은 아직 확정되지 않았습니다.",
};
const videoExample = {
  filename: "lesson.mp4",
  ratio: "16:9",
  clips: [
    {
      start: "00:12",
      end: "00:16",
      text: "준비물은 세 가지",
      effect: "pop",
      position: "하단 중앙",
    },
  ],
};
function Restore({ onRestore }) {
  return (
    <button
      className="text-button"
      onClick={() => {
        if (
          window.confirm(
            "현재 입력을 예제 내용으로 바꿀까요? 보관할 내용이 있다면 취소하고 파일로 저장하세요.",
          )
        )
          onRestore();
      }}
    >
      <RotateCcw size={15} />
      예제 다시 불러오기
    </button>
  );
}
function Meeting() {
  const [data, setData, error] = useStoredState(
    "meeting-draft",
    meetingExample,
  );
  const set = (name, value) => setData({ ...data, [name]: value });
  const setTask = (index, name, value) =>
    set(
      "tasks",
      data.tasks.map((t, i) => (i === index ? { ...t, [name]: value } : t)),
    );
  const text = buildMeeting(data);
  const invalid = !data.title.trim() || data.tasks.some((t) => !t.task.trim());
  const missing = data.tasks.filter((t) => !t.owner.trim() || !t.due).length;
  return (
    <>
      <div className="lab-description">
        <b>예제 메모</b>
        <p>
          “10월 15일 가을 행사 준비 회의입니다. 안내는 한 장으로 정리하고,
          민지가 10월 19일까지 초안을 쓰기로 했어요. 참가 신청은 다음 회의에서
          최종 확인합니다. 장소와 최종 참가 인원은 미정이고, 장소를 확인할
          담당자와 기한도 정하지 않았어요.”
        </p>
        <span>
          아래는 이 가상 메모를 사람이 항목별로 나눈 예시입니다. 이 도구는 AI
          요약을 하지 않습니다.
        </span>
      </div>
      <div className="workspace">
        <section className="editor">
          <div className="section-title">
            <h2>01. 내용을 정리하세요</h2>
            <Restore onRestore={() => setData(meetingExample)} />
          </div>
          <div className="form-grid">
            <Field label="회의 이름">
              <input
                value={data.title}
                onChange={(e) => set("title", e.target.value)}
                maxLength={200}
              />
            </Field>
            <Field label="회의 날짜">
              <input
                type="date"
                value={data.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </Field>
          </div>
          <Field
            label="확정된 결정 사항"
            help="의견이나 제안은 추가 확인에 적어주세요."
          >
            <textarea
              rows={3}
              value={data.decisions}
              onChange={(e) => set("decisions", e.target.value)}
            />
          </Field>
          <h3>할 일 · 담당자 · 기한</h3>
          <div className="task-rows">
            {data.tasks.map((t, i) => (
              <div className="task-row" key={i}>
                <Field label={`할 일 ${i + 1}`}>
                  <input
                    value={t.task}
                    placeholder="예: 안내문 초안 작성"
                    onChange={(e) => setTask(i, "task", e.target.value)}
                  />
                </Field>
                <Field label={`담당자 ${i + 1}`}>
                  <input
                    value={t.owner}
                    placeholder="미정"
                    onChange={(e) => setTask(i, "owner", e.target.value)}
                  />
                </Field>
                <Field label={`기한 ${i + 1}`}>
                  <input
                    type="date"
                    value={t.due}
                    onChange={(e) => setTask(i, "due", e.target.value)}
                  />
                </Field>
                <button
                  className="icon-button delete"
                  aria-label={`할 일 ${i + 1} 삭제`}
                  onClick={() =>
                    set(
                      "tasks",
                      data.tasks.filter((_, n) => n !== i),
                    )
                  }
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
          <button
            className="button secondary compact"
            onClick={() =>
              set("tasks", [...data.tasks, { task: "", owner: "", due: "" }])
            }
          >
            <Plus size={16} />할 일 추가
          </button>
          <Field label="추가 확인할 사항">
            <textarea
              rows={3}
              value={data.questions}
              onChange={(e) => set("questions", e.target.value)}
            />
          </Field>
          <StorageNotice error={error} />
        </section>
        <section className="result-panel">
          <div className="section-title">
            <h2>02. 공유 전에 확인하세요</h2>
            <span className="live-label">입력 즉시 반영</span>
          </div>
          {missing > 0 && (
            <p className="notice">
              담당자나 기한이 미정인 할 일이 {missing}개 있어요. 추측해서 채우지
              않고 확인할 항목으로 남겨뒀어요.
            </p>
          )}
          {invalid && (
            <p className="error" role="alert">
              회의 이름과 추가한 할 일의 내용을 채워주세요.
            </p>
          )}
          <pre className="output-text" tabIndex={0}>
            {text}
          </pre>
          <ExportButtons text={text} filename="회의록.md" disabled={invalid} />
          <p className="small">
            저장한 Markdown 파일은 메모장이나 문서 편집기로 열 수 있습니다.
          </p>
        </section>
      </div>
    </>
  );
}
function Video() {
  const [data, setData, error] = useStoredState("video-draft", videoExample);
  const [selected, setSelected] = useState(0),
    [replay, setReplay] = useState(0),
    [playing, setPlaying] = useState(false);
  const set = (key, value) => setData({ ...data, [key]: value });
  const setClip = (index, key, value) => {
    set(
      "clips",
      data.clips.map((c, i) => (i === index ? { ...c, [key]: value } : c)),
    );
    setSelected(index);
  };
  const clip = data.clips[Math.min(selected, data.clips.length - 1)];
  const effect = effects.find((e) => e.id === clip?.effect);
  const errors = [
    ...(!data.filename.trim() ? ["영상 파일 이름을 적어주세요."] : []),
    ...validateClips(data.clips),
  ];
  const prompt = buildVideoPrompt(data);
  return (
    <>
      <p className="notice">
        영상 파일을 업로드하거나 편집하는 도구가 아닙니다. 구간별 요청문을
        만들고, 선택한 효과의 움직임을 예시로 확인합니다.
      </p>
      <div className="workspace">
        <section className="editor">
          <div className="section-title">
            <h2>01. 편집할 구간을 정하세요</h2>
            <Restore
              onRestore={() => {
                setData(videoExample);
                setSelected(0);
              }}
            />
          </div>
          <div className="form-grid">
            <Field label="영상 파일 이름">
              <input
                value={data.filename}
                onChange={(e) => set("filename", e.target.value)}
                placeholder="예: lesson.mp4"
              />
            </Field>
            <Field label="화면 비율">
              <select
                value={data.ratio}
                onChange={(e) => set("ratio", e.target.value)}
              >
                <option>16:9</option>
                <option>9:16</option>
                <option>1:1</option>
              </select>
            </Field>
          </div>
          {data.clips.map((c, i) => (
            <fieldset className="clip-form" key={i}>
              <legend>구간 {i + 1}</legend>
              <div className="form-grid">
                <Field label={`시작 시간 ${i + 1}`}>
                  <input
                    value={c.start}
                    onChange={(e) => setClip(i, "start", e.target.value)}
                    placeholder="00:12"
                  />
                </Field>
                <Field label={`끝 시간 ${i + 1}`}>
                  <input
                    value={c.end}
                    onChange={(e) => setClip(i, "end", e.target.value)}
                    placeholder="00:16"
                  />
                </Field>
              </div>
              <Field label={`화면 자막 ${i + 1}`}>
                <input
                  value={c.text}
                  onChange={(e) => setClip(i, "text", e.target.value)}
                  maxLength={120}
                />
              </Field>
              <div className="form-grid">
                <Field label={`효과 ${i + 1}`}>
                  <select
                    value={c.effect}
                    onChange={(e) => setClip(i, "effect", e.target.value)}
                  >
                    {effects.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={`위치 ${i + 1}`}>
                  <select
                    value={c.position}
                    onChange={(e) => setClip(i, "position", e.target.value)}
                  >
                    <option>하단 중앙</option>
                    <option>화면 중앙</option>
                    <option>상단 중앙</option>
                  </select>
                </Field>
              </div>
              <div className="button-row">
                <button
                  className="text-button"
                  onClick={() => {
                    setSelected(i);
                    setReplay(replay + 1);
                    setPlaying(true);
                  }}
                >
                  <Play size={14} />이 구간 미리보기
                </button>
                {data.clips.length > 1 && (
                  <button
                    className="text-button muted"
                    aria-label={`구간 ${i + 1} 삭제`}
                    onClick={() => {
                      set(
                        "clips",
                        data.clips.filter((_, n) => n !== i),
                      );
                      setSelected(0);
                    }}
                  >
                    <Trash2 size={14} />
                    구간 삭제
                  </button>
                )}
              </div>
            </fieldset>
          ))}
          <button
            className="button secondary compact"
            onClick={() =>
              set("clips", [
                ...data.clips,
                {
                  start: "00:20",
                  end: "00:24",
                  text: "",
                  effect: "fade",
                  position: "하단 중앙",
                },
              ])
            }
          >
            <Plus size={16} />
            구간 추가
          </button>
          <StorageNotice error={error} />
        </section>
        <section className="result-panel">
          <h2>02. 효과와 주문서를 확인하세요</h2>
          <div className={`effect-stage ratio-${data.ratio.replace(":", "-")}`}>
            <div className="stage-label">
              {Math.min(selected + 1, data.clips.length)}번 구간 · 움직임 예시
            </div>
            <div
              className={`caption-position ${clip?.position === "화면 중앙" ? "middle" : clip?.position === "상단 중앙" ? "top" : "bottom"}`}
            >
              <span
                key={`${selected}-${replay}-${clip?.effect}`}
                className={`effect-caption ${playing ? `animate-${clip?.effect}` : ""}`}
                style={{ animationPlayState: playing ? "running" : "paused" }}
              >
                {clip?.text || "자막을 입력하세요"}
              </span>
            </div>
            <div className="stage-footer">
              {data.ratio} · {effect?.name}
            </div>
          </div>
          <button
            className="text-button"
            onClick={() => {
              setReplay(replay + 1);
              setPlaying(true);
            }}
          >
            <RotateCcw size={15} />
            다시 재생
          </button>
          <div className="effect-advice">
            <p>
              <b>이럴 때 좋아요</b>
              {effect?.use}
            </p>
            <p>
              <b>다른 효과를 고려하세요</b>
              {effect?.avoid}
            </p>
          </div>
          {errors.length > 0 && (
            <ul className="error" role="alert">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
          <details className="generated-prompt" open>
            <summary>완성된 요청문 보기</summary>
            <pre className="output-text" tabIndex={0}>
              {prompt}
            </pre>
          </details>
          <ExportButtons
            text={prompt}
            filename="영상-편집-주문서.txt"
            disabled={errors.length > 0}
          />
          <p className="small">
            복사한 요청문을 영상 파일에 접근할 수 있는 AI 코딩 도구에
            전달하세요. 실제 영상 결과는 해당 도구에서 확인합니다.
          </p>
        </section>
      </div>
    </>
  );
}
function Classify() {
  const [data, setData, error] = useStoredState("classify-draft", {
    changeWords: "변경, 옮",
    cancelWords: "취소, 취소해",
    cases: sampleCases,
  });
  const [result, setResult] = useState(null);
  const set = (key, value) => {
    setData({ ...data, [key]: value });
    setResult(null);
  };
  const update = (i, key, value) =>
    set(
      "cases",
      data.cases.map((c, n) => (n === i ? { ...c, [key]: value } : c)),
    );
  const invalid =
    !data.cases.length ||
    data.cases.some((c) => !c.text.trim()) ||
    !data.changeWords.trim() ||
    !data.cancelWords.trim();
  const output = result
    ? `# 분류 규칙 검증\n\n예약 변경 키워드: ${data.changeWords}\n취소 키워드: ${data.cancelWords}\n\n일치: ${result.correct}/${result.total}\n사람 확인: ${result.review}/${result.total}\n\n${result.rows.map((r, i) => `${i + 1}. ${r.text}\n정답: ${r.expected} / 규칙 결과: ${r.actual} / ${r.expected === r.actual ? "일치" : "불일치"}`).join("\n\n")}\n\n이 결과는 키워드 규칙의 학습용 비교입니다. AI 모델 성능이나 실제 업무 정확도를 뜻하지 않습니다.`
    : "";
  return (
    <>
      <p className="notice">
        <b>AI 호출 없는 규칙 실습입니다.</b> 단어가 포함되어 있는지로
        분류합니다. 두 종류 단어가 함께 있거나 모두 없으면 사람 확인으로
        보냅니다. 부정문이나 숨은 의도를 이해하지 못합니다.
      </p>
      <div className="workspace">
        <section className="editor">
          <div className="section-title">
            <h2>01. 규칙과 정답을 정하세요</h2>
            <Restore
              onRestore={() => {
                setData({
                  changeWords: "변경, 옮",
                  cancelWords: "취소, 취소해",
                  cases: sampleCases,
                });
                setResult(null);
              }}
            />
          </div>
          <Field label="예약 변경 키워드" help="쉼표로 구분하세요.">
            <input
              value={data.changeWords}
              onChange={(e) => set("changeWords", e.target.value)}
            />
          </Field>
          <Field label="취소 키워드">
            <input
              value={data.cancelWords}
              onChange={(e) => set("cancelWords", e.target.value)}
            />
          </Field>
          <h3>비교할 문의와 사람이 정한 정답</h3>
          <div className="case-list">
            {data.cases.map((c, i) => (
              <div className="case-row" key={c.id}>
                <Field label={`문의 ${i + 1}`}>
                  <textarea
                    rows={2}
                    value={c.text}
                    onChange={(e) => update(i, "text", e.target.value)}
                  />
                </Field>
                <div className="button-row">
                  <Field label={`정답 ${i + 1}`}>
                    <select
                      value={c.expected}
                      onChange={(e) => update(i, "expected", e.target.value)}
                    >
                      {labels.map((l) => (
                        <option key={l}>{l}</option>
                      ))}
                    </select>
                  </Field>
                  <button
                    className="icon-button delete"
                    aria-label={`문의 ${i + 1} 삭제`}
                    onClick={() =>
                      set(
                        "cases",
                        data.cases.filter((_, n) => n !== i),
                      )
                    }
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            className="button secondary compact"
            onClick={() =>
              set("cases", [
                ...data.cases,
                { id: crypto.randomUUID(), text: "", expected: "사람 확인" },
              ])
            }
          >
            <Plus size={16} />내 사례 추가
          </button>
          {invalid && (
            <p className="error" role="alert">
              두 종류의 키워드와 문의 내용을 채워주세요. 사례는 1개 이상
              필요합니다.
            </p>
          )}
          <button
            disabled={invalid}
            className="button full run-button"
            onClick={() =>
              setResult(
                evaluate(data.cases, data.changeWords, data.cancelWords),
              )
            }
          >
            규칙으로 분류하고 비교하기
            <ArrowRight size={17} />
          </button>
          <StorageNotice error={error} />
        </section>
        <section className="result-panel">
          <h2>02. 어디에서 틀렸는지 보세요</h2>
          {result ? (
            <>
              <div className="stats" role="status">
                <div>
                  <span>정답과 일치</span>
                  <strong>
                    {result.correct}
                    <small> / {result.total}</small>
                  </strong>
                </div>
                <div>
                  <span>사람 확인으로 분류</span>
                  <strong>
                    {result.review}
                    <small>건</small>
                  </strong>
                </div>
              </div>
              <div className="comparison-results">
                {result.rows.map((r, i) => (
                  <article
                    key={r.id}
                    className={r.expected === r.actual ? "match" : "mismatch"}
                  >
                    <span className="small">
                      {i + 1}번 · {r.expected === r.actual ? "일치" : "불일치"}
                    </span>
                    <p>{r.text}</p>
                    <div>
                      <span>
                        정답 <b>{r.expected}</b>
                      </span>
                      <span>
                        규칙 <b>{r.actual}</b>
                      </span>
                    </div>
                  </article>
                ))}
              </div>
              <p className="notice">
                틀린 사례를 보고 규칙을 고쳤다면, 아직 보지 않은 새 사례로 다시
                확인하세요. 이 결과는 실제 업무나 AI 모델의 성능을 보장하지
                않습니다.
              </p>
              <ExportButtons text={output} filename="분류-검증-결과.md" />
            </>
          ) : (
            <div className="result-empty">
              <span>?</span>
              <h3>정답을 알아야, 결과를 검증할 수 있어요.</h3>
              <p>
                입력 영역의 분류 버튼을 눌러보세요.
                <br />
                “취소하지 말고 변경” 같은 문장에서
                <br />
                단순한 규칙의 한계를 발견할 수 있습니다.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
export default function Lab({ id }) {
  const lab = labs.find((l) => l.id === id);
  if (!lab)
    return (
      <section className="empty">
        <h1>실습을 찾을 수 없어요</h1>
        <LinkButton to="/labs">실습실로 돌아가기</LinkButton>
      </section>
    );
  return (
    <>
      <Breadcrumb current={lab.title} parent="실습실" path="/labs" />
      <header className="page-heading lab-heading">
        <div className="guide-meta">직접 해보는 실습 · {lab.time}</div>
        <h1>{lab.title}</h1>
        <p>{lab.desc}</p>
      </header>
      {id === "meeting" ? (
        <Meeting />
      ) : id === "video" ? (
        <Video />
      ) : (
        <Classify />
      )}
      <div className="lab-footer">
        <a href={`#/guide/${lab.guide}`}>
          <ArrowLeft size={16} />
          관련 가이드 읽기
        </a>
        <a href="#/labs">
          다른 실습 해보기
          <ArrowRight size={16} />
        </a>
      </div>
    </>
  );
}
