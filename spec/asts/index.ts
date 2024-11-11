import { adderAst as adderAst2 } from "./v2.0/adder";
import { wStateAst } from "./v2.0/W-state";
import { bigAdderAst } from "./v2.0/bigadder";
import { inverseqft1Ast as inverseqft1Ast2 } from "./v2.0/inverseqft1";
import { inverseqft2Ast as inverseqft2Ast2 } from "./v2.0/inverseqft2";
import { ipea3pi8Ast } from "./v2.0/ipea_3_pi_8";
import { pea3pi8Ast } from "./v2.0/pea_3_pi_8";
import { qecAst as qecAst2 } from "./v2.0/qec";
import { qftAst as qftAst2 } from "./v2.0/qft";
import { qptAst as qptAst2 } from "./v2.0/qpt";
import { rbAst as rbAst2 } from "./v2.0/rb";
import { teleportAst as teleportAst2 } from "./v2.0/teleport";
import { teleportv2Ast } from "./v2.0/teleportv2";
import { adderAst as adderAst3 } from "./v3.0/adder";
import { alignmentAst } from "./v3.0/alignment";
import { arraysAst } from "./v3.0/arrays";
import { cphaseAst } from "./v3.0/cphase";
import { ddAst } from "./v3.0/dd";
import { gateteleportAst } from "./v3.0/gateteleport";
import { inverseqft1Ast as inverseqft1Ast3 } from "./v3.0/inverseqft1";
import { inverseqft2Ast as inverseqft2Ast3 } from "./v3.0/inverseqft2";
import { ipeAst } from "./v3.0/ipe";
import { msdAst } from "./v3.0/msd";
import { qecAst as qecAst3 } from "./v3.0/qec";
import { qftAst as qftAst3 } from "./v3.0/qft";
import { qptAst as qptAst3 } from "./v3.0/qpt";
import { rbAst as rbAst3 } from "./v3.0/rb";
import { rusAst } from "./v3.0/rus";
import { scqecAst } from "./v3.0/scqec";
import { teleportAst as teleportAst3 } from "./v3.0/teleport";
import { varteleportAst } from "./v3.0/varteleport";

export const astSet = {
  "v2.0": {
    "adder.ts": adderAst2,
    "W-state.ts": wStateAst,
    "bigadder.ts": bigAdderAst,
    "inverseqft1.ts": inverseqft1Ast2,
    "inverseqft2.ts": inverseqft2Ast2,
    "ipea_3_pi_8.ts": ipea3pi8Ast,
    "pea_3_pi_8.ts": pea3pi8Ast,
    "qec.ts": qecAst2,
    "qft.ts": qftAst2,
    "qpt.ts": qptAst2,
    "rb.ts": rbAst2,
    "teleport.ts": teleportAst2,
    "teleportv2.ts": teleportv2Ast,
  },
  "v3.0": {
    "adder.ts": adderAst3,
    "alignment.ts": alignmentAst,
    "arrays.ts": arraysAst,
    "cphase.ts": cphaseAst,
    "dd.ts": ddAst,
    "gateteleport.ts": gateteleportAst,
    "inverseqft1.ts": inverseqft1Ast3,
    "inverseqft2.ts": inverseqft2Ast3,
    "ipe.ts": ipeAst,
    "msd.ts": msdAst,
    "qec.ts": qecAst3,
    "qft.ts": qftAst3,
    "qpt.ts": qptAst3,
    "rb.ts": rbAst3,
    "rus.ts": rusAst,
    "scqec.ts": scqecAst,
    "teleport.ts": teleportAst3,
    "varteleport.ts": varteleportAst,
  },
};
