import {
  Version,
  Include,
  ApplyGate,
  QReg,
  CReg,
  Measure,
  Barrier,
  Gate,
} from "../../../src/qasm2/ast";
import { OpenQASMVersion, OpenQASMMajorVersion } from "../../../src/version";

export const qptAst = [
  new Version(new OpenQASMVersion(OpenQASMMajorVersion.Version2)),
  new Include('"qelib1.inc"'),
  new Gate("pre", ["q"], undefined, []),
  new Gate("post", ["q"], undefined, []),
  new QReg("q", 1),
  new CReg("c", 1),
  [new ApplyGate("pre", [["q", 0]], [])],
  new Barrier("q", undefined),
  [new ApplyGate("h", [["q", 0]], [])],
  new Barrier("q", undefined),
  [new ApplyGate("post", [["q", 0]], [])],
  new Measure("q", "c", 0, 0),
];
