import { wStateTokens } from "./generic/v2.0/W-state";
import { adderTokens as adderTokens2 } from "./generic/v2.0/adder";
import { bigAdderTokens } from "./generic/v2.0/bigadder";
import { inverseQft1Tokens as inverseQft1Tokens2 } from "./generic/v2.0/inverseqft1";
import { inverseQft2Tokens as inverseQft2Tokens2 } from "./generic/v2.0/inverseqft2";
import { ipea3Pi8Tokens } from "./generic/v2.0/ipea_3_pi_8";
import { pea3Pi8Tokens } from "./generic/v2.0/pea_3_pi_8";
import { qecTokens as qecTokens2 } from "./generic/v2.0/qec";
import { qftTokens as qftTokens2 } from "./generic/v2.0/qft";
import { qptTokens as qptTokens2 } from "./generic/v2.0/qpt";
import { rbTokens as rbTokens2 } from "./generic/v2.0/rb";
import { teleportTokens as teleportTokens2 } from "./generic/v2.0/teleport";
import { teleport2Tokens } from "./generic/v2.0/teleportv2";
import { adderTokens as adderTokens3 } from "./generic/v3.0/adder";
import { alignmentTokens } from "./generic/v3.0/alignment";
import { arrayTokens } from "./generic/v3.0/arrays";
import { cPhaseTokens } from "./generic/v3.0/cphase";
import { ddTokens } from "./generic/v3.0/dd";
import { gateTeleportTokens } from "./generic/v3.0/gateteleport";
import { inverseQft1Tokens as inverseQft1Tokens3 } from "./generic/v3.0/inverseqft1";
import { inverseQft2Tokens as inverseQft2Tokens3 } from "./generic/v3.0/inverseqft2";
import { ipeTokens } from "./generic/v3.0/ipe";
import { msdTokens } from "./generic/v3.0/msd";
import { qecTokens as qecTokens3 } from "./generic/v3.0/qec";
import { qftTokens as qftTokens3 } from "./generic/v3.0/qft";
import { qptTokens as qptTokens3 } from "./generic/v3.0/qpt";
import { rbTokens as rbTokens3 } from "./generic/v3.0/rb";
import { rusTokens } from "./generic/v3.0/rus";
import { scqecTokens } from "./generic/v3.0/scqec";
import { teleportTokens as teleportTokens3 } from "./generic/v3.0/teleport";
import { varTeleportTokens } from "./generic/v3.0/varteleport";

export const tokenSet = {
  "v3.0": {
    "adder.qasm": adderTokens3,
    "alignment.qasm": alignmentTokens,
    "arrays.qasm": arrayTokens,
    "cphase.qasm": cPhaseTokens,
    "dd.qasm": ddTokens,
    "gateteleport.qasm": gateTeleportTokens,
    "inverseqft1.qasm": inverseQft1Tokens3,
    "inverseqft2.qasm": inverseQft2Tokens3,
    "ipe.qasm": ipeTokens,
    "msd.qasm": msdTokens,
    "qec.qasm": qecTokens3,
    "qft.qasm": qftTokens3,
    "qpt.qasm": qptTokens3,
    "rb.qasm": rbTokens3,
    "rus.qasm": rusTokens,
    "scqec.qasm": scqecTokens,
    "teleport.qasm": teleportTokens3,
    "varteleport.qasm": varTeleportTokens,
  },
  "v2.0": {
    "W-state.qasm": wStateTokens,
    "adder.qasm": adderTokens2,
    "bigadder.qasm": bigAdderTokens,
    "inverseqft1.qasm": inverseQft1Tokens2,
    "inverseqft2.qasm": inverseQft2Tokens2,
    "ipea_3_pi_8.qasm": ipea3Pi8Tokens,
    "pea_3_pi_8.qasm": pea3Pi8Tokens,
    "qec.qasm": qecTokens2,
    "qft.qasm": qftTokens2,
    "qpt.qasm": qptTokens2,
    "rb.qasm": rbTokens2,
    "teleport.qasm": teleportTokens2,
    "teleportv2.qasm": teleport2Tokens,
  },
};
