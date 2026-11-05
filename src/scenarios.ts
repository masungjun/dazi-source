// 시나리오 데이터. 실제 키오스크 흐름을 단계별 화면(ui)으로 표현한다.
// 실제 개인정보를 받지 않도록 번호 입력은 화면에 적힌 연습용 번호만 쓴다.

export type Lang = "ko" | "en"
export type LevelKey = "easy" | "normal"

export type StepUi =
  | { kind: "grid"; items: { label: string; sub?: string }[]; answer: number; columns?: number }
  | { kind: "counter"; label: string; target: number }
  | { kind: "seats"; answer: string; taken: string[]; screenLabel: string }
  | { kind: "keypad"; code: string; label: string }

export type StepText = {
  title: string
  description: string
  hint: string
  ui: StepUi
}

export type ScenarioText = {
  title: string
  description: string
  time: string
  level: LevelKey
  kiosk: string
  receiptTitle: string
  receipt: string[]
  steps: StepText[]
}

export type Scenario = {
  id: string
  icon: "coffee" | "film" | "hospital"
  color: string
  iconColor: string
  ko: ScenarioText
  en: ScenarioText
}

const takenSeats = ["A3", "A4", "B5", "B6", "C2", "C8", "D4", "D5", "E7", "F1", "F2"]

export const scenarios: Scenario[] = [
  {
    id: "cafe",
    icon: "coffee",
    color: "#fff1dc",
    iconColor: "#e97838",
    ko: {
      title: "카페에서 음료 주문하기",
      description: "키오스크로 원하는 음료를 고르고 결제까지 연습해요.",
      time: "약 3분",
      level: "easy",
      kiosk: "카페 주문기",
      receiptTitle: "주문 번호 127",
      receipt: ["아메리카노(HOT) 1잔", "결제 금액 3,000원", "번호가 불리면 음료를 받아 가세요"],
      steps: [
        {
          title: "메뉴판에서 음료를 고르세요",
          description: "메뉴판에서 아메리카노를 찾아 눌러보세요.",
          hint: "메뉴판 첫 번째 줄에 있는 '아메리카노'를 눌러보세요.",
          ui: {
            kind: "grid",
            answer: 0,
            items: [
              { label: "아메리카노", sub: "3,000원" },
              { label: "카페라떼", sub: "3,500원" },
              { label: "유자차", sub: "4,000원" },
              { label: "초코라떼", sub: "4,000원" },
              { label: "딸기주스", sub: "4,500원" },
              { label: "케이크", sub: "5,000원" },
            ],
          },
        },
        {
          title: "음료 온도를 고르세요",
          description: "따뜻한 음료를 마시려고 해요. 따뜻한 쪽을 눌러보세요.",
          hint: "따뜻한 음료는 'HOT'이라고 적혀 있어요.",
          ui: { kind: "grid", answer: 0, columns: 2, items: [{ label: "HOT", sub: "따뜻하게" }, { label: "ICE", sub: "차갑게" }] },
        },
        {
          title: "담은 메뉴를 확인하세요",
          description: "아메리카노 1잔이 맞으면 결제로 넘어가요.",
          hint: "주문이 맞으면 '결제하기'를 눌러요.",
          ui: {
            kind: "grid",
            answer: 0,
            items: [{ label: "결제하기", sub: "합계 3,000원" }, { label: "메뉴 더 담기" }, { label: "전체 취소" }],
          },
        },
        {
          title: "결제 방법을 고르세요",
          description: "가지고 있는 카드로 결제해 볼게요.",
          hint: "카드로 결제할 때는 '신용·체크카드'를 눌러요.",
          ui: { kind: "grid", answer: 0, items: [{ label: "신용·체크카드" }, { label: "간편결제" }, { label: "기프티콘" }] },
        },
        {
          title: "카드를 넣어주세요",
          description: "화면 아래 투입구에 카드를 넣는 연습이에요. 실제 카드는 필요 없어요.",
          hint: "'카드 넣기'를 누르면 결제가 끝나요.",
          ui: { kind: "grid", answer: 0, columns: 2, items: [{ label: "카드 넣기", sub: "연습용" }, { label: "결제 취소" }] },
        },
      ],
    },
    en: {
      title: "Order a drink at a café",
      description: "Practice choosing a drink on the kiosk and paying for it.",
      time: "About 3 min",
      level: "easy",
      kiosk: "Café kiosk",
      receiptTitle: "Order no. 127",
      receipt: ["Americano (HOT) × 1", "Total ₩3,000", "Pick up your drink when your number is called"],
      steps: [
        {
          title: "Choose a drink from the menu",
          description: "Find the Americano on the menu and tap it.",
          hint: "Tap 'Americano' in the first row of the menu.",
          ui: {
            kind: "grid",
            answer: 0,
            items: [
              { label: "Americano", sub: "₩3,000" },
              { label: "Café latte", sub: "₩3,500" },
              { label: "Yuzu tea", sub: "₩4,000" },
              { label: "Choco latte", sub: "₩4,000" },
              { label: "Strawberry juice", sub: "₩4,500" },
              { label: "Cake", sub: "₩5,000" },
            ],
          },
        },
        {
          title: "Choose the temperature",
          description: "You'd like a hot drink. Tap the hot option.",
          hint: "Hot drinks are marked 'HOT'.",
          ui: { kind: "grid", answer: 0, columns: 2, items: [{ label: "HOT", sub: "Hot" }, { label: "ICE", sub: "Iced" }] },
        },
        {
          title: "Check your order",
          description: "If one Americano is right, go on to payment.",
          hint: "If the order is right, tap 'Pay'.",
          ui: {
            kind: "grid",
            answer: 0,
            items: [{ label: "Pay", sub: "Total ₩3,000" }, { label: "Add more" }, { label: "Cancel all" }],
          },
        },
        {
          title: "Choose a payment method",
          description: "Let's pay with the card you have.",
          hint: "To pay by card, tap 'Credit/Debit card'.",
          ui: { kind: "grid", answer: 0, items: [{ label: "Credit/Debit card" }, { label: "Mobile pay" }, { label: "Gift voucher" }] },
        },
        {
          title: "Insert your card",
          description: "This is practice for inserting a card. You don't need a real card.",
          hint: "Tap 'Insert card' to finish paying.",
          ui: { kind: "grid", answer: 0, columns: 2, items: [{ label: "Insert card", sub: "Practice" }, { label: "Cancel payment" }] },
        },
      ],
    },
  },
  {
    id: "cinema",
    icon: "film",
    color: "#e8f6ef",
    iconColor: "#3b9a68",
    ko: {
      title: "영화관 티켓 예매하기",
      description: "보고 싶은 영화와 좌석을 직접 선택해 보세요.",
      time: "약 5분",
      level: "normal",
      kiosk: "영화관 발권기",
      receiptTitle: "입장권",
      receipt: ["행복한 하루 · 14:30", "성인 1명 · 좌석 C5", "상영 10분 전까지 입장해 주세요"],
      steps: [
        {
          title: "볼 영화를 고르세요",
          description: "오후 2시 30분에 시작하는 '행복한 하루'를 찾아 눌러보세요.",
          hint: "제목이 '행복한 하루'인 칸을 눌러보세요.",
          ui: {
            kind: "grid",
            answer: 0,
            items: [
              { label: "행복한 하루", sub: "14:30 · 전체 관람가" },
              { label: "우주 탐험대", sub: "15:10 · 12세" },
              { label: "마지막 기차", sub: "16:00 · 15세" },
            ],
          },
        },
        {
          title: "인원을 정하세요",
          description: "어른 한 명이 볼 거예요. + 버튼으로 1명을 맞춰보세요.",
          hint: "+ 버튼을 한 번 누르면 1명이 돼요.",
          ui: { kind: "counter", label: "성인", target: 1 },
        },
        {
          title: "좌석을 고르세요",
          description: "C열 5번 자리를 찾아 눌러보세요. 회색 자리는 이미 예매된 자리예요.",
          hint: "위에서 세 번째 줄(C), 왼쪽에서 다섯 번째 자리예요.",
          ui: { kind: "seats", answer: "C5", taken: takenSeats, screenLabel: "스크린" },
        },
        {
          title: "결제 방법을 고르세요",
          description: "가지고 있는 카드로 결제해 볼게요.",
          hint: "카드로 결제할 때는 '신용·체크카드'를 눌러요.",
          ui: { kind: "grid", answer: 0, items: [{ label: "신용·체크카드", sub: "12,000원" }, { label: "간편결제" }, { label: "관람권 사용" }] },
        },
        {
          title: "카드를 넣어주세요",
          description: "화면 아래 투입구에 카드를 넣는 연습이에요. 실제 카드는 필요 없어요.",
          hint: "'카드 넣기'를 누르면 입장권이 나와요.",
          ui: { kind: "grid", answer: 0, columns: 2, items: [{ label: "카드 넣기", sub: "연습용" }, { label: "결제 취소" }] },
        },
      ],
    },
    en: {
      title: "Book a movie ticket",
      description: "Choose the movie and seat you want on your own.",
      time: "About 5 min",
      level: "normal",
      kiosk: "Cinema kiosk",
      receiptTitle: "Admission ticket",
      receipt: ["A Happy Day · 14:30", "1 adult · Seat C5", "Please enter 10 minutes before the show"],
      steps: [
        {
          title: "Choose a movie",
          description: "Find 'A Happy Day', which starts at 2:30 p.m., and tap it.",
          hint: "Tap the box titled 'A Happy Day'.",
          ui: {
            kind: "grid",
            answer: 0,
            items: [
              { label: "A Happy Day", sub: "14:30 · All ages" },
              { label: "Space Explorers", sub: "15:10 · 12+" },
              { label: "The Last Train", sub: "16:00 · 15+" },
            ],
          },
        },
        {
          title: "Set the number of people",
          description: "One adult is going. Use the + button to set it to 1.",
          hint: "Tap + once to make it 1.",
          ui: { kind: "counter", label: "Adult", target: 1 },
        },
        {
          title: "Choose your seat",
          description: "Find seat 5 in row C and tap it. Gray seats are already taken.",
          hint: "It's in the third row from the top (C), fifth seat from the left.",
          ui: { kind: "seats", answer: "C5", taken: takenSeats, screenLabel: "Screen" },
        },
        {
          title: "Choose a payment method",
          description: "Let's pay with the card you have.",
          hint: "To pay by card, tap 'Credit/Debit card'.",
          ui: { kind: "grid", answer: 0, items: [{ label: "Credit/Debit card", sub: "₩12,000" }, { label: "Mobile pay" }, { label: "Use a voucher" }] },
        },
        {
          title: "Insert your card",
          description: "This is practice for inserting a card. You don't need a real card.",
          hint: "Tap 'Insert card' to get your ticket.",
          ui: { kind: "grid", answer: 0, columns: 2, items: [{ label: "Insert card", sub: "Practice" }, { label: "Cancel payment" }] },
        },
      ],
    },
  },
  {
    id: "hospital",
    icon: "hospital",
    color: "#ecf1ff",
    iconColor: "#5979c7",
    ko: {
      title: "병원 진료 접수하기",
      description: "무인 접수기에서 진료 접수 과정을 익혀요.",
      time: "약 4분",
      level: "normal",
      kiosk: "병원 접수기",
      receiptTitle: "접수증",
      receipt: ["내과 · 대기 번호 18", "앞에 3명이 기다리고 있어요", "이름이 불리면 진료실로 들어가세요"],
      steps: [
        {
          title: "오늘 할 일을 고르세요",
          description: "진료를 받으려고 병원에 막 도착했어요.",
          hint: "진료를 받으려면 먼저 '진료 접수'를 눌러요.",
          ui: { kind: "grid", answer: 0, items: [{ label: "진료 접수" }, { label: "진료비 수납" }, { label: "처방전 발급" }] },
        },
        {
          title: "본인 확인 방법을 고르세요",
          description: "생년월일로 본인을 확인해 볼게요.",
          hint: "'생년월일'이 적힌 칸을 눌러요.",
          ui: { kind: "grid", answer: 0, items: [{ label: "생년월일" }, { label: "환자 번호" }, { label: "휴대전화" }] },
        },
        {
          title: "번호를 눌러 입력하세요",
          description: "연습용 번호 500101을 차례대로 눌러보세요. 실제 번호는 넣지 마세요.",
          hint: "5, 0, 0, 1, 0, 1 순서로 누르면 돼요. 잘못 누르면 '지우기'를 눌러요.",
          ui: { kind: "keypad", code: "500101", label: "생년월일 6자리 (연습용)" },
        },
        {
          title: "진료받을 과를 고르세요",
          description: "감기 증상으로 왔어요. 알맞은 곳을 골라보세요.",
          hint: "감기는 보통 '내과'에서 진료해요.",
          ui: { kind: "grid", answer: 0, items: [{ label: "내과" }, { label: "정형외과" }, { label: "안과" }] },
        },
        {
          title: "접수 내용을 확인하세요",
          description: "내과 접수가 맞으면 접수를 마쳐요.",
          hint: "내용이 맞으면 '접수하기'를 눌러요.",
          ui: { kind: "grid", answer: 0, columns: 2, items: [{ label: "접수하기", sub: "내과" }, { label: "처음으로" }] },
        },
      ],
    },
    en: {
      title: "Check in at a hospital",
      description: "Learn how to check in at a self-service kiosk.",
      time: "About 4 min",
      level: "normal",
      kiosk: "Hospital kiosk",
      receiptTitle: "Check-in slip",
      receipt: ["Internal medicine · Queue no. 18", "3 people are ahead of you", "Enter the clinic when your name is called"],
      steps: [
        {
          title: "Choose what you came for",
          description: "You just arrived at the hospital to see a doctor.",
          hint: "To see a doctor, tap 'Check in' first.",
          ui: { kind: "grid", answer: 0, items: [{ label: "Check in" }, { label: "Pay bill" }, { label: "Get prescription" }] },
        },
        {
          title: "Choose how to confirm your identity",
          description: "Let's confirm your identity with your date of birth.",
          hint: "Tap the box that says 'Date of birth'.",
          ui: { kind: "grid", answer: 0, items: [{ label: "Date of birth" }, { label: "Patient number" }, { label: "Mobile phone" }] },
        },
        {
          title: "Enter the number",
          description: "Press the practice number 500101 in order. Don't enter your real number.",
          hint: "Press 5, 0, 0, 1, 0, 1 in order. If you make a mistake, tap 'Clear'.",
          ui: { kind: "keypad", code: "500101", label: "6-digit date of birth (practice)" },
        },
        {
          title: "Choose a department",
          description: "You have cold symptoms. Choose the right department.",
          hint: "Colds are usually treated in 'Internal medicine'.",
          ui: { kind: "grid", answer: 0, items: [{ label: "Internal medicine" }, { label: "Orthopedics" }, { label: "Ophthalmology" }] },
        },
        {
          title: "Check your check-in details",
          description: "If internal medicine is right, finish checking in.",
          hint: "If the details are right, tap 'Check in'.",
          ui: { kind: "grid", answer: 0, columns: 2, items: [{ label: "Check in", sub: "Internal medicine" }, { label: "Start over" }] },
        },
      ],
    },
  },
]

export function localizedScenario(scenario: Scenario, lang: Lang): ScenarioText {
  return lang === "en" ? scenario.en : scenario.ko
}

// 기록 id는 `${scenario.id}-${timestamp}` 형식이라 언어가 바뀌어도 시나리오를 찾을 수 있다.
export function scenarioOfRecord(record: { id: string }): Scenario | undefined {
  const id = record.id.split("-")[0]
  return scenarios.find((scenario) => scenario.id === id)
}

// 반복 횟수에 따라 안내를 줄인다: 0회 따라하기, 1~2회 혼자 해보기, 3회 이상 실전
export type GuideLevel = 0 | 1 | 2
export function guideLevelFor(completions: number): GuideLevel {
  if (completions <= 0) return 0
  return completions < 3 ? 1 : 2
}
