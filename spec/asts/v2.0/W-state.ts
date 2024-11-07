import {
  Version,
  Include,
  QReg,
  CReg,
  Gate,
  ApplyGate,
  Measure,
  Real,
  NNInteger,
} from "../../../src/qasm2/ast";
import { OpenQASMVersion, OpenQASMMajorVersion } from "../../../src/version";

export const wStateAst = [
  new Version(new OpenQASMVersion(OpenQASMMajorVersion.Version2)),
  new Include('"qelib1.inc"'),
  new QReg("q", 3),
  new CReg("c", 3),
  new Gate("cH", ["a", "b"], undefined, [
    [new ApplyGate("h", [["b", undefined]], [])],
    [new ApplyGate("sdg", [["b", undefined]], [])],
    [
      new ApplyGate(
        "cx",
        [
          ["a", undefined],
          ["b", undefined],
        ],
        [],
      ),
    ],
    [new ApplyGate("h", [["b", undefined]], [])],
    [new ApplyGate("t", [["b", undefined]], [])],
    [
      new ApplyGate(
        "cx",
        [
          ["a", undefined],
          ["b", undefined],
        ],
        [],
      ),
    ],
    [new ApplyGate("t", [["b", undefined]], [])],
    [new ApplyGate("h", [["b", undefined]], [])],
    [new ApplyGate("s", [["b", undefined]], [])],
    [new ApplyGate("x", [["b", undefined]], [])],
    [new ApplyGate("s", [["a", undefined]], [])],
  ]),
  [
    new ApplyGate(
      "u3",
      [["q", 0]],
      [[[new Real(1.91063)]], [[new NNInteger(0)]], [[new NNInteger(0)]]],
    ),
  ],
  [
    new ApplyGate(
      "cH",
      [
        ["q", 0],
        ["q", 1],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "ccx",
      [
        ["q", 0],
        ["q", 1],
        ["q", 2],
      ],
      [],
    ),
  ],
  [new ApplyGate("x", [["q", 0]], [])],
  [new ApplyGate("x", [["q", 1]], [])],
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
  new Measure("q", "c", 0, 0),
  new Measure("q", "c", 1, 1),
  new Measure("q", "c", 2, 2),
];
