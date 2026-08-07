import { create } from "zustand";
import { persist } from "zustand/middleware";
import { scriptVersion } from "../utils/env";

localStorage.removeItem("CTYunPCKeepAlive_TICK_MAX");

interface SettingsState {
  interval: number;
  setInterval: (interval: number) => void;
  autoMission3: boolean;
  setAutoMission3: (autoMission3: boolean) => void;
  autoMission4: boolean;
  setAutoMission4: (autoMission4: boolean) => void;
}

const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      interval: 19,
      setInterval: (interval) => set({ interval }),
      autoMission3: false,
      setAutoMission3: (autoMission3) => set({ autoMission3 }),
      autoMission4: false,
      setAutoMission4: (autoMission4) => set({ autoMission4 }),
    }),
    {
      name: "CTYunPCKeepAlive_SETTINGS",
      version: Number(scriptVersion.replaceAll(".", "")),
    },
  ),
);

export default useSettings;
