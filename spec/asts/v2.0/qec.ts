import {
  Version,
  Include,
  ApplyGate,
  QReg,
  CReg,
  Gate,
  Barrier,
  Measure,
  If,
} from "../../../src/qasm2/ast";
import { OpenQASMVersion, OpenQASMMajorVersion } from "../../../src/version";

export const qecAst = [
  new Version(new OpenQASMVersion(OpenQASMMajorVersion.Version2)),
  new Include('"qelib1.inc"'),
  new QReg("q", 3),
  new QReg("a", 2),
  new CReg("c", 3),
  new CReg("syn", 2),
  new Gate("syndrome", ["d1", "d2", "d3", "a1", "a2"], undefined, [
    [
      new ApplyGate(
        "cx",
        [
          ["d1", undefined],
          ["a1", undefined],
        ],
        [],
      ),
    ],
    [
      new ApplyGate(
        "cx",
        [
          ["d2", undefined],
          ["a1", undefined],
        ],
        [],
      ),
    ],
    [
      new ApplyGate(
        "cx",
        [
          ["d2", undefined],
          ["a2", undefined],
        ],
        [],
      ),
    ],
    [
      new ApplyGate(
        "cx",
        [
          ["d3", undefined],
          ["a2", undefined],
        ],
        [],
      ),
    ],
  ]),
  [new ApplyGate("x", [["q", 0]], [])],
  new Barrier("q", undefined),
  [
    new ApplyGate(
      "syndrome",
      [
        ["q", 0],
        ["q", 1],
        ["q", 2],
        ["a", 0],
        ["a", 1],
      ],
      [],
    ),
  ],
  new Measure("a", "syn", undefined, undefined),
  new If("syn", 1, [[new ApplyGate("x", [["q", 0]], [])]]),
  new If("syn", 2, [[new ApplyGate("x", [["q", 2]], [])]]),
  new If("syn", 3, [[new ApplyGate("x", [["q", 1]], [])]]),
  new Measure("q", "c", undefined, undefined),
];
