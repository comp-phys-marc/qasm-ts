import {
  Version,
  Include,
  ApplyGate,
  QReg,
  CReg,
  Measure,
  Pi,
  Divide,
  NNInteger,
  Barrier,
} from "../../../src/qasm2/ast";
import { OpenQASMVersion, OpenQASMMajorVersion } from "../../../src/version";

export const qftAst = [
  new Version(new OpenQASMVersion(OpenQASMMajorVersion.Version2)),
  new Include('"qelib1.inc"'),
  new QReg("q", 4),
  new CReg("c", 4),
  [new ApplyGate("x", [["q", 0]], [])],
  [new ApplyGate("x", [["q", 2]], [])],
  new Barrier("q", undefined),
  [new ApplyGate("h", [["q", 0]], [])],
  [
    new ApplyGate(
      "cu1",
      [
        ["q", 1],
        ["q", 0],
      ],
      [[[new Pi()], [new Divide()], [new NNInteger(2)]]],
    ),
  ],
  [new ApplyGate("h", [["q", 1]], [])],
  [
    new ApplyGate(
      "cu1",
      [
        ["q", 2],
        ["q", 0],
      ],
      [[[new Pi()], [new Divide()], [new NNInteger(4)]]],
    ),
  ],
  [
    new ApplyGate(
      "cu1",
      [
        ["q", 2],
        ["q", 1],
      ],
      [[[new Pi()], [new Divide()], [new NNInteger(2)]]],
    ),
  ],
  [new ApplyGate("h", [["q", 2]], [])],
  [
    new ApplyGate(
      "cu1",
      [
        ["q", 3],
        ["q", 0],
      ],
      [[[new Pi()], [new Divide()], [new NNInteger(8)]]],
    ),
  ],
  [
    new ApplyGate(
      "cu1",
      [
        ["q", 3],
        ["q", 1],
      ],
      [[[new Pi()], [new Divide()], [new NNInteger(4)]]],
    ),
  ],
  [
    new ApplyGate(
      "cu1",
      [
        ["q", 3],
        ["q", 2],
      ],
      [[[new Pi()], [new Divide()], [new NNInteger(2)]]],
    ),
  ],
  [new ApplyGate("h", [["q", 3]], [])],
  new Measure("q", "c", undefined, undefined),
];
