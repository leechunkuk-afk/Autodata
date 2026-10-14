import { useEffect, useState } from "react";
import Library from "./pages/Library";
import Guide from "./pages/Guide";
import Glossary from "./pages/Glossary";
import Labs from "./pages/Labs";
import Lab from "./pages/Lab";
import { useStoredState } from "./lib/storage";
import { guides } from "./content/guides";
import { SourceLink, LinkButton } from "./components/UI";
function getPath() {
  return window.location.hash.slice(1).split("?")[0] || "/";
}
export default function App() {
  const [path, setPath] = useState(getPath);
  const [saved, setSaved, savedError] = useStoredState("saved", []);
  const [completed, setCompleted, progressError] = useStoredState(
    "completed",
    [],
  );
  const toggle = (id) =>
    setSaved(
      saved.includes(id) ? saved.filter((v) => v !== id) : [...saved, id],
    );
  useEffect(() => {
    const change = () => {
      setPath(getPath());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    const name = path.startsWith("/guide/")
      ? guides.find((g) => g.id === path.split("/")[2])?.title
      : path.startsWith("/labs")
        ? "직접 해보는 실습실"
        : path === "/glossary"
          ? "쉬운 용어사전"
          : "배운 AI를 내 일에";
    document.title = `${name || "자료 찾기"} | Autodata`;
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [path]);
  const props = { saved, toggle, completed, setCompleted };
  let page;
  if (path === "/" || path === "/library") page = <Library {...props} />;
  else if (path.startsWith("/guide/"))
    page = <Guide key={path} id={path.split("/")[2]} {...props} />;
  else if (path === "/glossary") page = <Glossary />;
  else if (path === "/labs") page = <Labs />;
  else if (path.startsWith("/labs/"))
    page = <Lab key={path} id={path.split("/")[2]} />;
  else
    page = (
      <section className="empty">
        <h1>이 페이지는 없어요</h1>
        <p>자료실에서 원하는 주제를 찾아보세요.</p>
        <LinkButton to="/">자료실로 돌아가기</LinkButton>
      </section>
    );
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main").focus();
        }}
      >
        본문으로 건너뛰기
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a href="#/" className="brand" aria-label="Autodata 자료실 홈">
            Autodata
            <span className="brand-dot" />
          </a>
          <nav aria-label="주 메뉴">
            {[
              ["/", "자료실"],
              ["/labs", "실습실"],
              ["/glossary", "용어사전"],
            ].map(([to, name]) => {
              const active =
                to === "/"
                  ? path === "/" ||
                    path.startsWith("/guide") ||
                    path === "/library"
                  : path.startsWith(to);
              return (
                <a
                  key={to}
                  href={`#${to}`}
                  className={active ? "active" : ""}
                  aria-current={active ? "page" : undefined}
                >
                  {name}
                </a>
              );
            })}
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="container">
        {(savedError || progressError) && (
          <p role="status" className="error">
            브라우저 저장이 차단되어 저장 목록과 학습 기록을 유지할 수 없어요.
          </p>
        )}
        {page}
      </main>
      <footer className="site-footer">
        <div>
          <a className="brand" href="#/">
            Autodata
            <span className="brand-dot" />
          </a>
          <p>AI를 배우고, 내 일에 쓰는 실용 자료실.</p>
        </div>
        <div>
          <SourceLink href="https://nondev-thinking.web.app/library/">
            참고한 원본 자료실
          </SourceLink>
          <span className="small">새로 쓴 가이드와 브라우저 실습 · 2026</span>
        </div>
      </footer>
    </>
  );
}
