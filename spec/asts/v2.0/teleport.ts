import {
  Version,
  Include,
  ApplyGate,
  QReg,
  CReg,
  Measure,
  Barrier,
  Gate,
  Real,
  If,
} from "../../../src/qasm2/ast";
import { OpenQASMVersion, OpenQASMMajorVersion } from "../../../src/version";

export const teleportAst = [
  new Version(new OpenQASMVersion(OpenQASMMajorVersion.Version2)),
  new Include('"qelib1.inc"'),
  new QReg("q", 3),
  new CReg("c0", 1),
  new CReg("c1", 1),
  new CReg("c2", 1),
  new Gate("post", ["q"], undefined, []),
  [
    new ApplyGate(
      "u3",
      [["q", 0]],
      [[[new Real(0.3)]], [[new Real(0.2)]], [[new Real(0.1)]]],
    ),
  ],
  [new ApplyGate("h", [["q", 1]], [])],
  [
    new ApplyGate(
      "cx",
      [
        ["q", 1],
        ["q", 2],
      ],
      [],
    ),
  ],
  new Barrier("q", undefined),
  [
    new ApplyGate(
      "cx",
      [
        ["q", 0],
        ["q", 1],
      ],
      [],
    ),
  ],
  [new ApplyGate("h", [["q", 0]], [])],
  new Measure("q", "c0", 0, 0),
  new Measure("q", "c1", 1, 0),
  new If("c0", 1, [[new ApplyGate("z", [["q", 2]], [])]]),
  new If("c1", 1, [[new ApplyGate("x", [["q", 2]], [])]]),
  [new ApplyGate("post", [["q", 2]], [])],
  new Measure("q", "c2", 2, 0),
];
