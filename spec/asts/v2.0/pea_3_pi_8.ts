import {
  Version,
  Include,
  ApplyGate,
  QReg,
  CReg,
  Gate,
  Measure,
  Pi,
  Minus,
  Divide,
  Variable,
  NNInteger,
  Times,
} from "../../../src/qasm2/ast";
import { OpenQASMVersion, OpenQASMMajorVersion } from "../../../src/version";

export const pea3pi8Ast = [
  new Version(new OpenQASMVersion(OpenQASMMajorVersion.Version2)),
  new Include('"qelib1.inc"'),
  new QReg("q", 5),
  new CReg("c", 4),
  new Gate(
    "cu1fixed",
    ["c", "t"],
    ["a"],
    [
      [
        new ApplyGate(
          "u1",
          [["t", undefined]],
          [[[new Minus()], [new Variable("a")]]],
        ),
      ],
      [
        new ApplyGate(
          "cx",
          [
            ["c", undefined],
            ["t", undefined],
          ],
          [],
        ),
      ],
      [new ApplyGate("u1", [["t", undefined]], [[[new Variable("a")]]])],
      [
        new ApplyGate(
          "cx",
          [
            ["c", undefined],
            ["t", undefined],
          ],
          [],
        ),
      ],
    ],
  ),
  new Gate(
    "cu",
    ["c", "t"],
    undefined,
    [
      [
        new ApplyGate(
          "cu1fixed",
          [
            ["c", undefined],
            ["t", undefined],
          ],
          [
            [
              [new NNInteger(3)],
              [new Times()],
              [new Pi()],
              [new Divide()],
              [new NNInteger(8)],
            ],
          ],
        ),
      ],
    ],
  ),
  [new ApplyGate("h", [["q", 0]], [])],
  [new ApplyGate("h", [["q", 1]], [])],
  [new ApplyGate("h", [["q", 2]], [])],
  [new ApplyGate("h", [["q", 3]], [])],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 3],
        ["q", 4],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 2],
        ["q", 4],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 2],
        ["q", 4],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 1],
        ["q", 4],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 1],
        ["q", 4],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 1],
        ["q", 4],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 1],
        ["q", 4],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 4],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 4],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 4],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 4],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 4],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 4],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 4],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 4],
      ],
      [],
    ),
  ],
  [new ApplyGate("h", [["q", 0]], [])],
  [
    new ApplyGate(
      "cu1",
      [
        ["q", 0],
        ["q", 1],
      ],
      [[[new Minus()], [new Pi()], [new Divide()], [new NNInteger(2)]]],
    ),
  ],
  [new ApplyGate("h", [["q", 1]], [])],
  [
    new ApplyGate(
      "cu1",
      [
        ["q", 0],
        ["q", 2],
      ],
      [[[new Minus()], [new Pi()], [new Divide()], [new NNInteger(4)]]],
    ),
  ],
  [
    new ApplyGate(
      "cu1",
      [
        ["q", 1],
        ["q", 2],
      ],
      [[[new Minus()], [new Pi()], [new Divide()], [new NNInteger(2)]]],
    ),
  ],
  [new ApplyGate("h", [["q", 2]], [])],
  [
    new ApplyGate(
      "cu1",
      [
        ["q", 0],
        ["q", 3],
      ],
      [[[new Minus()], [new Pi()], [new Divide()], [new NNInteger(8)]]],
    ),
  ],
  [
    new ApplyGate(
      "cu1",
      [
        ["q", 1],
        ["q", 3],
      ],
      [[[new Minus()], [new Pi()], [new Divide()], [new NNInteger(4)]]],
    ),
  ],
  [
    new ApplyGate(
      "cu1",
      [
        ["q", 2],
        ["q", 3],
      ],
      [[[new Minus()], [new Pi()], [new Divide()], [new NNInteger(2)]]],
    ),
  ],
  [new ApplyGate("h", [["q", 3]], [])],
  new Measure("q", "c", 0, 0),
  new Measure("q", "c", 1, 1),
  new Measure("q", "c", 2, 2),
  new Measure("q", "c", 3, 3),
];
