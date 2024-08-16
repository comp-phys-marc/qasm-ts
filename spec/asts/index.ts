import { adderAST } from "./generic/v2.0/adder";
import { bigAdderAST } from "./generic/v2.0/bigadder";
import { wStateAST } from "./generic/v2.0/W-state";

// TODO : add v3.0 ASTs
export const astSet = {
  "v2.0": {
    "adder.ts": adderAST,
    "W-state.ts": wStateAST,
    "bigadder.ts": bigAdderAST,
  },
};
