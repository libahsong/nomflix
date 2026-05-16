import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    red: string;
    black: {
      veryDark: string;
      darker: string;
      lighter: string;
    };
    white: {
      darker: string;
      lighter: string;
    };
    rating: {
      g: string;
      pg: string;
      pg13: string;
      r: string;
      nc17: string;
      nr: string;
    };
    tvRating: {
      tvma: string;
      tv14: string;
      tvpg: string;
      tvg: string;
      tvy7: string;
      tvy7fv: string;
      tvy: string;
      nr: string;
    };
  }
}
