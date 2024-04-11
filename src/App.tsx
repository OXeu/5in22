import { useEffect, useState } from "react";
import ConfettiExplosion from 'react-confetti-explosion';

// 随机生成一个不在 exist 中的 1~max 的整数
function randomInt(exist: number[], max: number) {
  var result = Math.floor(Math.random() * max) + 1
  while (exist.includes(result)) {
    result = Math.floor(Math.random() * max) + 1
  }
  return result
}

// 开始抽奖
function startLottery(exist: number[], setValue: (id: number, value: number) => void) {
  const id = exist.length
  const result = randomInt(exist, 22)
  setTimeout(() => {
    setValue(id, result)
    if (id < 4)
      startLottery(exist.concat(result), setValue);
  }, 1000)
}

// 帮我选
function chooseForMe(exist: number[], setValue: (id: number, value: number) => void) {
  const id = exist.length
  const result = randomInt(exist, 22)
  setValue(id, result)
  if (id < 4)
    chooseForMe(exist.concat(result), setValue);
}

// 生成 1~22 的数组
const selectableNumbers = Array.from({ length: 22 }, (_, i) => i + 1)

// 开始滚动
function startScrolling(setScrolling: () => void) {
  setTimeout(() => {
    setScrolling()
  }, 16)
}

function App() {
  const [currentScrollingId, setCurrntScrolling] = useState(-1)
  const [state, setState] = useState([0, 0, 0, 0, 0])
  const [status, setStatus] = useState(0) // 0 selecting 1 selected 2 lottering 3 finished
  const [lottery, setLottery] = useState([0, 0, 0, 0, 0])
  const numbersGrid = selectableNumbers.map((n) => <Number selected={state.includes(n) && n != 0} key={"selectable:" + n} num={n} onClick={() => {
    if (status > 1) return
    var flag = false;
    if (state.includes(n)) return
    const newState = state.map((v) => {
      if (v == 0 && !flag) {
        flag = true
        return n
      } else {
        return v
      }
    })
    setState(newState)
    if (newState.find((v) => v == 0) == null) {
      setStatus(1)
    } else {
      setStatus(0)
    }
  }} />)
  const selectedGroup = state.map((n, index) => <NumberColored selected={lottery.includes(n) && n != 0} key={"selected:" + index} num={n} onClick={() => {
    if (status > 1) return
    const newState = state.map((v, i) => i == index ? 0 : v)
    setState(newState)
    if (newState.find((v) => v == 0) == null) {
      setStatus(1)
    } else {
      setStatus(0)
    }
  }} />)
  const [scrolling, setScrolling] = useState(0)
  useEffect(() => {
    startScrolling(() => {
      return setScrolling(scrolling % 22 + 1)
    })
  })
  const lotteryHit = lottery.filter((v) => state.includes(v) && v != 0).length
  const isLotteryStart = lottery.filter((v) => v > 0).length >= 5
  return (
    <div className="flex flex-row">
      <div className="flex flex-col flex-1 align-center items-center">
        <p className="text-3xl font-bold mt-4">22 选 5 选号开奖器</p>
        <p className="text-xl font-bold mt-4">选号区域</p>
        <div className="grid grid-cols-8 gap-4 m-4">
          {numbersGrid}
        </div>
        <p className="text-xl font-bold mt-4">已选号码</p>
        <div className="grid grid-cols-5 gap-8 m-4">
          {selectedGroup}
        </div>
        <div className="flex flex-row gap-4">
          <button className={(status == 0 || status == 2 ? "text-gray-400" : "") + ' w-fit border-2 bg-blue rounded-full py-2 px-4 text-xl font-bold'} onClick={() => {
            if (status == 0 || status == 2) {
              return
            }
            if (status == 3) {
              setStatus(0)
              // 清除选号 和 开奖结果
              setState([0, 0, 0, 0, 0])
              setLottery([0, 0, 0, 0, 0])
              return
            }
            setStatus(2)
            setCurrntScrolling(0)
            var lottery = [0, 0, 0, 0, 0]
            setLottery(lottery)
            startLottery([], (id, value) => {
              setCurrntScrolling(id + 1)
              lottery[id] = value
              setLottery(lottery)
              if (id == 4) {
                setStatus(3)
              }
            })
          }}>
            {status == 0 ? "请选择 5 个不重复的号码" : status == 1 ? "开奖" : status == 2 ? "抽奖中" : "重新开始"}
          </button>
          <button className={(status <= 1 || status == 3 ? "" : "hidden") + ' w-fit border-2 bg-blue rounded-full py-2 px-4 text-xl font-bold'} onClick={() => {
            setLottery([0, 0, 0, 0, 0])
            var selected = [0, 0, 0, 0, 0]
            chooseForMe([], (id, value) => {
              selected[id] = value
            })
            setState(selected)
            setStatus(1)
          }}>
            帮我选
          </button>
        </div>
        {status >= 2 && (<>
          <p className="text-xl font-bold mt-4">开奖结果</p>
          <div className="grid grid-cols-5 gap-8 m-4">
            <Number key={"scrolling0"} selected={false} num={currentScrollingId == 0 ? scrolling : lottery[0]} onClick={() => { }} />
            <Number key={"scrolling1"} selected={false} num={currentScrollingId == 1 ? scrolling : lottery[1]} onClick={() => { }} />
            <Number key={"scrolling2"} selected={false} num={currentScrollingId == 2 ? scrolling : lottery[2]} onClick={() => { }} />
            <Number key={"scrolling3"} selected={false} num={currentScrollingId == 3 ? scrolling : lottery[3]} onClick={() => { }} />
            <Number key={"scrolling4"} selected={false} num={currentScrollingId == 4 ? scrolling : lottery[4]} onClick={() => { }} />
          </div>
          <div className="flex flex-col items-center" id="confetti-canvas">
            {isLotteryStart && lotteryHit >= 3 && <ConfettiExplosion particleSize={8} />}
            {isLotteryStart && lotteryHit >= 4 && <ConfettiExplosion particleSize={10} />}
            {isLotteryStart && lotteryHit >= 5 && <ConfettiExplosion particleSize={12} />}
            <p className={isLotteryStart && lotteryHit >= 3 ? "text-2xl font-bold" : "hidden"}>🎉恭喜您，选中 {lotteryHit} 个号码，获得{lotteryHit == 3 ? "二" : lotteryHit ? "一" : "特"}等奖！</p>
            <p className={isLotteryStart && lotteryHit < 3 ? "text-2xl font-bold" : "hidden"}>很遗憾，您选中了 {lotteryHit} 个号码，未能获奖</p>
          </div>
        </>)}
      </div>
    </div>
  )
}

function Number(props: { num: number, selected: boolean, onClick: () => void }) {
  return (<>
    <div
      className={"text-center justify-self-center content-center p-4 rounded-full border-2 aspect-[1] hover:bg-gray-400 hover:text-white duration-300 active:bg-gray-600 active:text-white transition" + (props.selected ? " bg-gray-400 text-white" : "")}
      onClick={props.onClick}>
      <p className={props.num <= 0 ? "invisible" : ""}>
        {props.num == 0 ? "00" : String(props.num).padStart(2, "0")}
      </p>
    </div>
  </>)
}

function NumberColored(props: { num: number, selected: boolean, onClick: () => void }) {
  return (<>
    <div
      className={"text-center justify-self-center content-center p-4 rounded-full border-2 aspect-[1] hover:text-white duration-300 active:text-white transition" + (props.selected ? " bg-blue-400 hover:bg-blue-500 active:hover:bg-blue-600 text-white" : " active:bg-gray-600 hover:bg-gray-400")}
      onClick={props.onClick}>
      <p className={props.num <= 0 ? "invisible" : ""}>
        {props.num == 0 ? "00" : String(props.num).padStart(2, "0")}
      </p>
    </div>
  </>)
}
export default App
