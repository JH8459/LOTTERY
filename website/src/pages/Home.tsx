import NewsletterPreviewForm from '../components/Email/NewsletterPreviewForm';
import SectionTitle from '../components/common/SectionTitle';

export default function Home() {
  return (
    <>
      <main className="max-w-[1200px] w-4/5 mx-auto pt-10 pb-20">
        {/* 제목 섹션 */}
        <SectionTitle title="🍀 LOTTERY SUBSCRIPTION" subtitle="복권 당첨 정보 구독형 서비스" />

        {/* 로또 이미지 (제목 아래) */}
        <div className="flex justify-center mt-10">
          <img
            src="https://jh8459.s3.ap-northeast-2.amazonaws.com/lottery/lottery.png"
            alt="lottery"
            className="w-[320px] sm:w-[400px] md:w-[480px] lg:w-[540px] xl:w-[600px]"
          />
        </div>

        {/* 콘텐츠 영역 */}
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-10 mt-16">
          {/* 왼쪽: 설명 + 버튼 + 체크 항목 */}
          <div className="w-full md:w-[48%] flex flex-col items-center space-y-10">
            {/* 설명 */}
            <p className="text-gray-700 text-[1.1rem] leading-relaxed break-keep text-left">
              <strong className="text-green-700">🍀 LOTTERY</strong>는 복권 정보 구독형 서비스입니다. 주요 기능으로는
              매주 토요일 시행되는 로또 당첨 결과를 정기적으로 제공하며, 각종 당첨 정보 관련한 통계 정보를 구독하고 싶은
              사용자들에게 요약하여 제공하는 서비스입니다. 로또 이외에도 스피또 판매 정보까지 제공하여 복권 구매 시
              관련된 정보를 편리하게 받아볼 수 있습니다.
            </p>

            {/* 설치 버튼 */}
            <a
              href="https://slack.com/oauth/v2/authorize?client_id=6884985260326.7168973153766&scope=commands,im:write,team:read,users:read&user_scope="
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#438902] hover:bg-[#60952f] text-white text-[1.25em] font-bold py-5 px-6 w-4/5 rounded-[15px] shadow-[0_3px_4.5px_rgba(0,0,0,0.5)] mt-6 mb-6 text-center"
            >
              설치하기
            </a>

            {/* 체크 항목 */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-m text-gray-700 text-center mt-6">
              <div className="min-w-[120px]">✅ 비용 청구 없음</div>
              <div className="min-w-[120px]">✅ 손쉬운 설치</div>
              <div className="min-w-[120px]">✅ 손 쉬운 조작성</div>
              <div className="min-w-[120px]">✅ 다양한 기능</div>
            </div>
          </div>

          {/* 오른쪽: 샘플 이미지 */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="https://jh8459.s3.ap-northeast-2.amazonaws.com/lottery/lottery_sample.png"
              alt="Product sample"
              className="w-full max-w-[480px] rounded-md shadow"
            />
          </div>
        </div>
        {/* 하단: 이메일 구독 입력창 */}
        <NewsletterPreviewForm />
      </main>
    </>
  );
}
