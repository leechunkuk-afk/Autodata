import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Copy,
  Check,
  Download,
  Bookmark,
  Search,
  X,
} from "lucide-react";
import { downloadText } from "../lib/storage";
export function LinkButton({ to, children, secondary = false }) {
  return (
    <a className={`button ${secondary ? "secondary" : ""}`} href={`#${to}`}>
      {children}
      <ArrowRight size={18} />
    </a>
  );
}
export function CopyButton({ text, disabled = false }) {
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("복사했어요");
    } catch {
      setStatus("복사가 차단됐어요. 아래 글을 선택해 복사하세요.");
    }
  }
  return (
    <span className="copy-wrap">
      <button
        className="button secondary compact"
        onClick={copy}
        disabled={disabled}
      >
        {status === "복사했어요" ? <Check size={16} /> : <Copy size={16} />}
        복사하기
      </button>
      <span role="status" className="small">
        {status}
      </span>
    </span>
  );
}
export function ExportButtons({ text, filename, disabled }) {
  return (
    <div className="button-row">
      <CopyButton text={text} disabled={disabled} />
      <button
        disabled={disabled}
        className="button secondary compact"
        onClick={() => downloadText(filename, text)}
      >
        <Download size={16} />
        파일로 저장
      </button>
    </div>
  );
}
export function SourceLink({ href, children = "원본 자료 더 보기" }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="external">
      {children}
      <ArrowUpRight size={15} />
      <span className="sr-only"> (새 탭)</span>
    </a>
  );
}
export function BookmarkButton({ id, saved, toggle }) {
  const active = saved.includes(id);
  return (
    <button
      className={`icon-button bookmark ${active ? "selected" : ""}`}
      aria-label={`${active ? "저장 해제" : "자료 저장"}`}
      aria-pressed={active}
      onClick={() => toggle(id)}
    >
      <Bookmark size={18} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
export function SearchBox({
  value,
  onChange,
  placeholder,
  label = "자료 검색",
}) {
  return (
    <div className="search">
      <Search size={20} />
      <input
        type="search"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          className="icon-button"
          aria-label="검색 지우기"
          onClick={() => onChange("")}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
export function Empty({ onReset }) {
  return (
    <div className="empty">
      <Search size={30} />
      <h3>맞는 자료를 찾지 못했어요</h3>
      <p>짧은 단어나 다른 분야로 다시 찾아보세요.</p>
      <button className="button secondary compact" onClick={onReset}>
        검색 조건 초기화
      </button>
    </div>
  );
}
export function Breadcrumb({ current, parent = "자료실", path = "/" }) {
  return (
    <nav className="breadcrumb" aria-label="현재 위치">
      <a href={`#${path}`}>{parent}</a>
      <span>/</span>
      <span>{current}</span>
    </nav>
  );
}
export function StorageNotice({ error }) {
  return (
    <p className={`storage-note ${error ? "error" : ""}`}>
      {error
        ? "이 브라우저에서는 초안을 저장할 수 없어요. 결과를 파일로 보관해 주세요."
        : "입력은 이 브라우저에만 저장됩니다. 다른 기기와 동기화되지 않으니 중요한 결과는 파일로 보관하세요."}
    </p>
  );
}
export function Field({ label, children, help }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {help && <small>{help}</small>}
    </label>
  );
}
