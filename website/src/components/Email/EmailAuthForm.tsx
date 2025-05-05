import { useState, useEffect } from 'react';

export default function NewsletterPreviewForm() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(3600);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (!timerActive) return;
    if (timer <= 0) return;

    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timerActive, timer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSendCode = async () => {
    try {
      setIsLoading(true);
      setError('');

      const res = await fetch('https://lottery-api.jh8459.com/email/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailInfo: email }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setStep('verify');
      setTimer(3600);
      setTimerActive(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6 || !/^[0-9]{6}$/.test(verificationCode)) {
      setError('6자리 숫자 인증 코드를 정확히 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const res = await fetch('https://lottery-api.jh8459.com/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailInfo: email, verificationCode }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      alert('✅ 뉴스레터 예시 메일이 발송되었습니다!');
      setEmail('');
      setVerificationCode('');
      setStep('input');
      setTimerActive(false);
      setTimer(3600);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full max-w-xl mx-auto bg-gray-50 p-8 rounded-xl shadow-md mt-20">
      <h3 className="text-xl font-bold text-green-700 mb-2">📬 뉴스레터 미리보기</h3>
      <p className="text-gray-600 text-sm mb-6">
        구독 전에 어떤 메일을 받는지 체험해보세요. 유효한 이메일 주소인지 인증 후 발송해드립니다.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-1">
            이메일 주소
          </label>
          <input
            id="email"
            type="email"
            className={`w-full px-4 py-2 border rounded-md transition-all duration-200 ${
              step === 'verify' ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : 'border-gray-300'
            }`}
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={step === 'verify'}
          />
        </div>

        {step === 'verify' && (
          <div>
            <label htmlFor="verificationCode" className="block text-sm font-semibold mb-1">
              인증 코드
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-full">
                <input
                  id="verificationCode"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  pattern="\d{6}"
                  className="w-full pr-20 px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="6자리 숫자 코드 입력"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                />

                {/* 입력창 내부 우측 재전송 버튼 */}
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-md hover:bg-green-200"
                >
                  재전송
                </button>
              </div>

              {/* 유효 시간은 input 외부 우측에 표시 */}
              <span className="text-sm text-gray-500 whitespace-nowrap">{formatTime(timer)}</span>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-600 font-medium">❗ {error}</p>}

        <div className="text-right">
          {step === 'input' ? (
            <button
              onClick={handleSendCode}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-2 rounded-md"
              disabled={isLoading || !email}
            >
              {isLoading ? '전송 중...' : '메일 인증'}
            </button>
          ) : (
            <button
              onClick={handleVerifyCode}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-2 rounded-md"
              disabled={isLoading || verificationCode.length !== 6}
            >
              {isLoading ? '검증 중...' : '메일 받기'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
