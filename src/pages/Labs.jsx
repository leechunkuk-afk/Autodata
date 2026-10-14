import { FileText, Clapperboard, Workflow, ArrowRight } from "lucide-react";
import { Breadcrumb } from "../components/UI";
export const labs = [
  {
    id: "meeting",
    icon: FileText,
    title: "회의 메모를 실행할 일로",
    desc: "결정 사항과 담당자·기한을 정리하고, 공유할 회의록을 저장하세요.",
    outcome: "공유용 회의록",
    time: "10분",
    guide: "tools",
  },
  {
    id: "video",
    icon: Clapperboard,
    title: "내 영상의 편집 주문서",
    desc: "구간과 효과를 고르고, AI에게 전달할 구체적인 주문서를 만드세요.",
    outcome: "영상 편집 요청문",
    time: "15분",
    guide: "video",
  },
  {
    id: "classify",
    icon: Workflow,
    title: "분류 기준, 얼마나 맞을까?",
    desc: "키워드 규칙과 정답 사례를 비교하며 자동화의 한계를 알아보세요.",
    outcome: "분류 결과 비교표",
    time: "15분",
    guide: "jev",
  },
];
export default function Labs() {
  return (
    <>
      <Breadcrumb current="실습실" />
      <header className="page-heading">
        <h1>읽는 데서, 해보는 데로.</h1>
        <p>예제로 시작해 보세요. 작은 결과물 하나를 직접 완성합니다.</p>
      </header>
      <div className="lab-list">
        {labs.map((l, i) => (
          <a className="lab-card" href={`#/labs/${l.id}`} key={l.id}>
            <span className="lab-num">0{i + 1}</span>
            <div>
              <span className="category-label">
                {l.time} · {l.outcome}
              </span>
              <h2>{l.title}</h2>
              <p>{l.desc}</p>
            </div>
            <l.icon size={38} strokeWidth={1.4} />
            <ArrowRight size={24} />
          </a>
        ))}
      </div>
      <section className="privacy-note">
        <h2>부담 없이 연습하세요</h2>
        <p>
          세 실습 모두 브라우저 안에서 동작합니다. AI를 호출하거나 입력을 서버로
          보내지 않습니다. 예제는 학습용 가상 자료이며, 초안은 현재 브라우저에
          저장됩니다.
        </p>
        <p>
          실습에서 만든 요청문을 외부 AI에 붙여넣으면 해당 서비스의 데이터 처리
          정책이 적용됩니다.
        </p>
      </section>
    </>
  );
}
