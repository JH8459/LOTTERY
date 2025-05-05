import { useState, useEffect } from 'react';
import { formatTime } from '../../common/util';
import Alert from '../common/Alert';

export default function NewsletterPreviewForm() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(3600);
  const [timerActive, setTimerActive] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (!timerActive || timer <= 0) return;
    const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(countdown);
  }, [timerActive, timer]);

  const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
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
      showAlert('✅ 인증 코드가 이메일로 전송되었습니다.', 'success');
    } catch (err) {
      showAlert(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.', 'error');
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

      setEmail('');
      setVerificationCode('');
      setStep('input');
      setTimer(3600);
      setTimerActive(false);
      showAlert('✅ 뉴스레터 이메일이 전송되었습니다.', 'success');
    } catch (err) {
      showAlert(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full max-w-xl mx-auto bg-gray-50 p-8 rounded-xl shadow-md mt-20 relative">
      <h3 className="text-xl font-bold text-green-700 mb-2">📬 뉴스레터 미리보기</h3>
      <p className="text-gray-600 text-sm mb-6">
        구독 전에 어떤 메일을 받는지 체험해보세요. 유효한 이메일 주소인지 인증 후 발송해드립니다.
      </p>

      <div className="space-y-4">
        {/* ✅ 알림 박스 - 이메일 입력창 바로 위 */}
        {alertMessage && <Alert type={alertType} message={alertMessage} onClose={() => setAlertMessage('')} />}

        {/* 이메일 입력 */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-1">
            이메일 주소
          </label>
          <input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={step === 'verify'}
            className={`w-full px-4 py-2 border rounded-md transition-all duration-200 ${
              step === 'verify' ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : 'border-gray-300'
            }`}
          />
        </div>

        {/* 인증코드 입력 */}
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
                  placeholder="6자리 숫자 코드 입력"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full pr-20 px-4 py-2 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-md hover:bg-green-200"
                >
                  재전송
                </button>
              </div>
              <span className="text-sm text-gray-500 whitespace-nowrap">{formatTime(timer)}</span>
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && <p className="text-sm text-red-600 font-medium">❗ {error}</p>}

        {/* 버튼 */}
        <div className="text-right">
          <button
            onClick={step === 'input' ? handleSendCode : handleVerifyCode}
            disabled={isLoading || (step === 'input' ? !email : verificationCode.length !== 6)}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-2 rounded-md"
          >
            {isLoading
              ? step === 'input'
                ? '전송 중...'
                : '검증 중...'
              : step === 'input'
              ? '메일 인증'
              : '메일 받기'}
          </button>
        </div>
      </div>
    </section>
  );
}
