import { useState } from "react";
import { Check, Clock, ArrowRight, Bookmark } from "lucide-react";
import { guides, updated } from "../content/guides";
import {
  Breadcrumb,
  LinkButton,
  CopyButton,
  SourceLink,
  BookmarkButton,
} from "../components/UI";
import ResourceCard from "../components/ResourceCard";
import { useStoredState } from "../lib/storage";
export default function Guide({ id, saved, toggle, completed, setCompleted }) {
  const guide = guides.find((g) => g.id === id);
  const [checks, setChecks] = useStoredState(`checks-${id}`, []);
  const [message, setMessage] = useState("");
  if (!guide)
    return (
      <section className="empty">
        <h1>자료를 찾을 수 없어요</h1>
        <LinkButton to="/">자료실로 돌아가기</LinkButton>
      </section>
    );
  function complete() {
    if (checks.length < guide.checks.length) {
      setMessage("아래 완료 기준을 하나씩 확인하고 체크해 주세요.");
      return;
    }
    setCompleted([...new Set([...completed, id])]);
    setMessage("학습 완료로 기록했어요. 다음 자료로 이어가 보세요.");
  }
  const done = completed.includes(id);
  return (
    <>
      <Breadcrumb current={guide.title} />
      <header className="page-heading">
        <div className="guide-meta">
          {guide.category}
          <span>·</span>
          <Clock size={14} />
          {guide.time}
          <span>·</span>
          {guide.level}
        </div>
        <h1>{guide.title}</h1>
        <p>{guide.subtitle}</p>
        <div className="heading-actions">
          <BookmarkButton id={id} saved={saved} toggle={toggle} />
          <span className="small">
            {saved.includes(id) ? "저장한 자료" : "나중에 다시 보기"}
          </span>
          <span className="date">원고 개정 {updated}</span>
        </div>
      </header>
      <div className="guide-layout">
        <article className="article-body">
          <section className="outcome">
            <h2>이 가이드로 만들 것</h2>
            <p>{guide.outcome}</p>
            <h3>시작 전에 준비하세요</h3>
            <ul>
              {guide.supplies.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
          {guide.sections.map((s, i) => (
            <section
              className="lesson-section"
              key={s.title}
              id={`step-${i + 1}`}
            >
              <span className="step-number">STEP 0{i + 1}</span>
              <h2>{s.title}</h2>
              <p>{s.body}</p>
              {s.example && <blockquote>{s.example}</blockquote>}
            </section>
          ))}
          <section className="prompt-section" id="prompt">
            <div className="section-title">
              <h2>내 AI에게 이렇게 요청하세요</h2>
              <CopyButton text={guide.prompt} />
            </div>
            <p className="small">
              대괄호 안을 내 상황으로 바꾸고, 사용하는 AI의 대화창에
              붙여넣으세요.
            </p>
            <pre className="prompt-text" tabIndex={0}>
              {guide.prompt}
            </pre>
          </section>
          {guide.lab ? (
            <section className="inline-callout">
              <h2>설명을 실제 결과로 바꿔보세요</h2>
              <p>
                예제가 준비되어 있어요. 입력을 바꾸면 결과를 바로 확인할 수
                있습니다.
              </p>
              <LinkButton to={`/labs/${guide.lab}`}>
                연결된 실습 시작하기
              </LinkButton>
            </section>
          ) : (
            <section className="inline-callout">
              <h2>모르는 말이 남아 있나요?</h2>
              <LinkButton to="/glossary">쉬운 용어사전 열기</LinkButton>
            </section>
          )}
          <section className="faq">
            <h2>막혔을 때 찾아보세요</h2>
            {guide.trouble.map((t) => (
              <details key={t.q}>
                <summary>{t.q}</summary>
                <p>{t.a}</p>
              </details>
            ))}
          </section>
          <section className="source-note">
            <h3>참고 자료와 적용 범위</h3>
            <p>
              원본 자료의 주제를 바탕으로 실습·검증 중심으로 새로 작성한
              가이드입니다. 원본의 전체 도구와 견본은 아래 링크에서 볼 수
              있습니다. 서비스별 메뉴·요금·지원 기능은 사용 환경에 따라
              달라지므로 공식 안내를 확인하세요.
            </p>
            <SourceLink href={guide.source} />
            {guide.official?.map((s) => (
              <SourceLink key={s.url} href={s.url}>
                {s.title}
              </SourceLink>
            ))}
          </section>
        </article>
        <aside className="guide-sidebar">
          <div className="sidebar-sticky">
            <h3>읽는 순서</h3>
            <ol>
              {guide.sections.map((s, i) => (
                <li key={s.title}>
                  <button
                    onClick={() =>
                      document
                        .getElementById(`step-${i + 1}`)
                        .scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ol>
            <div className="checklist">
              <h3>완료 기준</h3>
              <p className="small">결과를 직접 확인하고 체크하세요.</p>
              {guide.checks.map((c, i) => (
                <label key={c}>
                  <input
                    type="checkbox"
                    checked={checks.includes(i)}
                    onChange={() => {
                      setChecks(
                        checks.includes(i)
                          ? checks.filter((n) => n !== i)
                          : [...checks, i],
                      );
                      if (done) setCompleted(completed.filter((n) => n !== id));
                    }}
                  />
                  <span>{c}</span>
                </label>
              ))}
              <button className="button full" onClick={complete}>
                {done ? (
                  <>
                    <Check size={17} />
                    학습 완료
                  </>
                ) : (
                  "확인하고 완료하기"
                )}
              </button>
              <p role="status" className="small">
                {message}
              </p>
            </div>
          </div>
        </aside>
      </div>
      <section className="related">
        <h2>이어서 보면 좋은 자료</h2>
        <div className="resource-grid">
          {guide.related.map((r) => (
            <ResourceCard
              key={r}
              guide={guides.find((g) => g.id === r)}
              saved={saved}
              toggle={toggle}
              completed={completed}
            />
          ))}
        </div>
      </section>
    </>
  );
}
