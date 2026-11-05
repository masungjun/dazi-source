# 다지 (dazi)

시니어와 디지털 취약계층이 카페 주문, 영화 예매, 병원 접수를 실제 키오스크 흐름으로 연습하는 웹앱입니다. Vite + React 19 + TypeScript.

## 실행

```bash
pnpm install
pnpm dev --port 5181
pnpm build
```

## 구조

- `src/scenarios.ts`: 시나리오와 단계 데이터(한국어/영어), 안내 단계 계산
- `src/KioskStep.tsx`: 메뉴판, 인원 선택, 좌석표, 번호 키패드 화면
- `src/App.tsx`: 화면 이동, 기록, 설정, 선생님 보기

## 안내 단계

같은 연습을 완료한 횟수에 따라 안내가 줄어듭니다. 0회는 따라하기(눌러야 할 곳 강조), 1~2회는 혼자 해보기, 3회 이상은 실전(설명 숨김)입니다. 도움말을 누르면 언제든 강조가 다시 나옵니다.

## 데이터 저장

서버 없이 브라우저 `localStorage`에만 저장합니다. 설정 화면에서 JSON 백업 파일로 내보내고 불러올 수 있습니다.

- `daji-records`: 최근 연습 기록 20개(힌트 사용, 단계별 오답 포함)
- `daji-total-count`: 누적 완료 횟수
- `daji-lang`, `daji-large-text`, `daji-sound-guide`, `daji-high-contrast`, `daji-reduced-motion`: 설정

## 한계

- 실제 결제나 접수는 일어나지 않으며, 번호 입력은 화면에 적힌 연습용 번호만 사용합니다.
- 기록은 이 기기에만 있어 선생님 보기도 같은 기기에서만 볼 수 있습니다.
- 음성 안내는 브라우저 내장 음성을 쓰므로 기기마다 목소리가 다릅니다.
