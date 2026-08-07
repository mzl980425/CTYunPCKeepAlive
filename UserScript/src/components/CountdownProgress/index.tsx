import { FC, useEffect, useState } from "react";
import { Progress } from "antd";
import { useInterval, useLatest, useUpdateEffect } from "ahooks";
import useLog from "../../hooks/useLog";
import "./index.less";

interface ICountdownProgressProps {
  /** 倒计时，单位：分钟 */
  interval: number;

  /** 倒计时结束时触发 */
  onEnd: () => void | Promise<void>;
}

const CountdownProgress: FC<ICountdownProgressProps> = ({ interval, onEnd }) => {
  const addLog = useLog((state) => state.addLog);
  const [disabled, setDisabled] = useState(false);
  const [percent, setPercent] = useState(0);
  const percentRef = useLatest(percent);

  useUpdateEffect(() => {
    addLog("续命间隔改为" + interval + "分钟，计时器清零");
    const nextPercent = 0;
    addLog("计时器进度：" + nextPercent + "%");
    setPercent(nextPercent);
  }, [interval]);

  useInterval(
    async () => {
      const nextPercent = percentRef.current + 1;
      addLog("计时器进度：" + nextPercent + "%");
      setPercent(nextPercent);
      if (nextPercent >= 100) {
        setDisabled(true);
        try {
          await onEnd?.();
        } finally {
          setPercent(0);
          setDisabled(false);
        }
      }
    },
    disabled ? undefined : (interval / 100) * 60 * 1000
  );

  return (
    <Progress className="countdown-progress" status="active" strokeLinecap="butt" showInfo={false} percent={percent} />
  );
};

export default CountdownProgress;
