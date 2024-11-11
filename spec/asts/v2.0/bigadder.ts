import {
  Version,
  Include,
  Gate,
  ApplyGate,
  QReg,
  CReg,
  Measure,
} from "../../../src/qasm2/ast";
import { OpenQASMVersion, OpenQASMMajorVersion } from "../../../src/version";

export const bigAdderAst = [
  new Version(new OpenQASMVersion(OpenQASMMajorVersion.Version2)),
  new Include('"qelib1.inc"'),
  new Gate("majority", ["a", "b", "c"], undefined, [
    [
      new ApplyGate(
        "cx",
        [
          ["c", undefined],
          ["b", undefined],
        ],
        [],
      ),
    ],
    [
      new ApplyGate(
        "cx",
        [
          ["c", undefined],
          ["a", undefined],
        ],
        [],
      ),
    ],
    [
      new ApplyGate(
        "ccx",
        [
          ["a", undefined],
          ["b", undefined],
          ["c", undefined],
        ],
        [],
      ),
    ],
  ]),
  new Gate("unmaj", ["a", "b", "c"], undefined, [
    [
      new ApplyGate(
        "ccx",
        [
          ["a", undefined],
          ["b", undefined],
          ["c", undefined],
        ],
        [],
      ),
    ],
    [
      new ApplyGate(
        "cx",
        [
          ["c", undefined],
          ["a", undefined],
        ],
        [],
      ),
    ],
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
  ]),
  new Gate(
    "add4",
    ["a0", "a1", "a2", "a3", "b0", "b1", "b2", "b3", "cin", "cout"],
    undefined,
    [
      [
        new ApplyGate(
          "majority",
          [
            ["cin", undefined],
            ["b0", undefined],
            ["a0", undefined],
          ],
          [],
        ),
      ],
      [
        new ApplyGate(
          "majority",
          [
            ["a0", undefined],
            ["b1", undefined],
            ["a1", undefined],
          ],
          [],
        ),
      ],
      [
        new ApplyGate(
          "majority",
          [
            ["a1", undefined],
            ["b2", undefined],
            ["a2", undefined],
          ],
          [],
        ),
      ],
      [
        new ApplyGate(
          "majority",
          [
            ["a2", undefined],
            ["b3", undefined],
            ["a3", undefined],
          ],
          [],
        ),
      ],
      [
        new ApplyGate(
          "cx",
          [
            ["a3", undefined],
            ["cout", undefined],
          ],
          [],
        ),
      ],
      [
        new ApplyGate(
          "unmaj",
          [
            ["a2", undefined],
            ["b3", undefined],
            ["a3", undefined],
          ],
          [],
        ),
      ],
      [
        new ApplyGate(
          "unmaj",
          [
            ["a1", undefined],
            ["b2", undefined],
            ["a2", undefined],
          ],
          [],
        ),
      ],
      [
        new ApplyGate(
          "unmaj",
          [
            ["a0", undefined],
            ["b1", undefined],
            ["a1", undefined],
          ],
          [],
        ),
      ],
      [
        new ApplyGate(
          "unmaj",
          [
            ["cin", undefined],
            ["b0", undefined],
            ["a0", undefined],
          ],
          [],
        ),
      ],
    ],
  ),
  new QReg("carry", 2),
  new QReg("a", 8),
  new QReg("b", 8),
  new CReg("ans", 8),
  new CReg("carryout", 1),
  [new ApplyGate("x", [["a", 0]], [])],
  [new ApplyGate("x", [["b", undefined]], [])],
  [new ApplyGate("x", [["b", 6]], [])],
  [
    new ApplyGate(
      "add4",
      [
        ["a", 0],
        ["a", 1],
        ["a", 2],
        ["a", 3],
        ["b", 0],
        ["b", 1],
        ["b", 2],
        ["b", 3],
        ["carry", 0],
        ["carry", 1],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "add4",
      [
        ["a", 4],
        ["a", 5],
        ["a", 6],
        ["a", 7],
        ["b", 4],
        ["b", 5],
        ["b", 6],
        ["b", 7],
        ["carry", 1],
        ["carry", 0],
      ],
      [],
    ),
  ],
  new Measure("b", "ans", 0, 0),
  new Measure("b", "ans", 1, 1),
  new Measure("b", "ans", 2, 2),
  new Measure("b", "ans", 3, 3),
  new Measure("b", "ans", 4, 4),
  new Measure("b", "ans", 5, 5),
  new Measure("b", "ans", 6, 6),
  new Measure("b", "ans", 7, 7),
  new Measure("carry", "carryout", 0, 0),
];
