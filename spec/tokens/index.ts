import { wStateTokens } from "./generic/v2.0/W-state";
import { adderTokens } from "./generic/v3.0/adder";

export const tokenSet = {
  "v3.0": {
    "adder.qasm": adderTokens,
  },
  "v2.0": {
    "W-state.qasm": wStateTokens,
  },
};
