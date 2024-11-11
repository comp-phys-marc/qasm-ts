import {
  Version,
  Include,
  ApplyGate,
  QReg,
  CReg,
  Measure,
  Barrier,
  If,
  Pi,
  Divide,
  NNInteger,
} from "../../../src/qasm2/ast";
import { OpenQASMVersion, OpenQASMMajorVersion } from "../../../src/version";

export const inverseqft2Ast = [
  new Version(new OpenQASMVersion(OpenQASMMajorVersion.Version2)),
  new Include('"qelib1.inc"'),
  new QReg("q", 4),
  new CReg("c0", 1),
  new CReg("c1", 1),
  new CReg("c2", 1),
  new CReg("c3", 1),
  [new ApplyGate("h", [["q", undefined]], [])],
  new Barrier("q", undefined),
  [new ApplyGate("h", [["q", 0]], [])],
  new Measure("q", "c0", 0, 0),
  new If("c0", 1, [
    [
      new ApplyGate(
        "u1",
        [["q", 1]],
        [[[new Pi()], [new Divide()], [new NNInteger(2)]]],
      ),
    ],
  ]),
  [new ApplyGate("h", [["q", 1]], [])],
  new Measure("q", "c1", 1, 0),
  new If("c0", 1, [
    [
      new ApplyGate(
        "u1",
        [["q", 2]],
        [[[new Pi()], [new Divide()], [new NNInteger(4)]]],
      ),
    ],
  ]),
  new If("c1", 1, [
    [
      new ApplyGate(
        "u1",
        [["q", 2]],
        [[[new Pi()], [new Divide()], [new NNInteger(2)]]],
      ),
    ],
  ]),
  [new ApplyGate("h", [["q", 2]], [])],
  new Measure("q", "c2", 2, 0),
  new If("c0", 1, [
    [
      new ApplyGate(
        "u1",
        [["q", 3]],
        [[[new Pi()], [new Divide()], [new NNInteger(8)]]],
      ),
    ],
  ]),
  new If("c1", 1, [
    [
      new ApplyGate(
        "u1",
        [["q", 3]],
        [[[new Pi()], [new Divide()], [new NNInteger(4)]]],
      ),
    ],
  ]),
  new If("c2", 1, [
    [
      new ApplyGate(
        "u1",
        [["q", 3]],
        [
          [
            [new Pi()],
            [new Divide()],
            [new NNInteger(2)],
          ],
        ],
      ),
    ],
  ]),
  [new ApplyGate("h", [["q", 3]], [])],
  new Measure("q", "c3", 3, 0),
];
