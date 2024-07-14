import { atom } from "recoil";

type Plan = "광고형" | "스탠다드" | "프리미엄";

export const selectedPlanState = atom<Plan>({
  key: "selectedPlanState",
  default: "프리미엄", // Default selected plan
});

export const priceState = atom({
  key: "priceState",
  default: 17000, // Default price for the premium plan
});
