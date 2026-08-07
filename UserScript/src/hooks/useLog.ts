import { create } from "zustand";

interface LogState {
  logs: string[];
  addLog: (...args: any[]) => void;
}

const useLog = create<LogState>()((set) => ({
  logs: [],
  addLog: (...args) => {
    console.log(new Date().toLocaleTimeString(), ...args);
    set((state) => ({
      logs: [new Date().toLocaleTimeString() + "\t" + args.join(" "), ...state.logs].slice(0, 1000),
    }));
  },
}));

export default useLog;
