import { useState } from 'react';

export default function Support() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const [responseColor, setResponseColor] = useState('text-green-600');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const qnaRegistInfo = { name, email, question: message };

    try {
      const res = await fetch('https://lottery-api.jh8459.com/qna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(qnaRegistInfo),
      });

      if (res.ok) {
        setName('');
        setEmail('');
        setMessage('');
        setResponseMsg('소중한 의견 감사합니다.');
        setResponseColor('text-green-600');
      } else {
        setResponseMsg('문제가 발생했습니다. 다시 시도해주세요.');
        setResponseColor('text-red-600');
      }

      setTimeout(() => setResponseMsg(''), 3000);
    } catch (err) {
      alert('에러 발생: ' + err);
    }
  };

  return (
    <main className="max-w-[1200px] w-4/5 mx-auto pt-10 pb-20">
      {/* 제목 섹션 */}
      <div className="text-center space-y-2 mb-14">
        <h1 className="text-4xl md:text-5xl font-bold text-green-700">🍀 LOTTERY SUBSCRIPTION</h1>
        <p className="text-lg md:text-xl text-gray-600 font-medium">복권 당첨 정보 구독형 서비스</p>
      </div>

      {/* 콘텐츠 영역 */}
      <section className="flex flex-wrap justify-between items-start gap-12">
        {/* 왼쪽 이미지 */}
        <div className="w-full md:w-[45%] flex justify-center">
          <img
            src="https://jh8459.s3.ap-northeast-2.amazonaws.com/lottery/lottery_support.jpg"
            alt="lottery-support"
            className="w-full max-w-md object-contain"
          />
        </div>

        {/* 오른쪽 폼 */}
        <div className="w-full md:w-[50%] space-y-6 text-gray-800">
          <h2 className="text-xl font-semibold">문의하기</h2>
          <p>문의하실 내용이 있으신가요? 아래의 서식을 채워 작성해주시면 답변드리겠습니다.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="name" className="font-bold block mb-1">
                이름
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                type="text"
                className="w-full border border-gray-300 px-4 py-2 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="email" className="font-bold block mb-1">
                이메일 *
              </label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={200}
                required
                type="email"
                className="w-full border border-gray-300 px-4 py-2 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="message" className="font-bold block mb-1">
                내용 *
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                className="w-full border border-gray-300 px-4 py-2 rounded-md resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3">
              <div className={`text-sm font-medium ${responseColor}`}>{responseMsg}</div>
              <button
                type="submit"
                className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-8 rounded-md shadow-md"
              >
                제출
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
