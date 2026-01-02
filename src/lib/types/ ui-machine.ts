export type UIMachine = {
  id: string;
  status: "ACTIVE" | "IDLE" | "BREAKDOWN" | "OFFLINE";
  speed: number;
  updated: string;
};