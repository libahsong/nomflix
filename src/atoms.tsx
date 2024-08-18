import { atom } from "recoil";

export const categoryState = atom<string>({
  key: "category",
  default: "",
});

export const paramIdState = atom<number>({
  key: "paramId",
  default: 0,
});
