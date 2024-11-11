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

export const adderAst = [
  new Version(new OpenQASMVersion(OpenQASMMajorVersion.Version2)),
  new Include("\"qelib1.inc\""),
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
  new QReg("cin", 1),
  new QReg("a", 4),
  new QReg("b", 4),
  new QReg("cout", 1),
  new CReg("ans", 5),
  [new ApplyGate("x", [["a", 0]], [])],
  [new ApplyGate("x", [["b", undefined]], [])],
  [
    new ApplyGate(
      "majority",
      [
        ["cin", 0],
        ["b", 0],
        ["a", 0],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "majority",
      [
        ["a", 0],
        ["b", 1],
        ["a", 1],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "majority",
      [
        ["a", 1],
        ["b", 2],
        ["a", 2],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "majority",
      [
        ["a", 2],
        ["b", 3],
        ["a", 3],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cx",
      [
        ["a", 3],
        ["cout", 0],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "unmaj",
      [
        ["a", 2],
        ["b", 3],
        ["a", 3],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "unmaj",
      [
        ["a", 1],
        ["b", 2],
        ["a", 2],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "unmaj",
      [
        ["a", 0],
        ["b", 1],
        ["a", 1],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "unmaj",
      [
        ["cin", 0],
        ["b", 0],
        ["a", 0],
      ],
      [],
    ),
  ],
  new Measure("b", "ans", 0, 0),
  new Measure("b", "ans", 1, 1),
  new Measure("b", "ans", 2, 2),
  new Measure("b", "ans", 3, 3),
  new Measure("cout", "ans", 0, 4),
];
