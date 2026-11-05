import { useState } from "react"
import type { StepUi } from "./scenarios"

const SEAT_ROWS = ["A", "B", "C", "D", "E", "F"]
const SEAT_COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export type KioskLabels = {
  clear: string
  seatAria: (seat: string) => string
  takenAria: (seat: string) => string
  decrease: string
  increase: string
}

// 연습 화면 한 단계. 부모는 key로 단계마다 새로 그려 상태를 초기화한다.
export default function KioskStep({
  ui,
  highlight,
  labels,
  onWrong,
  onChange,
}: {
  ui: StepUi
  highlight: boolean
  labels: KioskLabels
  onWrong: () => void
  onChange: (correct: boolean) => void
}) {
  const [picked, setPicked] = useState<number | null>(null)
  const [seat, setSeat] = useState<string | null>(null)
  const [count, setCount] = useState(0)
  const [typed, setTyped] = useState("")
  const hl = (on: boolean) => (highlight && on ? " kiosk-target" : "")

  if (ui.kind === "grid") {
    return (
      <div
        className="kiosk-grid"
        style={{ "--kiosk-cols": ui.columns ?? (ui.items.length > 3 ? 3 : ui.items.length) } as React.CSSProperties}
      >
        {ui.items.map((item, index) => {
          const isPicked = picked === index
          const wrong = isPicked && index !== ui.answer
          return (
            <button
              type="button"
              key={item.label}
              aria-pressed={isPicked}
              className={`kiosk-item${isPicked ? " chosen" : ""}${wrong ? " wrong" : ""}${hl(index === ui.answer && picked !== ui.answer)}`}
              onClick={() => {
                if (picked === ui.answer) return
                if (index !== ui.answer) onWrong()
                setPicked(index)
                onChange(index === ui.answer)
              }}
            >
              <strong>{item.label}</strong>
              {item.sub && <small>{item.sub}</small>}
            </button>
          )
        })}
      </div>
    )
  }

  if (ui.kind === "counter") {
    const update = (next: number) => {
      const value = Math.max(0, Math.min(9, next))
      setCount(value)
      onChange(value === ui.target)
    }
    return (
      <div className="kiosk-counter">
        <span>{ui.label}</span>
        <button type="button" aria-label={labels.decrease} onClick={() => update(count - 1)}>−</button>
        <strong aria-live="polite">{count}</strong>
        <button type="button" aria-label={labels.increase} className={hl(count < ui.target).trim()} onClick={() => update(count + 1)}>+</button>
      </div>
    )
  }

  if (ui.kind === "seats") {
    return (
      <div className="kiosk-seats">
        <div className="kiosk-screen">{ui.screenLabel}</div>
        <div className="kiosk-seat-map" role="group">
          {SEAT_ROWS.map((row) => (
            <div className="kiosk-seat-row" key={row}>
              <b aria-hidden="true">{row}</b>
              {SEAT_COLS.map((col) => {
                const name = `${row}${col}`
                const taken = ui.taken.includes(name)
                const isPicked = seat === name
                const wrong = isPicked && name !== ui.answer
                return (
                  <button
                    type="button"
                    key={name}
                    disabled={taken}
                    aria-label={taken ? labels.takenAria(name) : labels.seatAria(name)}
                    aria-pressed={isPicked}
                    className={`seat${taken ? " taken" : ""}${isPicked ? " chosen" : ""}${wrong ? " wrong" : ""}${hl(name === ui.answer && seat !== ui.answer)}`}
                    onClick={() => {
                      if (seat === ui.answer) return
                      if (name !== ui.answer) onWrong()
                      setSeat(name)
                      onChange(name === ui.answer)
                    }}
                  >
                    {col}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const press = (digit: string) => {
    if (typed.length >= ui.code.length) return
    const next = typed + digit
    setTyped(next)
    if (next.length === ui.code.length && next !== ui.code) onWrong()
    onChange(next === ui.code)
  }
  const expected = ui.code[typed.length]
  const mismatch = typed.length > 0 && !ui.code.startsWith(typed)
  return (
    <div className="kiosk-keypad">
      <label>{ui.label}</label>
      <div className={`kiosk-display${mismatch ? " wrong" : ""}`} aria-live="polite">
        {typed.padEnd(ui.code.length, "·")}
      </div>
      <div className="kiosk-keys">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <button type="button" key={digit} className={hl(digit === expected && !mismatch).trim()} onClick={() => press(digit)}>{digit}</button>
        ))}
        <button
          type="button"
          className={`key-clear${hl(mismatch)}`}
          onClick={() => {
            setTyped("")
            onChange(false)
          }}
        >
          {labels.clear}
        </button>
        <button type="button" className={hl(expected === "0" && !mismatch).trim()} onClick={() => press("0")}>0</button>
        <span aria-hidden="true" />
      </div>
    </div>
  )
}
