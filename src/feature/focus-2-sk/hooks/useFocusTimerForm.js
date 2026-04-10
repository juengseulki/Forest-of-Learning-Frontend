import { useMemo, useState } from 'react';

function useFocusTimerForm() {
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');
  const [isEditing, setIsEditing] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const handleMinutesChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
    setMinutes(value);
  };

  const handleSecondsChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2);

    if (Number(value) > 59) {
      setSeconds('59');
      return;
    }

    setSeconds(value);
  };

  const handleBlurMinutes = () => {
    setMinutes((prev) => String(Number(prev || 0)).padStart(2, '0'));
  };

  const handleBlurSeconds = () => {
    setSeconds((prev) => {
      const safe = Math.min(Number(prev || 0), 59);
      return String(safe).padStart(2, '0');
    });
  };

  const totalSeconds = useMemo(() => {
    return Number(minutes || 0) * 60 + Number(seconds || 0);
  }, [minutes, seconds]);

  const handleStart = () => {
    if (totalSeconds === 0) return;
    setIsEditing(false);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsEditing(true);
    setIsRunning(false);

    setMinutes((prev) => String(Number(prev || 0)).padStart(2, '0'));
    setSeconds((prev) => {
      const safe = Math.min(Number(prev || 0), 59);
      return String(safe).padStart(2, '0');
    });
  };

  return {
    minutes,
    seconds,
    isEditing,
    isRunning,
    totalSeconds,
    handleMinutesChange,
    handleSecondsChange,
    handleBlurMinutes,
    handleBlurSeconds,
    handleStart,
    handleStop,
  };
}

export default useFocusTimerForm;
