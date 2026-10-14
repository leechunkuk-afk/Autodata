import { ArrowRight, Check } from "lucide-react";
import { BookmarkButton } from "./UI";
export default function ResourceCard({ guide, saved, toggle, completed }) {
  return (
    <article className="resource-card">
      <div className="card-top">
        <span className="category-label">{guide.category}</span>
        <BookmarkButton id={guide.id} saved={saved} toggle={toggle} />
      </div>
      <a className="card-link" href={`#/guide/${guide.id}`}>
        <h3>{guide.title}</h3>
        <p>{guide.description}</p>
        <div className="card-bottom">
          <span>
            {guide.time} · {guide.level}
            {completed?.includes(guide.id) && (
              <span className="done-label">
                <Check size={13} />
                학습 완료
              </span>
            )}
          </span>
          <ArrowRight size={20} />
        </div>
      </a>
    </article>
  );
}
