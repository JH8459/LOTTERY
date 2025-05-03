import SectionTitle from '../components/SectionTitle';

export default function Privacy() {
  return (
    <main className="max-w-[1200px] w-4/5 mx-auto pt-10 pb-20">
      {/* 제목 섹션 */}
      <SectionTitle title="🍀 LOTTERY SUBSCRIPTION" subtitle="복권 당첨 정보 구독형 서비스" />

      {/* 메인 콘텐츠 영역 */}
      <section className="flex flex-wrap justify-between items-start gap-12">
        {/* 왼쪽 이미지 */}
        <div className="w-full md:w-[45%] flex justify-center">
          <img
            src="https://jh8459.s3.ap-northeast-2.amazonaws.com/lottery/lottery_privacy_policy.jpg"
            alt="Privacy Illustration"
            className="w-full max-w-md object-contain"
          />
        </div>

        {/* 오른쪽 설명 */}
        <div className="w-full md:w-[50%] space-y-6 text-gray-800 text-base leading-relaxed break-keep">
          <p className="text-lg md:text-xl leading-relaxed text-gray-800 font-break-keep">
            <strong className="text-green-700">🍀 LOTTERY</strong>는 슬랙 워크스페이스에 설치되어 특정 권한을 부여받으며
            이 과정에서 사용되는 개인정보 보호 정책의 주요 내용은 다음과 같습니다.
          </p>

          <div className="space-y-5">
            <div>
              <p className="font-bold mb-1">1. 수집하는 정보:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>팀 워크스페이스 이름과 팀 워크스페이스 고유 ID</li>
                <li>
                  슬랙 유저들의 고유 ID (<strong className="text-green-700">"/구독"</strong> 명령어 사용 시)
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold mb-1">2. 수집 목적:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>팀 워크스페이스 별로 앱이 원활하게 기능을 제공하기 위함</li>
                <li>
                  <strong className="text-green-700">"/구독"</strong> 명령어를 통해 개인 앱 채널을 열어 다이렉트
                  메시지를 보내기 위함
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold mb-1">3. 보관 및 삭제 정책:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>구독 해지 시 슬랙 유저 ID는 한 달 후에 폐기됨</li>
                <li>개인정보는 별도로 암호화된 DB 서버에 저장됨</li>
                <li>접근 권한은 IP와 도메인 통제를 통해 허용된 담당자만 접근 가능</li>
              </ul>
            </div>

            <div>
              <p className="font-bold mb-1">4. 기타 사항:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>개인정보는 보안을 유지하기 위해 적절한 기술적, 물리적, 관리적 조치가 취해짐</li>
                <li>개인정보 보호 정책은 정기적으로 검토 및 개선될 수 있음</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
