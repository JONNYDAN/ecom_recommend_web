import { localeItems } from "@/config/localeConfig";
import useLocale from "@/hooks/useLocale";
import clsx from "clsx";
import React, {
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  memo,
  forwardRef,
} from "react";
import { MdOutlineTimer } from "react-icons/md";

function Timer(
  {
    className = "",
    duration = 0,
    forceStop = false,
    showTimeOnly = false,
    concise = false,
    timeUpContent,
    onStart = () => {},
    onFinish = () => {},
  },
  ref
) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());

  const { t: tQuestion } = useLocale(localeItems.quizQuestion);

  useImperativeHandle(ref, () => ({
    getTotalTime: () => duration - timeLeft,
    resetTimer: () => {
      setTimeLeft(duration);
      setTimerStarted(false);
      setStartTime(Date.now());
    }
  }));

  const stopTimer = useCallback(() => {
    clearInterval(timerInterval);
    setTimerInterval(null);
    onFinish(duration - timeLeft);
  }, [duration, onFinish, timeLeft, timerInterval]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
      if (!timerStarted) {
        onStart();
        setTimerStarted(true);
      }
    }, 1000);

    setTimerInterval(timerId);

    return () => {
      clearInterval(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 || forceStop) {
      stopTimer();
    }
  }, [forceStop, stopTimer, timeLeft]);

  const getColor = () => {
    if (timeLeft < 60) {
      return "text-danger";
    }
    if (timeLeft < 60 * 5) {
      return "text-warning";
    }
    return "text-success";
  };

  // Tính giờ, phút, giây
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  // Thêm hàm format cho đẹp
  const formatTime = (val) => (val < 10 ? `0${val}` : val);

  // UI hiển thị "HH : MM : SS"
  // Trường hợp concise = true mà < 1 giờ, bạn có thể tự điều chỉnh
  const displayHours = formatTime(hours);
  const displayMinutes = formatTime(minutes);
  const displaySeconds = formatTime(seconds);

  if (timeLeft <= 0 && timeUpContent) {
    return <span className={className}>{timeUpContent}</span>;
  }

  if (showTimeOnly) {
    // Nếu chỉ muốn hiển thị mỗi thời gian (không có icon, text "Time left", v.v.)
    return (
      <span className={className}>
        {displayHours}:{displayMinutes}:{displaySeconds}
      </span>
    );
  }

  return (
    <div
      className={clsx(
        "d-flex flex-column align-items-center justify-content-center p-3",
        className
      )}
      style={{
        borderRadius: "8px",
        width: "fit-content",
      }}
    >
      <div className="fw-bold mb-2" style={{ fontSize: "16px", fontWeight: "bold" }}>
        {tQuestion("time_left")}
      </div>
      {/* Dòng dưới đây: 3 ô cho giờ : phút : giây */}
      <div className="d-flex align-items-center">
        {/* Box Hours */}
        <div className="d-flex flex-column align-items-center justify-content-center mx-1">
          <div
            className={clsx(
              "d-flex flex-column align-items-center justify-content-center mx-1",
              getColor()
            )}
            style={{
              backgroundColor: "#00B14F",
              borderRadius: "6px",
              width: "50px",
              height: "50px",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}>
              {displayHours}
            </div>
          </div>
          <div style={{ fontSize: "13px" }}>Giờ</div>
        </div>

        <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: '1.5rem' }}>:</div>

        {/* Box Minutes */}
        <div className="d-flex flex-column align-items-center justify-content-center mx-1">

          <div
            className={clsx(
              "d-flex flex-column align-items-center justify-content-center mx-1",
              getColor()
            )}
            style={{
              backgroundColor: "#00B14F",
              borderRadius: "6px",
              width: "50px",
              height: "50px",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: "bold" , color: "white"}}>
              {displayMinutes}
            </div>
          </div>
          <div style={{ fontSize: "13px" }}>Phút</div>
        </div>

        <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: '1.5rem' }}>:</div>

        {/* Box Seconds */}
        <div className="d-flex flex-column align-items-center justify-content-center mx-1">

          <div
            className={clsx(
              "d-flex flex-column align-items-center justify-content-center mx-1",
              getColor()
            )}
            style={{
              backgroundColor: "#00B14F",
              borderRadius: "6px",
              width: "50px",
              height: "50px",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: "bold" , color: "white"}}>
              {displaySeconds}
            </div>
          </div>
          <div style={{ fontSize: "13px" }}>Giây</div>
        </div>

      </div>
    </div>
  );
}

export default memo(forwardRef(Timer));