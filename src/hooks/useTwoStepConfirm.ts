import { useState } from "react";

export function useTwoStepConfirm(action: () => void) {
  const [armed, setArmed] = useState(false);
  const trigger = () => {
    if (!armed) return setArmed(true);
    setArmed(false);
    action();
  };
  return { armed, trigger, cancel: () => setArmed(false) };
}
