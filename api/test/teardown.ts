import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * @description E2E 테스트 종료 후 docker-compose로 띄운 테스트 컨테이너를 정리합니다.
 */
export default async function globalTeardown(): Promise<void> {
  console.log('🧹 E2E 테스트 종료 중...');

  try {
    // docker-compose로 띄운 테스트용 DB/Redis 컨테이너 종료
    await execAsync('docker compose -f docker-compose.test.yml down -v');
    console.log('✅ Docker 컨테이너 정리 완료');
  } catch (error) {
    console.error('❌ Docker 컨테이너 정리 실패:', error);
  }
}
