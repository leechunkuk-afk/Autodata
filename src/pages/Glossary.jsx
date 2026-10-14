import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { terms } from "../content/terms";
import { Breadcrumb, SearchBox, Empty, SourceLink } from "../components/UI";
export default function Glossary() {
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("전체");
  const groups = ["전체", ...new Set(terms.map((t) => t.category))];
  const filtered = terms.filter(
    (t) =>
      (category === "전체" || t.category === category) &&
      `${t.title} ${t.english} ${t.meaning} ${t.example}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <Breadcrumb current="용어사전" />
      <header className="page-heading">
        <h1>AI 말, 쉬운 말로.</h1>
        <p>뜻만 알기보다, 다음에 할 일을 함께 알아보세요.</p>
      </header>
      <SearchBox
        value={query}
        onChange={setQuery}
        placeholder="모르는 말로 찾아보세요. 예: API, 배포, 터미널"
        label="용어 검색"
      />
      <div className="filters glossary-filters">
        {groups.map((c) => (
          <button
            key={c}
            className={c === category ? "active" : ""}
            aria-pressed={c === category}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="result-count" role="status">
        {filtered.length}개의 용어 · 항목을 눌러 예시와 다음 행동을 확인하세요.
      </p>
      <div className="term-list">
        {filtered.map((t) => (
          <details
            key={t.id}
            className="term"
            open={query.trim() ? true : undefined}
          >
            <summary>
              <span className="term-title">
                {t.title}
                <small>{t.english}</small>
              </span>
              <span className="term-meaning">{t.meaning}</span>
            </summary>
            <div className="term-body">
              <p>
                <b>예를 들면</b>
                {t.example}
              </p>
              <p>
                <b>지금 할 일</b>
                {t.action}
              </p>
            </div>
          </details>
        ))}
      </div>
      {!filtered.length && (
        <Empty
          onReset={() => {
            setQuery("");
            setCategory("전체");
          }}
        />
      )}
      <div className="source-note">
        <h3>더 넓은 용어가 필요하다면</h3>
        <p>
          이 사전은 첫 작업에 필요한 핵심 용어를 새로 정리했습니다. 더 많은
          분야와 개별 설명은 원본 용어사전에서 볼 수 있습니다.
        </p>
        <SourceLink href="https://nondev-thinking.web.app/dictionary/">
          원본 용어사전 보기
        </SourceLink>
      </div>
    </>
  );
}
