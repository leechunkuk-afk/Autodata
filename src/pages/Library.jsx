import { useState } from "react";
import { ArrowRight, Bookmark, Check } from "lucide-react";
import { guides, categories } from "../content/guides";
import ResourceCard from "../components/ResourceCard";
import { SearchBox, Empty, LinkButton } from "../components/UI";
export default function Library({ saved, toggle, completed }) {
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("전체"),
    [savedOnly, setSavedOnly] = useState(false);
  const filtered = guides.filter(
    (g) =>
      (category === "전체" || g.category === category) &&
      (!savedOnly || saved.includes(g.id)) &&
      `${g.title} ${g.description} ${g.category} ${g.sections.map((s) => s.body).join(" ")}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const reset = () => {
    setQuery("");
    setCategory("전체");
    setSavedOnly(false);
  };
  return (
    <>
      <section className="hero">
        <div>
          <h1>
            배운 AI를,
            <br />내 일에 쓰는 순간.
          </h1>
          <p>
            고르고, 따라 하고, 직접 확인하세요.
            <br />
            작은 실습 하나가 내 업무를 바꿉니다.
          </p>
          <LinkButton to="/labs/meeting">첫 실습 시작하기</LinkButton>
        </div>
        <a href="#/labs/meeting" className="hero-note">
          <span className="note-dash" />
          <h2>오늘의 작은 완성</h2>
          <div className="note-title">
            회의 메모 <ArrowRight /> 실행할 일
          </div>
          <div className="note-steps">
            <span>메모 정리</span>
            <span>담당·기한 확인</span>
            <span>결과 저장</span>
          </div>
        </a>
      </section>
      <ol className="steps-strip">
        {[
          ["내 일에 맞게 고르기", "지금 필요한 주제를 찾아보세요."],
          ["예제로 먼저 해보기", "차근차근 따라 하며 배워보세요."],
          ["결과 확인하고 활용하기", "내 업무에 바로 적용해 보세요."],
        ].map(([title, desc], i) => (
          <li key={title}>
            <strong>0{i + 1}</strong>
            <div>
              <b>{title}</b>
              <p>{desc}</p>
            </div>
          </li>
        ))}
      </ol>
      <section className="library-section" aria-labelledby="library-title">
        <div className="section-title">
          <h2 id="library-title">무엇을 해보고 싶으세요?</h2>
          {completed.length > 0 && (
            <span className="progress-label">
              <Check size={16} />
              {completed.length}/{guides.length} 학습 완료
            </span>
          )}
        </div>
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="원하는 주제나 키워드를 검색해 보세요. 예: 자막, 회의, 권한"
        />
        <div className="filter-bar">
          <div className="filters" aria-label="자료 분야">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={c === category}
                className={c === category ? "active" : ""}
              >
                {c}
              </button>
            ))}
          </div>
          <button
            className={`saved-filter ${savedOnly ? "active" : ""}`}
            aria-pressed={savedOnly}
            onClick={() => setSavedOnly(!savedOnly)}
          >
            <Bookmark size={16} />
            저장한 자료 {saved.length}
          </button>
        </div>
        <p className="result-count" role="status">
          {filtered.length}개의 가이드
          {savedOnly ? " · 이 브라우저에 저장한 자료" : " · 예시부터 차근차근"}
        </p>
        {filtered.length ? (
          <div className="resource-grid">
            {filtered.map((g) => (
              <ResourceCard
                key={g.id}
                guide={g}
                saved={saved}
                toggle={toggle}
                completed={completed}
              />
            ))}
          </div>
        ) : (
          <Empty onReset={reset} />
        )}
      </section>
      <section className="bottom-callout">
        <div>
          <h2>읽었다면, 하나만 만들어 보세요.</h2>
          <p>예제 데이터로 시작하고 내 상황에 맞게 바꿔보세요.</p>
        </div>
        <LinkButton to="/labs" secondary>
          실습실 둘러보기
        </LinkButton>
      </section>
    </>
  );
}
