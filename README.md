# Run My Horse 🐎

디스코드 기반 경마 게임 시스템

## 프로젝트 구조

```
run-my-horse/
├── admin/             # Next.js 관리자 대시보드
├── core/              # NestJS 백엔드 (메인 API + Kafka)
├── discord/           # Discord 봇
└── README.md
```

## 기술 스택

- **Backend**: NestJS, TypeORM, SQLite
- **Frontend**: Next.js, React, TypeScript
- **Message Queue**: Apache Kafka
- **Bot**: Discord.js
- **Database**: SQLite (개발), PostgreSQL (프로덕션 권장)

## 주요 기능

### 🏇 경마 시스템

- 말 등록 및 관리 (능력치: 속도, 체력, 파워)
- 레이스 생성, 시작, 정지
- 레이스 결과 생성 및 저장
- 레이스 과정 기록 (향후 리플레이용)

### 💰 베팅 시스템

- 사용자별 베팅 등록
- 베팅 금액 요약
- 레이스 결과 기반 정산
- 배당금 지급

### 🎮 디스코드 연동

- `/race` - 레이스 시작 (관리자만)
- `/raceinfo` - 현재 레이스 정보 조회
- 실시간 알림 (개발 예정)

### 🔧 관리자 도구

- 웹 기반 관리 대시보드
- 전체 플로우 테스트 페이지
- 말 생성, 레이스 관리, 베팅 현황 조회

## 설치 및 실행

### 1. 저장소 클론

```bash
git clone <repository-url>
cd run-my-horse
```

### 2. Core 서버 실행

```bash
cd core
npm install
npm run start:dev
```

### 3. Admin 대시보드 실행

```bash
cd admin
npm install
npm run dev
```

### 4. Discord 봇 실행

```bash
cd discord
npm install
npm run dev
```

## 환경 설정

### Core (.env)

```
DATABASE_URL=sqlite:./database.db
KAFKA_BROKER=localhost:9092
```

### Admin (.env.local)

```
CORE_API=http://localhost:8000/api
KAFKA_API=http://localhost:8000/api/kafka
```

### Discord (.env)

```
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_client_id
CORE_API=http://localhost:8000/api
KAFKA_CLIENT_ID=horse-discord-bot
KAFKA_BROKER=localhost:9092
```

## API 구조

### HTTP API (Gateway)

- `GET /api/horses` - 말 목록 조회
- `GET /api/race/latest` - 최신 레이스 정보 조회
- `GET /api/bets/summary` - 베팅 요약 조회
- `GET /api/race-result` - 레이스 결과 조회

### Kafka 메시지

- `horse.create-horse` - 말 생성
- `horse.start-race` - 레이스 시작
- `horse.stop-race` - 레이스 정지
- `race-result.create` - 레이스 결과 생성
- `bet.create` - 베팅 생성
- `race.settle` - 정산 처리

## 개발 가이드

### 새로운 기능 추가

1. **데이터 조회**: Gateway Controller에 HTTP API 추가
2. **비동기 작업**: Kafka Controller에 메시지 핸들러 추가
3. **프론트엔드**: Admin에 API 호출 코드 추가
4. **디스코드**: Discord 봇에 명령어 추가

### 디스코드 명령어 등록

```bash
cd discord
node register-commands.js
```

### 테스트 플로우

1. Admin 대시보드 접속 (`http://localhost:3000/bet-flow`)
2. "말 10마리 생성" → "레이스 시작" → "베팅 데이터 생성"
3. "레이스 결과 생성" → "정산" 순서로 테스트

## 디버깅

### VS Code 디버깅

각 프로젝트별로 `.vscode/launch.json` 설정:

```json
{
  "type": "pwa-node",
  "request": "launch",
  "name": "Debug Discord Bot",
  "runtimeExecutable": "nodemon",
  "program": "${workspaceFolder}/discord/main.js",
  "envFile": "${workspaceFolder}/discord/.env"
}
```

### 로그 확인

- Core: NestJS 로그 출력
- Admin: Next.js 개발 서버 로그
- Discord: 콘솔 로그로 명령어 처리 상황 확인

## 배포

### Docker (권장)

```bash
# 각 앱별 Dockerfile 생성 후
docker-compose up -d
```

### 프로덕션 환경

- PostgreSQL 사용 권장
- Kafka 클러스터 구성
- Redis 캐시 추가 고려
- 로드 밸런서 설정

## 아키텍처 특징

### 마이크로서비스 구조

- **Core**: 비즈니스 로직과 데이터 관리
- **Admin**: 관리자용 웹 인터페이스
- **Discord**: 사용자 인터페이스 (봇)

### 비동기 메시징

- **즉시 응답 필요**: HTTP API 사용
- **백그라운드 처리**: Kafka 메시지 사용
- 확장성과 안정성 확보

### 데이터베이스 설계

- 말, 레이스, 베팅, 결과를 독립적 엔티티로 관리
- 향후 확장을 위한 유연한 스키마

## 향후 계획

- [ ] 실시간 레이스 시뮬레이션
- [ ] 레이스 리플레이 시스템
- [ ] 사용자 랭킹 시스템
- [ ] 모바일 앱 개발
- [ ] 웹 소켓 기반 실시간 알림
- [ ] 더 복잡한 베팅 옵션 (복승, 연승 등)

## 문제 해결

### 자주 발생하는 문제

1. **Kafka 연결 실패**: Kafka 서버 실행 상태 확인
2. **Discord 명령어 미동작**: 봇 권한 및 명령어 등록 상태 확인
3. **데이터베이스 에러**: SQLite 파일 권한 및 경로 확인

### 개발 환경 초기화

```bash
# 데이터베이스 초기화
rm core/horse-core.db

# 의존성 재설치
cd core && npm install
cd ../admin && npm install
cd ../discord && npm install
```

## 라이선스

MIT License

## 기여

1. Fork 프로젝트
2. Feature 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 Push (`git push origin feature/amazing-feature`)
5. Pull Request 생성

---

🐎 **행운을 빕니다!** 🐎
