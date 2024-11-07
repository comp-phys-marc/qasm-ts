import {
  Version,
  Include,
  ApplyGate,
  QReg,
  CReg,
  Measure,
  Barrier,
} from "../../../src/qasm2/ast";
import { OpenQASMVersion, OpenQASMMajorVersion } from "../../../src/version";

export const rbAst = [
  new Version(new OpenQASMVersion(OpenQASMMajorVersion.Version2)),
  new Include('"qelib1.inc"'),
  new QReg("q", 2),
  new CReg("c", 2),
  [new ApplyGate("h", [["q", 0]], [])],
  new Barrier("q", undefined),
  [
    new ApplyGate(
      "cz",
      [
        ["q", 0],
        ["q", 1],
      ],
      [],
    ),
  ],
  new Barrier("q", undefined),
  [new ApplyGate("s", [["q", 0]], [])],
  [
    new ApplyGate(
      "cz",
      [
        ["q", 0],
        ["q", 1],
      ],
      [],
    ),
  ],
  new Barrier("q", undefined),
  [new ApplyGate("s", [["q", 0]], [])],
  [new ApplyGate("z", [["q", 0]], [])],
  [new ApplyGate("h", [["q", 0]], [])],
  new Barrier("q", undefined),
  new Measure("q", "c", undefined, undefined),
];
