import { config as loadEnvConfig } from 'dotenv';

/**
 * @description E2E 테스트 환경 세팅 파일
 * - .env.test 파일을 로드하여 환경변수를 세팅합니다.
 */
export default async function globalSetup(): Promise<void> {
  loadEnvConfig({ path: '.env.test' });

  console.log('✅ 테스트 환경변수 로드 완료 (.env.test)');
}
