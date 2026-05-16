import { atom } from "recoil";

export const categoryState = atom<string>({
  key: "category",
  default: "",
});

export const paramIdState = atom<number>({
  key: "paramId",
  default: 0,
});

export const overlayClickedState = atom<boolean>({
  key: "overlay",
  default: false,
});

export const hoverState = atom<boolean>({ key: "hover", default: false });
