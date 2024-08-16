import { adderTokens } from "./generic/v2.0/adder";
import { bigAdderTokens } from "./generic/v2.0/bigadder";
import { wStateTokens } from "./generic/v2.0/W-state";
import { arrayTokens } from "./generic/v3.0/arrays";

export const tokenSet = {
  "v3.0": {
    "array.qasm": arrayTokens,
  },
  "v2.0": {
    "adder.qasm": adderTokens,
    "W-state.qasm": wStateTokens,
    "bigadder.qasm": bigAdderTokens,
  },
};
