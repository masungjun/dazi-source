import { useEffect, useMemo, useRef, useState } from "react"
import KioskStep from "./KioskStep"
import {
  guideLevelFor,
  localizedScenario,
  scenarioOfRecord,
  scenarios,
  type Lang,
  type Scenario,
} from "./scenarios"

type IconName = "home" | "book" | "chart" | "help" | "settings" | "coffee" | "film" | "hospital" | "arrow" | "clock" | "check" | "sound" | "close" | "back" | "spark"

type PracticeRecord = {
  id: string
  title: string
  seconds: number
  completedAt: string
  hintsUsed?: number
  wrongByStep?: number[]
}

type Page = "home" | "practice" | "records" | "help" | "settings" | "teacher"

const strings = {
  ko: {
    langSwitchAria: "언어 전환",
    brand: "다지",
    brandTag: "다시, 지금부터",
    navHome: "홈",
    navPractice: "연습하기",
    navRecords: "나의 기록",
    navHelp: "도움말",
    navSettings: "환경 설정",
    navSettingsShort: "설정",
    ariaMainNav: "주 메뉴",
    ariaMobileNav: "모바일 주 메뉴",
    sideTipTitle: "소리로 안내해 드려요",
    sideTipBody: "연습 중 어려우면 안내 듣기 버튼을 눌러보세요.",
    textSizeDefault: "기본 글씨",
    textSizeLarge: "글씨 크게",
    userGreeting: "다지 님",
    userSub: "오늘도 천천히 해봐요",
    homeEyebrow: "오늘의 디지털 연습",
    homeTitle: "다지 님, 반가워요!",
    homeSub: "오늘도 한 걸음씩, 천천히 연습해 볼까요?",
    todayLabel: "지금까지 완료한 연습",
    unitTimes: "개",
    homeSectionTitle: "무엇을 연습해 볼까요?",
    homeSectionSub: "원하는 상황을 골라 실제처럼 차근차근 연습해 보세요.",
    viewAllPractice: "연습 전체 보기",
    recordLabel: "나의 연습 기록",
    recordTitle: "조금씩 더 익숙해지고 있어요",
    recordSub: "실수해도 괜찮아요. 반복할수록 디지털 생활이 편안해져요.",
    statCompleted: "완료한 연습",
    statAvgTime: "평균 걸린 시간",
    statRecent: "최근 연습",
    noRecent: "아직 없어요",
    unitTimesShort: "회",
    helpBannerTitle: "사용이 어렵거나 궁금한 점이 있나요?",
    helpBannerSub: "선생님과 함께 보는 쉬운 사용 설명서를 확인해 보세요.",
    helpBannerButton: "쉬운 사용법 보기",
    practiceKicker: "상황별 반복 연습",
    practiceTitle: "연습하고 싶은 상황을 골라보세요",
    practiceSub: "틀려도 괜찮아요. 편안한 마음으로 여러 번 해보세요.",
    recommendLabel: "오늘의 추천 연습",
    recommendTitle: "처음이라면 카페 주문부터 시작해 보세요",
    recommendSub: "버튼을 고르고 카드로 결제하는 기본 사용법을 익힐 수 있어요.",
    startNow: "바로 시작하기",
    allPracticeTitle: "전체 연습",
    allPracticeSub: "생활에서 자주 마주치는 상황을 준비했어요.",
    countBadge: "총 {n}개",
    tip1Title: "시간은 중요하지 않아요",
    tip1Body: "천천히 정확하게 누르는 것이 먼저예요.",
    tip2Title: "설명을 다시 들을 수 있어요",
    tip2Body: "연습 화면의 ‘안내 듣기’를 눌러보세요.",
    tip3Title: "언제든 다시 도전해요",
    tip3Body: "같은 연습을 여러 번 반복해도 좋아요.",
    startPractice: "연습 시작하기",
    stepsUnit: "{n}단계",
    levelEasy: "쉬움",
    levelNormal: "보통",
    recordsKicker: "나의 성장 기록",
    recordsTitle: "연습할수록 자신감이 쌓여요",
    recordsSub: "완료한 연습과 걸린 시간을 한눈에 확인해 보세요.",
    statAloneSteps: "혼자 완료한 단계",
    unitSteps: "단계",
    recentRecordsTitle: "최근 연습 기록",
    recentRecordsSub: "최근 완료한 연습부터 보여드려요.",
    clearRecords: "기록 전체 지우기",
    clearConfirm: "모든 연습 기록을 지울까요?",
    emptyRecordsTitle: "아직 완료한 연습이 없어요",
    emptyRecordsSub: "첫 연습을 마치면 이곳에서 나의 기록을 볼 수 있어요.",
    startFirst: "첫 연습 시작하기",
    recordOrder: "{n}번째 완료",
    timeSpent: "걸린 시간",
    practiceAgain: "다시 연습",
    helpKicker: "쉬운 사용 안내",
    helpTitle: "어려울 땐 여기서 확인하세요",
    helpSub: "다지를 사용하는 방법을 순서대로 쉽게 알려드릴게요.",
    guide1Title: "연습을 골라요",
    guide1Body: "연습하기 메뉴에서 원하는 생활 상황을 선택하세요.",
    guide2Title: "천천히 눌러요",
    guide2Body: "화면의 설명을 읽고 알맞다고 생각하는 버튼을 누르세요.",
    guide3Title: "기록을 확인해요",
    guide3Body: "끝까지 마치면 나의 기록에서 결과를 볼 수 있어요.",
    faqTitle: "자주 묻는 질문",
    faqSub: "질문을 누르면 답을 볼 수 있어요.",
    faq1q: "잘못 눌렀어요. 어떻게 해야 하나요?",
    faq1a: "괜찮아요. 틀린 버튼을 누르면 다시 고를 수 있어요. 틀린 횟수는 나의 기록 화면에는 남지 않지만, 선생님 보기 화면에서는 어떤 단계에서 어려웠는지 집계돼요.",
    faq2q: "안내 문장을 소리로 들을 수 있나요?",
    faq2a: "연습 화면에서 ‘안내 듣기’ 버튼을 누르면 설명을 천천히 읽어드려요.",
    faq3q: "중간에 연습을 그만둘 수 있나요?",
    faq3a: "화면 왼쪽 위의 닫기 버튼을 누르면 언제든 연습을 종료할 수 있어요.",
    faq4q: "내 기록은 다른 사람도 볼 수 있나요?",
    faq4a: "기록은 지금 사용 중인 기기에만 저장되며 다른 사람에게 전송되지 않아요.",
    supportTitle: "화면을 함께 살펴볼까요?",
    supportBody: "복지관 선생님이나 가족과 함께 천천히 연습하면 더 쉽게 익힐 수 있어요.",
    goPractice: "연습 화면으로 가기",
    settingsKicker: "내게 편한 화면",
    settingsTitle: "환경 설정",
    settingsSub: "글씨와 화면을 보기 편하게 바꿀 수 있어요.",
    fontSizeTitle: "글씨 크기",
    fontSizeSub: "화면에 보이는 글씨를 더 크게 표시해요.",
    fontDefault: "기본 글씨",
    fontLarge: "큰 글씨",
    soundTitle: "음성 안내 사용",
    soundSub: "연습 화면에서 안내 문장을 소리로 들을 수 있어요.",
    contrastTitle: "선명한 화면",
    contrastSub: "글씨와 버튼의 색상 차이를 더 뚜렷하게 보여줘요.",
    motionTitle: "화면 움직임 줄이기",
    motionSub: "페이지 이동과 버튼의 움직임 효과를 줄여요.",
    settingsNote: "변경한 설정은 이 기기에 자동으로 저장됩니다.",
    overlayAria: "{title} 연습",
    practiceCloseAria: "연습 닫기",
    stepIndicator: "{cur} / {total} 단계",
    finishText: "연습을 끝까지 완료했어요",
    finishTitle: "정말 잘하셨어요!",
    viewRecords: "기록 확인하기",
    guideFollow: "따라하기",
    guideSolo: "혼자 해보기",
    guideReal: "실전",
    guideFollowSub: "눌러야 할 곳을 빛나게 알려드려요.",
    guideSoloSub: "이번에는 스스로 찾아보세요. 어려우면 도움말을 누르세요.",
    guideRealSub: "설명 없이 실제처럼 해보세요. 도움말은 언제든 볼 수 있어요.",
    keypadClear: "지우기",
    seatAria: "{seat} 좌석",
    takenAria: "{seat} 좌석, 이미 예매됨",
    decrease: "한 명 줄이기",
    increase: "한 명 늘리기",
    speechUnsupported: "이 기기는 음성 안내를 지원하지 않아요",
    keypadWrong: "번호가 달라요. '지우기'를 누르고 다시 해보세요.",
    receiptNote: "연습용 화면이에요. 실제 결제나 접수는 되지 않았어요.",
    backupTitle: "기록 백업",
    backupDesc: "기록과 설정을 파일로 저장하거나, 저장한 파일을 불러올 수 있어요.",
    backupExport: "백업 파일 저장",
    backupImport: "백업 파일 불러오기",
    backupImported: "백업을 불러왔어요.",
    backupFailed: "이 파일은 불러올 수 없어요. 다지 백업 파일인지 확인해 주세요.",
    kioskLabel: "연습용 화면",
    listenOn: "안내 듣기",
    listenOff: "음성 안내 꺼짐",
    feedbackError: "괜찮아요. 다시 한번 천천히 골라보세요.",
    feedbackSuccess: "맞아요! 다음 단계로 넘어가 볼까요?",
    hintPrefix: "도움말: ",
    showHint: "도움말 보기",
    finishPractice: "연습 완료하기",
    nextStep: "다음 단계",
    teacherTitle: "선생님 보기",
    teacherSub: "어느 단계에서 어려웠는지 한눈에 확인해요.",
    teacherListTitle: "연습별 집계",
    teacherListSub: "완료 횟수와 어려웠던 단계를 모았어요.",
    teacherPrint: "인쇄",
    teacherEmpty: "아직 기록이 없어요",
    teacherEmptySub: "연습을 완료하면 이곳에 집계가 보여요.",
    teacherColDone: "완료 횟수",
    teacherColAvg: "평균 시간",
    teacherColHints: "힌트 사용",
    teacherColWrong: "단계별 오답",
    teacherNoWrong: "오답 없음",
    unitCount: "회",
    finishStepsLabel: "혼자 완료한 단계",
    finishCompareLabel: "지난번과 비교",
    finishFirstTime: "처음 완료했어요",
    finishFaster: "지난번보다 {s} 빨라요",
    finishSlower: "지난번보다 {s} 더 걸렸어요",
    finishSame: "지난번과 같아요",
  },
  en: {
    langSwitchAria: "Switch language",
    brand: "Daji",
    brandTag: "Again, starting now",
    navHome: "Home",
    navPractice: "Practice",
    navRecords: "My records",
    navHelp: "Help",
    navSettings: "Settings",
    navSettingsShort: "Settings",
    ariaMainNav: "Main menu",
    ariaMobileNav: "Mobile main menu",
    sideTipTitle: "We guide you with sound",
    sideTipBody: "If a practice is hard, tap the Listen button.",
    textSizeDefault: "Default text",
    textSizeLarge: "Large text",
    userGreeting: "Daji",
    userSub: "Take it slow today, too",
    homeEyebrow: "Today's digital practice",
    homeTitle: "Welcome, Daji!",
    homeSub: "Shall we practice slowly, one step at a time?",
    todayLabel: "Practice completed so far",
    unitTimes: "times",
    homeSectionTitle: "What would you like to practice?",
    homeSectionSub: "Pick a situation and practice it step by step, like the real thing.",
    viewAllPractice: "View all practice",
    recordLabel: "My practice records",
    recordTitle: "You are getting more familiar, little by little",
    recordSub: "It's okay to make mistakes. The more you repeat, the easier digital life gets.",
    statCompleted: "Practice completed",
    statAvgTime: "Average time",
    statRecent: "Recent practice",
    noRecent: "None yet",
    unitTimesShort: "times",
    helpBannerTitle: "Finding it hard or have questions?",
    helpBannerSub: "Check the easy user guide you can read with your teacher.",
    helpBannerButton: "See the easy guide",
    practiceKicker: "Repeated practice by situation",
    practiceTitle: "Choose the situation you want to practice",
    practiceSub: "Mistakes are okay. Try as many times as you like.",
    recommendLabel: "Today's recommended practice",
    recommendTitle: "If it's your first time, start with ordering at a café",
    recommendSub: "You can learn the basics of choosing buttons and paying by card.",
    startNow: "Start now",
    allPracticeTitle: "All practice",
    allPracticeSub: "We prepared situations you often meet in daily life.",
    countBadge: "{n} in total",
    tip1Title: "Time doesn't matter",
    tip1Body: "Tapping slowly and correctly comes first.",
    tip2Title: "You can hear the explanation again",
    tip2Body: "Tap 'Listen' on the practice screen.",
    tip3Title: "Challenge again anytime",
    tip3Body: "It's fine to repeat the same practice many times.",
    startPractice: "Start practice",
    stepsUnit: "{n} steps",
    levelEasy: "Easy",
    levelNormal: "Medium",
    recordsKicker: "My growth records",
    recordsTitle: "Confidence grows as you practice",
    recordsSub: "See your completed practice and time spent at a glance.",
    statAloneSteps: "Steps completed on your own",
    unitSteps: "steps",
    recentRecordsTitle: "Recent practice records",
    recentRecordsSub: "We show your most recently completed practice first.",
    clearRecords: "Clear all records",
    clearConfirm: "Clear all practice records?",
    emptyRecordsTitle: "No completed practice yet",
    emptyRecordsSub: "Once you finish your first practice, you can see your records here.",
    startFirst: "Start your first practice",
    recordOrder: "Completed #{n}",
    timeSpent: "Time spent",
    practiceAgain: "Practice again",
    helpKicker: "Easy user guide",
    helpTitle: "When it's hard, check here",
    helpSub: "We will show you how to use Daji step by step.",
    guide1Title: "Choose a practice",
    guide1Body: "Select the daily-life situation you want in the Practice menu.",
    guide2Title: "Tap slowly",
    guide2Body: "Read the explanation on the screen and tap the button you think is right.",
    guide3Title: "Check your records",
    guide3Body: "When you finish, you can see the result in My records.",
    faqTitle: "Frequently asked questions",
    faqSub: "Tap a question to see the answer.",
    faq1q: "I tapped the wrong one. What should I do?",
    faq1a: "It's okay. If you tap a wrong button, you can choose again. Wrong taps don't appear in My records, but the Teacher view shows which steps were hard.",
    faq2q: "Can I hear the instructions as sound?",
    faq2a: "Tap the 'Listen' button on the practice screen and the explanation will be read slowly.",
    faq3q: "Can I stop the practice halfway?",
    faq3a: "Tap the close button at the top left of the screen to end the practice anytime.",
    faq4q: "Can other people see my records?",
    faq4a: "Records are saved only on the device you are using now and are never sent to anyone.",
    supportTitle: "Shall we look at the screen together?",
    supportBody: "Practicing slowly with a welfare-center teacher or family makes it easier to learn.",
    goPractice: "Go to the practice screen",
    settingsKicker: "A screen comfortable for you",
    settingsTitle: "Settings",
    settingsSub: "You can change the text and screen to make them easier to see.",
    fontSizeTitle: "Text size",
    fontSizeSub: "Shows the text on the screen larger.",
    fontDefault: "Default text",
    fontLarge: "Large text",
    soundTitle: "Voice guidance",
    soundSub: "You can hear the instructions as sound on the practice screen.",
    contrastTitle: "High contrast",
    contrastSub: "Makes the color difference between text and buttons clearer.",
    motionTitle: "Reduce screen motion",
    motionSub: "Reduces the motion effects of page moves and buttons.",
    settingsNote: "Your changes are saved automatically on this device.",
    overlayAria: "Practice: {title}",
    practiceCloseAria: "Close practice",
    stepIndicator: "Step {cur} / {total}",
    finishText: "You completed the practice to the end",
    finishTitle: "You did really well!",
    viewRecords: "Check records",
    guideFollow: "Follow along",
    guideSolo: "On your own",
    guideReal: "Real mode",
    guideFollowSub: "We'll light up where to tap.",
    guideSoloSub: "Try to find it yourself this time. Tap Hint if it's hard.",
    guideRealSub: "Try it with no instructions, like the real thing. Hints are always available.",
    keypadClear: "Clear",
    seatAria: "Seat {seat}",
    takenAria: "Seat {seat}, already taken",
    decrease: "One fewer person",
    increase: "One more person",
    speechUnsupported: "This device doesn't support voice guidance",
    keypadWrong: "That number is different. Tap 'Clear' and try again.",
    receiptNote: "This is a practice screen. No real payment or check-in happened.",
    backupTitle: "Back up records",
    backupDesc: "Save your records and settings to a file, or load a saved file.",
    backupExport: "Save backup file",
    backupImport: "Load backup file",
    backupImported: "Backup loaded.",
    backupFailed: "This file can't be loaded. Check that it's a Daji backup file.",
    kioskLabel: "Practice screen",
    listenOn: "Listen",
    listenOff: "Voice guidance off",
    feedbackError: "It's okay. Take your time and choose again.",
    feedbackSuccess: "That's right! Shall we move on to the next step?",
    hintPrefix: "Hint: ",
    showHint: "Show hint",
    finishPractice: "Finish practice",
    nextStep: "Next step",
    teacherTitle: "Teacher view",
    teacherSub: "See at a glance which steps were hard.",
    teacherListTitle: "Summary by practice",
    teacherListSub: "Completed counts and the steps that were hard.",
    teacherPrint: "Print",
    teacherEmpty: "No records yet",
    teacherEmptySub: "Finish a practice and the summary will appear here.",
    teacherColDone: "Completed",
    teacherColAvg: "Average time",
    teacherColHints: "Hints used",
    teacherColWrong: "Wrong taps by step",
    teacherNoWrong: "No wrong taps",
    unitCount: "",
    finishStepsLabel: "Steps completed on your own",
    finishCompareLabel: "Compared to last time",
    finishFirstTime: "First time completed",
    finishFaster: "{s} faster than last time",
    finishSlower: "{s} slower than last time",
    finishSame: "Same as last time",
  },
}

type Strings = (typeof strings)["ko"]

const stringsByLang: Record<Lang, Strings> = strings

function fill(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replace(`{${key}}`, String(value)),
    template,
  )
}

function Icon({
  name,
  size = 24,
  strokeWidth = 2,
}: {
  name: IconName
  size?: number
  strokeWidth?: number
}) {
  const paths: Record<IconName, React.ReactNode> = {
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10M9 20v-6h6v6" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22Z" />
        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5a2.5 2.5 0 0 1 2.5 2Z" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.8 9a2.3 2.3 0 1 1 3.4 2c-.8.5-1.2 1-1.2 2M12 17h.01" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
    coffee: (
      <>
        <path d="M5 8h12v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5Z" />
        <path d="M17 10h1a3 3 0 0 1 0 6h-2M7 3v2M11 3v2M15 3v2M4 22h15" />
      </>
    ),
    film: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 5v14M17 5v14M3 9h4M17 9h4M3 15h4M17 15h4" />
      </>
    ),
    hospital: (
      <>
        <rect x="4" y="3" width="16" height="19" rx="2" />
        <path d="M9 22v-5h6v5M9 8h6M12 5v6M8 14h.01M16 14h.01" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M14 7l5 5-5 5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    sound: (
      <>
        <path d="M11 5 6 9H3v6h3l5 4Z" />
        <path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    back: <path d="m15 18-6-6 6-6" />,
    spark: (
      <>
        <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2ZM6 14l.8 2.2L9 17l-2.2.8L6 20l-.8-2.2L3 17l2.2-.8Z" />
      </>
    ),
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${minutes}:${rest.toString().padStart(2, "0")}`
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      className={`toggle ${checked ? "on" : ""}`}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
    >
      <span />
    </button>
  )
}

const speechAvailable =
  typeof window !== "undefined" && "speechSynthesis" in window

// 이전 안내를 끊고, 언어를 지정해 천천히 읽는다.
function speak(text: string, lang: Lang) {
  if (!speechAvailable) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang === "en" ? "en-US" : "ko-KR"
  utterance.rate = 0.85
  window.speechSynthesis.speak(utterance)
}

function stopSpeaking() {
  if (speechAvailable) window.speechSynthesis.cancel()
}

const BACKUP_KEYS = [
  "daji-records",
  "daji-total-count",
  "daji-large-text",
  "daji-sound-guide",
  "daji-high-contrast",
  "daji-reduced-motion",
  "daji-lang",
]

function downloadBackup() {
  const data: Record<string, string> = {}
  for (const key of BACKUP_KEYS) {
    const value = localStorage.getItem(key)
    if (value !== null) data[key] = value
  }
  const blob = new Blob(
    [JSON.stringify({ app: "dazi", version: 1, data }, null, 2)],
    { type: "application/json" },
  )
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `dazi-backup-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

function restoreBackup(raw: string): boolean {
  const parsed = JSON.parse(raw)
  if (parsed?.app !== "dazi" || typeof parsed.data !== "object" || !parsed.data)
    return false
  const records = parsed.data["daji-records"]
  if (records !== undefined && !Array.isArray(JSON.parse(records))) return false
  for (const key of BACKUP_KEYS) {
    if (typeof parsed.data[key] === "string")
      localStorage.setItem(key, parsed.data[key])
  }
  return true
}

function fmt(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.split(`{${key}}`).join(String(value)),
    template,
  )
}

export default function App() {
  const [page, setPage] = useState<Page>(() => {
    const initial = window.location.hash.replace("#", "")
    return ["home", "practice", "records", "help", "settings", "teacher"].includes(initial)
      ? initial as Page
      : "home"
  })
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return localStorage.getItem("daji-lang") === "ko" ? "ko" : "en"
    } catch {
      return "en"
    }
  })
  const [largeText, setLargeText] = useState(
    () => localStorage.getItem("daji-large-text") === "true",
  )
  const [soundGuide, setSoundGuide] = useState(
    () => localStorage.getItem("daji-sound-guide") !== "false",
  )
  const [highContrast, setHighContrast] = useState(
    () => localStorage.getItem("daji-high-contrast") === "true",
  )
  const [reducedMotion, setReducedMotion] = useState(
    () => localStorage.getItem("daji-reduced-motion") === "true",
  )
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null)
  const [step, setStep] = useState(0)
  const [stepCorrect, setStepCorrect] = useState(false)
  const [wrongPick, setWrongPick] = useState(false)
  const [backupMessage, setBackupMessage] = useState("")
  const practiceRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const finishButtonRef = useRef<HTMLButtonElement>(null)
  const [showHint, setShowHint] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [finished, setFinished] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [wrongByStep, setWrongByStep] = useState<number[]>([])
  const [lastSeconds, setLastSeconds] = useState<number | null>(null)
  const [records, setRecords] = useState<PracticeRecord[]>(() => {
    try {
      const saved = localStorage.getItem("daji-records")
      const parsed = saved ? JSON.parse(saved) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })
  const [totalCount, setTotalCount] = useState<number>(() => {
    const saved = localStorage.getItem("daji-total-count")
    const parsed = saved ? Number(saved) : 0
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
  })

  const s = stringsByLang[lang]

  useEffect(() => {
    if (!activeScenario || finished) return
    const timer = window.setInterval(
      () => setSeconds((value) => value + 1),
      1000,
    )
    return () => window.clearInterval(timer)
  }, [activeScenario, finished])

  useEffect(() => {
    const handleHashChange = () => {
      const nextPage = window.location.hash.replace("#", "")
      if (
        ["home", "practice", "records", "help", "settings", "teacher"].includes(nextPage)
      )
        setPage(nextPage as Page)
    }
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("daji-lang", lang)
    } catch {
      // localStorage unavailable — keep in-memory language only
    }
    document.documentElement.lang = lang
    document.title =
      lang === "ko" ? "다지 — 시니어 디지털 연습" : "Dazi — Digital practice for seniors"
  }, [lang])

  useEffect(() => {
    localStorage.setItem("daji-large-text", String(largeText))
    localStorage.setItem("daji-sound-guide", String(soundGuide))
    localStorage.setItem("daji-high-contrast", String(highContrast))
    localStorage.setItem("daji-reduced-motion", String(reducedMotion))
  }, [largeText, soundGuide, highContrast, reducedMotion])

  const totalCompleted = totalCount
  const averageSeconds = useMemo(
    () =>
      records.length
        ? Math.round(
            records.reduce((sum, record) => sum + record.seconds, 0) /
              records.length,
          )
        : 0,
    [records],
  )

  function startPractice(scenario: Scenario) {
    openerRef.current = document.activeElement as HTMLElement | null
    setActiveScenario(scenario)
    setStep(0)
    setStepCorrect(false)
    setWrongPick(false)
    setShowHint(false)
    setSeconds(0)
    setFinished(false)
    setHintsUsed(0)
    setWrongByStep([])
    const previous = records.find(
      (record) => scenarioOfRecord(record)?.id === scenario.id,
    )
    setLastSeconds(previous ? previous.seconds : null)
    // 뒤로 가기를 누르면 앱을 벗어나지 않고 연습 화면만 닫히게 한다.
    window.history.pushState({ practice: true }, "", window.location.href)
  }

  function navigate(nextPage: Page) {
    setPage(nextPage)
    window.location.hash = nextPage
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" })
  }

  function closePractice() {
    stopSpeaking()
    setActiveScenario(null)
    setFinished(false)
    if (window.history.state?.practice) window.history.back()
  }

  function finishToRecords() {
    stopSpeaking()
    setActiveScenario(null)
    setFinished(false)
    if (window.history.state?.practice)
      window.history.replaceState(null, "", "#records")
    setPage("records")
    window.scrollTo({ top: 0 })
  }

  function moveNext() {
    const activeSteps = activeScenario
      ? localizedScenario(activeScenario, lang).steps
      : []
    if (!activeScenario || !stepCorrect) return
    stopSpeaking()
    if (step < activeSteps.length - 1) {
      setStep((value) => value + 1)
      setStepCorrect(false)
      setWrongPick(false)
      setShowHint(false)
      return
    }

    const newRecord: PracticeRecord = {
      id: `${activeScenario.id}-${Date.now()}`,
      title: localizedScenario(activeScenario, lang).title,
      seconds,
      completedAt: new Date().toISOString(),
      hintsUsed,
      wrongByStep,
    }
    const nextRecords = [newRecord, ...records].slice(0, 20)
    setRecords(nextRecords)
    localStorage.setItem("daji-records", JSON.stringify(nextRecords))
    const nextTotal = totalCount + 1
    setTotalCount(nextTotal)
    localStorage.setItem("daji-total-count", String(nextTotal))
    setFinished(true)
  }

  useEffect(() => {
    if (finished) finishButtonRef.current?.focus()
  }, [finished])

  // 연습 화면의 키보드 처리. ref 콜백 대신 열릴 때 한 번만 등록해 포커스가 튀지 않게 한다.
  const practiceOpen = Boolean(activeScenario)
  useEffect(() => {
    if (!practiceOpen) return
    practiceRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePractice()
        return
      }
      if (event.key !== "Tab" || !practiceRef.current) return
      const focusables = practiceRef.current.querySelectorAll<HTMLElement>(
        "button:not(:disabled), input, select, textarea",
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    const onPopState = () => {
      stopSpeaking()
      setActiveScenario(null)
      setFinished(false)
    }
    document.addEventListener("keydown", onKeyDown)
    window.addEventListener("popstate", onPopState)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("popstate", onPopState)
      openerRef.current?.focus?.()
    }
  }, [practiceOpen])

  const currentStep = activeScenario
    ? localizedScenario(activeScenario, lang).steps[step]
    : undefined
  const isCorrect = stepCorrect
  const guideLevel = activeScenario
    ? guideLevelFor(
        records.filter(
          (record) => scenarioOfRecord(record)?.id === activeScenario.id,
        ).length,
      )
    : 0

  function renderScenarioCards() {
    return (
      <div className="scenario-grid">
        {scenarios.map((scenario) => {
          const text = localizedScenario(scenario, lang)
          return (
            <article className="scenario-card" key={scenario.id}>
              <div
                className="scenario-art"
                style={{ backgroundColor: scenario.color }}
              >
                <div
                  className="scenario-icon"
                  style={{ color: scenario.iconColor }}
                >
                  <Icon name={scenario.icon} size={51} strokeWidth={1.65} />
                </div>
                <span
                  className={`level ${text.level === "easy" ? "easy" : ""}`}
                >
                  {text.level === "easy" ? s.levelEasy : s.levelNormal}
                </span>
              </div>
              <div className="scenario-body">
                <h3>{text.title}</h3>
                <p>{text.description}</p>
                <div className="meta">
                  <Icon name="clock" size={17} />
                  <span>{text.time}</span>
                  <span>·</span>
                  <span>{fill(s.stepsUnit, { n: text.steps.length })}</span>
                </div>
                <button type="button" onClick={() => startPractice(scenario)}>
                  {s.startPractice} <Icon name="arrow" size={20} />
                </button>
              </div>
            </article>
          )
        })}
      </div>
    )
  }

  function renderHomePage() {
    return (
      <>
        <section className="welcome">
          <div>
            <p className="eyebrow">
              <Icon name="spark" size={17} /> {s.homeEyebrow}
            </p>
            <h1>{s.homeTitle}</h1>
            <p>{s.homeSub}</p>
          </div>
          <div className="today-card">
            <div className="today-icon">
              <Icon name="check" size={25} strokeWidth={2.5} />
            </div>
            <div>
              <span>{s.todayLabel}</span>
              <strong>
                {totalCompleted}
                <small>{s.unitTimes}</small>
              </strong>
            </div>
          </div>
        </section>

        <section>
          <div className="section-title">
            <div>
              <h2>{s.homeSectionTitle}</h2>
              <p>{s.homeSectionSub}</p>
            </div>
            <button className="text-link" onClick={() => navigate("practice")}>
              {s.viewAllPractice} <Icon name="arrow" size={18} />
            </button>
          </div>
          {renderScenarioCards()}
        </section>

        <section className="record-section">
          <div className="record-copy">
            <span className="record-label">{s.recordLabel}</span>
            <h2>{s.recordTitle}</h2>
            <p>{s.recordSub}</p>
          </div>
          <div className="record-stats">
            <div>
              <span>{s.statCompleted}</span>
              <strong>
                {totalCompleted}
                <small>{s.unitTimesShort}</small>
              </strong>
            </div>
            <div className="stat-divider" />
            <div>
              <span>{s.statAvgTime}</span>
              <strong>
                {averageSeconds ? formatTime(averageSeconds) : "—"}
              </strong>
            </div>
            <div className="stat-divider" />
            <div>
              <span>{s.statRecent}</span>
              <strong className="recent">
                {records[0]
                  ? (() => {
                      const recent = scenarioOfRecord(records[0])
                      return recent
                        ? localizedScenario(recent, lang).title.split(" ")[0]
                        : records[0].title.split(" ")[0]
                    })()
                  : s.noRecent}
              </strong>
            </div>
          </div>
        </section>

        <section className="help-banner">
          <div className="help-symbol">
            <Icon name="help" size={32} />
          </div>
          <div>
            <h3>{s.helpBannerTitle}</h3>
            <p>{s.helpBannerSub}</p>
          </div>
          <button type="button" onClick={() => navigate("help")}>
            {s.helpBannerButton} <Icon name="arrow" size={18} />
          </button>
        </section>
      </>
    )
  }

  function renderPracticePage() {
    return (
      <>
        <section className="page-heading">
          <span className="page-kicker">{s.practiceKicker}</span>
          <h1>{s.practiceTitle}</h1>
          <p>{s.practiceSub}</p>
        </section>

        <section className="recommend-card">
          <div className="recommend-icon">
            <Icon name="coffee" size={43} strokeWidth={1.7} />
          </div>
          <div className="recommend-copy">
            <span>{s.recommendLabel}</span>
            <h2>{s.recommendTitle}</h2>
            <p>{s.recommendSub}</p>
          </div>
          <button type="button" onClick={() => startPractice(scenarios[0])}>
            {s.startNow} <Icon name="arrow" size={19} />
          </button>
        </section>

        <section className="all-practice">
          <div className="section-title">
            <div>
              <h2>{s.allPracticeTitle}</h2>
              <p>{s.allPracticeSub}</p>
            </div>
            <span className="count-badge">
              {fill(s.countBadge, { n: scenarios.length })}
            </span>
          </div>
          {renderScenarioCards()}
        </section>

        <section className="practice-tip-row">
          <div>
            <Icon name="clock" />
            <span>
              <strong>{s.tip1Title}</strong>
              {s.tip1Body}
            </span>
          </div>
          <div>
            <Icon name="sound" />
            <span>
              <strong>{s.tip2Title}</strong>
              {s.tip2Body}
            </span>
          </div>
          <div>
            <Icon name="check" />
            <span>
              <strong>{s.tip3Title}</strong>
              {s.tip3Body}
            </span>
          </div>
        </section>
      </>
    )
  }

  function renderRecordsPage() {
    return (
      <>
        <section className="page-heading">
          <span className="page-kicker">{s.recordsKicker}</span>
          <h1>{s.recordsTitle}</h1>
          <p>{s.recordsSub}</p>
        </section>

        <section className="summary-grid">
          <article>
            <div className="summary-icon green">
              <Icon name="check" />
            </div>
            <span>{s.statCompleted}</span>
            <strong>
              {totalCompleted}
              <small>{s.unitTimesShort}</small>
            </strong>
          </article>
          <article>
            <div className="summary-icon orange">
              <Icon name="clock" />
            </div>
            <span>{s.statAvgTime}</span>
            <strong>{averageSeconds ? formatTime(averageSeconds) : "—"}</strong>
          </article>
          <article>
            <div className="summary-icon blue">
              <Icon name="spark" />
            </div>
            <span>{s.statAloneSteps}</span>
            <strong>
              {totalCompleted * 3}
              <small>{s.unitSteps}</small>
            </strong>
          </article>
        </section>

        <section className="records-panel">
          <div className="panel-heading">
            <div>
              <h2>{s.recentRecordsTitle}</h2>
              <p>{s.recentRecordsSub}</p>
            </div>
            {records.length > 0 && (
              <button
                className="clear-button"
                type="button"
                onClick={() => {
                  if (window.confirm(s.clearConfirm)) {
                    setRecords([])
                    localStorage.removeItem("daji-records")
                    setTotalCount(0)
                    localStorage.removeItem("daji-total-count")
                  }
                }}
              >
                {s.clearRecords}
              </button>
            )}
          </div>

          {records.length === 0 ? (
            <div className="empty-records">
              <div>
                <Icon name="chart" size={38} />
              </div>
              <h3>{s.emptyRecordsTitle}</h3>
              <p>{s.emptyRecordsSub}</p>
              <button type="button" onClick={() => navigate("practice")}>
                {s.startFirst} <Icon name="arrow" size={19} />
              </button>
            </div>
          ) : (
            <div className="record-list">
              {records.map((record, index) => {
                const scenario = scenarioOfRecord(record)
                return (
                  <article key={record.id}>
                    <div
                      className="record-item-icon"
                      style={{
                        color: scenario?.iconColor,
                        background: scenario?.color,
                      }}
                    >
                      <Icon name={scenario?.icon || "book"} />
                    </div>
                    <div className="record-item-title">
                      <strong>{scenario ? localizedScenario(scenario, lang).title : record.title}</strong>
                      <span>
                        {new Date(record.completedAt).toLocaleDateString(
                          lang === "en" ? "en-US" : "ko-KR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                    <span className="record-order">
                      {fill(s.recordOrder, { n: index + 1 })}
                    </span>
                    <div className="record-time">
                      <span>{s.timeSpent}</span>
                      <strong>{formatTime(record.seconds)}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => startPractice(scenario || scenarios[0])}
                    >
                      {s.practiceAgain}
                    </button>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </>
    )
  }

  function renderHelpPage() {
    return (
      <>
        <section className="page-heading">
          <span className="page-kicker">{s.helpKicker}</span>
          <h1>{s.helpTitle}</h1>
          <p>{s.helpSub}</p>
        </section>

        <section className="guide-steps">
          {[
            ["1", s.guide1Title, s.guide1Body],
            ["2", s.guide2Title, s.guide2Body],
            ["3", s.guide3Title, s.guide3Body],
          ].map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <div>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="help-layout">
          <div className="faq-panel">
            <div className="panel-heading">
              <div>
                <h2>{s.faqTitle}</h2>
                <p>{s.faqSub}</p>
              </div>
            </div>
            <details open>
              <summary>{s.faq1q}</summary>
              <p>{s.faq1a}</p>
            </details>
            <details>
              <summary>{s.faq2q}</summary>
              <p>{s.faq2a}</p>
            </details>
            <details>
              <summary>{s.faq3q}</summary>
              <p>{s.faq3a}</p>
            </details>
            <details>
              <summary>{s.faq4q}</summary>
              <p>{s.faq4a}</p>
            </details>
          </div>

          <aside className="support-card">
            <div className="help-symbol">
              <Icon name="sound" size={31} />
            </div>
            <h2>{s.supportTitle}</h2>
            <p>{s.supportBody}</p>
            <button type="button" onClick={() => navigate("practice")}>
              {s.goPractice} <Icon name="arrow" size={18} />
            </button>
          </aside>
        </section>
      </>
    )
  }

  function renderTeacherPage() {
    const stats = scenarios.map((scenario) => {
      const scenarioRecords = records.filter(
        (record) => scenarioOfRecord(record)?.id === scenario.id,
      )
      const wrongByStep: number[] = []
      let hints = 0
      for (const record of scenarioRecords) {
        hints += record.hintsUsed || 0
        ;(record.wrongByStep || []).forEach((count, index) => {
          wrongByStep[index] = (wrongByStep[index] || 0) + count
        })
      }
      const avg = scenarioRecords.length
        ? Math.round(
            scenarioRecords.reduce((sum, record) => sum + record.seconds, 0) /
              scenarioRecords.length,
          )
        : 0
      return {
        scenario,
        text: localizedScenario(scenario, lang),
        count: scenarioRecords.length,
        avg,
        hints,
        wrongByStep,
      }
    })
    const hasAny = stats.some((item) => item.count > 0)

    return (
      <>
        <section className="page-heading">
          <span className="page-kicker">{s.recordsKicker}</span>
          <h1>{s.teacherTitle}</h1>
          <p>{s.teacherSub}</p>
        </section>

        <section className="teacher-panel records-panel">
          <div className="panel-heading">
            <div>
              <h2>{s.teacherListTitle}</h2>
              <p>{s.teacherListSub}</p>
            </div>
            <button
              className="clear-button"
              type="button"
              onClick={() => window.print()}
            >
              {s.teacherPrint}
            </button>
          </div>

          {!hasAny ? (
            <div className="empty-records">
              <div>
                <Icon name="chart" size={38} />
              </div>
              <h3>{s.teacherEmpty}</h3>
              <p>{s.teacherEmptySub}</p>
            </div>
          ) : (
            <div className="teacher-list">
              {stats.map((item) => (
                <article key={item.scenario.id}>
                  <div
                    className="record-item-icon"
                    style={{
                      color: item.scenario.iconColor,
                      background: item.scenario.color,
                    }}
                  >
                    <Icon name={item.scenario.icon} />
                  </div>
                  <div className="teacher-scenario">
                    <strong>{item.text.title}</strong>
                    <span>
                      {s.teacherColDone}: {item.count}
                      {s.unitCount} · {s.teacherColAvg}:{" "}
                      {item.avg ? formatTime(item.avg) : "—"} ·{" "}
                      {s.teacherColHints}: {item.hints}
                      {s.unitCount}
                    </span>
                  </div>
                  <div className="teacher-wrong">
                    <span>{s.teacherColWrong}</span>
                    <div className="teacher-wrong-steps">
                      {item.wrongByStep.length &&
                      item.wrongByStep.some(Boolean) ? (
                        item.wrongByStep.map((count, index) =>
                          count ? (
                            <span key={index}>
                              {fill(s.stepIndicator, {
                                cur: index + 1,
                                total: item.text.steps.length,
                              })}
                              : {count}
                            </span>
                          ) : null,
                        )
                      ) : (
                        <span className="teacher-no-wrong">
                          {s.teacherNoWrong}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </>
    )
  }

  function renderSettingsPage() {
    return (
      <>
        <section className="page-heading">
          <span className="page-kicker">{s.settingsKicker}</span>
          <h1>{s.settingsTitle}</h1>
          <p>{s.settingsSub}</p>
        </section>

        <section className="settings-panel">
          <div className="settings-group">
            <div className="settings-group-title">
              <div className="summary-icon orange">
                <span className="text-size-icon">가</span>
              </div>
              <div>
                <h2>{s.fontSizeTitle}</h2>
                <p>{s.fontSizeSub}</p>
              </div>
            </div>
            <div className="font-options">
              <button
                type="button"
                className={!largeText ? "selected" : ""}
                onClick={() => setLargeText(false)}
              >
                <span>가</span> {s.fontDefault}
              </button>
              <button
                type="button"
                className={largeText ? "selected" : ""}
                onClick={() => setLargeText(true)}
              >
                <strong>가</strong> {s.fontLarge}
              </button>
            </div>
          </div>

          <div className="setting-row">
            <div className="setting-copy">
              <div className="summary-icon green">
                <Icon name="sound" />
              </div>
              <div>
                <h2>{s.soundTitle}</h2>
                <p>{s.soundSub}</p>
              </div>
            </div>
            <Toggle
              checked={soundGuide}
              onChange={() => setSoundGuide((value) => !value)}
              label={s.soundTitle}
            />
          </div>

          <div className="setting-row">
            <div className="setting-copy">
              <div className="summary-icon blue">
                <Icon name="spark" />
              </div>
              <div>
                <h2>{s.contrastTitle}</h2>
                <p>{s.contrastSub}</p>
              </div>
            </div>
            <Toggle
              checked={highContrast}
              onChange={() => setHighContrast((value) => !value)}
              label={s.contrastTitle}
            />
          </div>

          <div className="setting-row">
            <div className="setting-copy">
              <div className="summary-icon neutral">
                <Icon name="settings" />
              </div>
              <div>
                <h2>{s.motionTitle}</h2>
                <p>{s.motionSub}</p>
              </div>
            </div>
            <Toggle
              checked={reducedMotion}
              onChange={() => setReducedMotion((value) => !value)}
              label={s.motionTitle}
            />
          </div>
        </section>

        <section className="settings-panel backup-panel">
          <div className="setting-copy">
            <div className="summary-icon neutral">
              <Icon name="book" />
            </div>
            <div>
              <h2>{s.backupTitle}</h2>
              <p>{s.backupDesc}</p>
            </div>
          </div>
          <div className="backup-actions">
            <button type="button" onClick={downloadBackup}>
              {s.backupExport}
            </button>
            <label>
              {s.backupImport}
              <input
                type="file"
                accept="application/json,.json"
                onChange={async (event) => {
                  const file = event.target.files?.[0]
                  event.target.value = ""
                  if (!file) return
                  try {
                    if (!restoreBackup(await file.text())) throw new Error("invalid")
                    setBackupMessage(s.backupImported)
                    window.setTimeout(() => window.location.reload(), 900)
                  } catch {
                    setBackupMessage(s.backupFailed)
                  }
                }}
              />
            </label>
          </div>
          {backupMessage && <p role="status" className="backup-message">{backupMessage}</p>}
        </section>

        <p className="settings-note">{s.settingsNote}</p>
      </>
    )
  }

  const renderers: Record<Page, () => React.ReactNode> = {
    home: renderHomePage,
    practice: renderPracticePage,
    records: renderRecordsPage,
    help: renderHelpPage,
    settings: renderSettingsPage,
    teacher: renderTeacherPage,
  }

  const navItems: { id: Page; label: string; icon: IconName }[] = [
    { id: "home", label: s.navHome, icon: "home" },
    { id: "practice", label: s.navPractice, icon: "book" },
    { id: "records", label: s.navRecords, icon: "chart" },
    { id: "help", label: s.navHelp, icon: "help" },
    { id: "teacher", label: s.teacherTitle, icon: "chart" },
  ]

  return (
    <div
      className={`app-shell ${largeText ? "large-text" : ""} ${
        highContrast ? "high-contrast" : ""
      } ${reducedMotion ? "reduced-motion" : ""}`}
    >
      <aside className="sidebar">
        <button
          className="brand"
          type="button"
          onClick={() => navigate("home")}
        >
          <div className="brand-mark">
            <span>+</span>
          </div>
          <div>
            <strong>{s.brand}</strong>
            <small>{s.brandTag}</small>
          </div>
        </button>

        <nav className="side-nav" aria-label={s.ariaMainNav}>
          {navItems.map((item) => (
            <button
              className={page === item.id ? "active" : ""}
              type="button"
              key={item.id}
              onClick={() => navigate(item.id)}
            >
              <Icon name={item.icon} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="side-tip">
          <div className="tip-icon">
            <Icon name="sound" size={22} />
          </div>
          <strong>{s.sideTipTitle}</strong>
          <p>{s.sideTipBody}</p>
        </div>

        <button
          className={`settings-button ${page === "settings" ? "active" : ""}`}
          type="button"
          onClick={() => navigate("settings")}
        >
          <Icon name="settings" />
          {s.navSettings}
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-brand"
            type="button"
            onClick={() => navigate("home")}
          >
            <div className="brand-mark">
              <span>+</span>
            </div>
            <strong>{s.brand}</strong>
          </button>
          <button
            className={`text-size-button ${largeText ? "selected" : ""}`}
            type="button"
            onClick={() => setLargeText((value) => !value)}
            aria-pressed={largeText}
          >
            <span className="text-size-icon">가</span>
            {largeText ? s.textSizeDefault : s.textSizeLarge}
          </button>
          <button
            className="text-size-button"
            type="button"
            onClick={() => setLang((value) => (value === "ko" ? "en" : "ko"))}
            aria-label={s.langSwitchAria}
          >
            {lang === "ko" ? "EN" : "KO"}
          </button>
          <div className="user-chip">
            <span className="avatar">다</span>
            <div>
              <strong>{s.userGreeting}</strong>
              <small>{s.userSub}</small>
            </div>
          </div>
        </header>

        <div className="content-wrap">{renderers[page]()}</div>
      </main>

      <nav className="mobile-nav" aria-label={s.ariaMobileNav}>
        {[
          ...navItems,
          {
            id: "settings" as Page,
            label: s.navSettingsShort,
            icon: "settings" as IconName,
          },
        ].map((item) => (
          <button
            className={page === item.id ? "active" : ""}
            type="button"
            key={item.id}
            onClick={() => navigate(item.id)}
          >
            <Icon name={item.icon} size={21} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {activeScenario && currentStep && (
        <div
          className="practice-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={fill(s.overlayAria, {
            title: localizedScenario(activeScenario, lang).title,
          })}
        >
          <div className="practice-modal" tabIndex={-1} ref={practiceRef}>
            <header className="practice-header">
              <button
                type="button"
                className="icon-button"
                onClick={closePractice}
                aria-label={s.practiceCloseAria}
              >
                <Icon name="close" />
              </button>
              <div className="practice-heading">
                <span>{localizedScenario(activeScenario, lang).title}</span>
                <strong>
                  {fill(s.stepIndicator, {
                    cur: finished ? localizedScenario(activeScenario, lang).steps.length : step + 1,
                    total: localizedScenario(activeScenario, lang).steps.length,
                  })}
                </strong>
              </div>
              <div className={`guide-chip guide-${guideLevel}`}>
                {[s.guideFollow, s.guideSolo, s.guideReal][guideLevel]}
              </div>
            </header>
            <div className="progress-track">
              <span
                style={{
                  width: `${(finished ? 1 : (step + 1) / localizedScenario(activeScenario, lang).steps.length) * 100}%`,
                }}
              />
            </div>

            {finished ? (
              <div className="finish-screen">
                <div className="finish-check">
                  <Icon name="check" size={48} strokeWidth={2.4} />
                </div>
                <p>{s.finishText}</p>
                <h2>{s.finishTitle}</h2>
                <div className="receipt">
                  <strong>{localizedScenario(activeScenario, lang).receiptTitle}</strong>
                  {localizedScenario(activeScenario, lang).receipt.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                  <small>{s.receiptNote}</small>
                </div>
                <div className="finish-stats">
                  <div className="finish-time">
                    <span>{s.finishStepsLabel}</span>
                    <strong>
                      {Math.max(0, localizedScenario(activeScenario, lang).steps.length - hintsUsed)}
                      <small>{s.unitSteps}</small>
                    </strong>
                  </div>
                  <div className="finish-time">
                    <span>{s.finishCompareLabel}</span>
                    <strong className="finish-compare">
                      {lastSeconds === null
                        ? s.finishFirstTime
                        : seconds < lastSeconds
                          ? fill(s.finishFaster, {
                              s: formatTime(lastSeconds - seconds),
                            })
                          : seconds > lastSeconds
                            ? fill(s.finishSlower, {
                                s: formatTime(seconds - lastSeconds),
                              })
                            : s.finishSame}
                    </strong>
                  </div>
                </div>
                <button type="button" ref={finishButtonRef} onClick={finishToRecords}>
                  {s.viewRecords} <Icon name="arrow" size={20} />
                </button>
              </div>
            ) : (
              <div className="practice-content">
                <div className="kiosk-label">
                  <span /> {s.kioskLabel}
                </div>
                <h2>{currentStep.title}</h2>
                {(guideLevel < 2 || showHint) && (
                  <p className="instruction">{currentStep.description}</p>
                )}
                <p className="guide-sub">
                  {[s.guideFollowSub, s.guideSoloSub, s.guideRealSub][guideLevel]}
                </p>
                <button
                  className="listen-button"
                  type="button"
                  disabled={!soundGuide || !speechAvailable}
                  onClick={() =>
                    speak(`${currentStep.title}. ${currentStep.description}`, lang)
                  }
                >
                  <Icon name="sound" size={20} />{" "}
                  {!speechAvailable
                    ? s.speechUnsupported
                    : soundGuide
                      ? s.listenOn
                      : s.listenOff}
                </button>

                <div className="kiosk-frame">
                  <div className="kiosk-bar">
                    <b>{localizedScenario(activeScenario, lang).kiosk}</b>
                    <span>{fill(s.stepIndicator, { cur: step + 1, total: localizedScenario(activeScenario, lang).steps.length })}</span>
                  </div>
                  <div className="kiosk-body">
                    <KioskStep
                      key={`${activeScenario.id}-${step}`}
                      ui={currentStep.ui}
                      highlight={guideLevel === 0 || showHint}
                      labels={{
                        clear: s.keypadClear,
                        seatAria: (seat) => fmt(s.seatAria, { seat }),
                        takenAria: (seat) => fmt(s.takenAria, { seat }),
                        decrease: s.decrease,
                        increase: s.increase,
                      }}
                      onWrong={() => {
                        setWrongPick(true)
                        setWrongByStep((list) => {
                          const next = [...list]
                          next[step] = (next[step] || 0) + 1
                          return next
                        })
                      }}
                      onChange={(correct) => {
                        setStepCorrect(correct)
                        if (correct) setWrongPick(false)
                      }}
                    />
                  </div>
                </div>

                <div aria-live="polite">
                  {wrongPick && !isCorrect && (
                    <div className="feedback error">
                      {currentStep.ui.kind === "keypad" ? s.keypadWrong : s.feedbackError}
                    </div>
                  )}
                  {isCorrect && (
                    <div className="feedback success">
                      <Icon name="check" size={20} /> {s.feedbackSuccess}
                    </div>
                  )}
                  {showHint && !isCorrect && (
                    <div className="hint">{s.hintPrefix}{currentStep.hint}</div>
                  )}
                </div>

                <footer className="practice-actions">
                  <button
                    type="button"
                    className="hint-button"
                    onClick={() => {
                      if (!showHint) setHintsUsed((value) => value + 1)
                      setShowHint(true)
                    }}
                  >
                    <Icon name="help" size={20} /> {s.showHint}
                  </button>
                  <button
                    type="button"
                    className="next-button"
                    disabled={!isCorrect}
                    onClick={moveNext}
                  >
                    {step === localizedScenario(activeScenario, lang).steps.length - 1
                      ? s.finishPractice
                      : s.nextStep}{" "}
                    <Icon name="arrow" size={20} />
                  </button>
                </footer>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
