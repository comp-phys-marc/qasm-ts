import {
  Version,
  Include,
  ApplyGate,
  QReg,
  CReg,
  Gate,
  Measure,
  If,
  Pi,
  Minus,
  Divide,
  Variable,
  NNInteger,
  Times,
} from "../../../src/qasm2/ast";
import { OpenQASMVersion, OpenQASMMajorVersion } from "../../../src/version";

export const ipea3pi8Ast = [
  new Version(new OpenQASMVersion(OpenQASMMajorVersion.Version2)),
  new Include('"qelib1.inc"'),
  new QReg("q", 2),
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
  new Gate("cu", ["c", "t"], undefined, [
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
  ]),
  [new ApplyGate("h", [["q", 0]], [])],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 1],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 1],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 1],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 1],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 1],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 1],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 1],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 1],
      ],
      [],
    ),
  ],
  [new ApplyGate("h", [["q", 0]], [])],
  new Measure("q", "c", 0, 0),
  [new ApplyGate("reset", [["q", 0]], [])],
  [new ApplyGate("h", [["q", 0]], [])],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 1],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 1],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 1],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 1],
      ],
      [],
    ),
  ],
  new If("c", 1, [
    [
      new ApplyGate(
        "u1",
        [["q", 0]],
        [[[new Minus()], [new Pi()], [new Divide()], [new NNInteger(2)]]],
      ),
    ],
  ]),
  [new ApplyGate("h", [["q", 0]], [])],
  new Measure("q", "c", 0, 1),
  [new ApplyGate("reset", [["q", 0]], [])],
  [new ApplyGate("h", [["q", 0]], [])],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 1],
      ],
      [],
    ),
  ],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 1],
      ],
      [],
    ),
  ],
  new If("c", 1, [
    [
      new ApplyGate(
        "u1",
        [["q", 0]],
        [[[new Minus()], [new Pi()], [new Divide()], [new NNInteger(4)]]],
      ),
    ],
  ]),
  new If("c", 2, [
    [
      new ApplyGate(
        "u1",
        [["q", 0]],
        [[[new Minus()], [new Pi()], [new Divide()], [new NNInteger(2)]]],
      ),
    ],
  ]),
  new If("c", 3, [
    [
      new ApplyGate(
        "u1",
        [["q", 0]],
        [
          [
            [new Minus()],
            [new NNInteger(3)],
            [new Times()],
            [new Pi()],
            [new Divide()],
            [new NNInteger(4)],
          ],
        ],
      ),
    ],
  ]),
  [new ApplyGate("h", [["q", 0]], [])],
  new Measure("q", "c", 0, 2),
  [new ApplyGate("reset", [["q", 0]], [])],
  [new ApplyGate("h", [["q", 0]], [])],
  [
    new ApplyGate(
      "cu",
      [
        ["q", 0],
        ["q", 1],
      ],
      [],
    ),
  ],
  new If("c", 1, [
    [
      new ApplyGate(
        "u1",
        [["q", 0]],
        [[[new Minus()], [new Pi()], [new Divide()], [new NNInteger(8)]]],
      ),
    ],
  ]),
  new If("c", 2, [
    [
      new ApplyGate(
        "u1",
        [["q", 0]],
        [
          [
            [new Minus()],
            [new NNInteger(2)],
            [new Times()],
            [new Pi()],
            [new Divide()],
            [new NNInteger(8)],
          ],
        ],
      ),
    ],
  ]),
  new If("c", 3, [
    [
      new ApplyGate(
        "u1",
        [["q", 0]],
        [
          [
            [new Minus()],
            [new NNInteger(3)],
            [new Times()],
            [new Pi()],
            [new Divide()],
            [new NNInteger(8)],
          ],
        ],
      ),
    ],
  ]),
  new If("c", 4, [
    [
      new ApplyGate(
        "u1",
        [["q", 0]],
        [
          [
            [new Minus()],
            [new NNInteger(4)],
            [new Times()],
            [new Pi()],
            [new Divide()],
            [new NNInteger(8)],
          ],
        ],
      ),
    ],
  ]),
  new If("c", 5, [
    [
      new ApplyGate(
        "u1",
        [["q", 0]],
        [
          [
            [new Minus()],
            [new NNInteger(5)],
            [new Times()],
            [new Pi()],
            [new Divide()],
            [new NNInteger(8)],
          ],
        ],
      ),
    ],
  ]),
  new If("c", 6, [
    [
      new ApplyGate(
        "u1",
        [["q", 0]],
        [
          [
            [new Minus()],
            [new NNInteger(6)],
            [new Times()],
            [new Pi()],
            [new Divide()],
            [new NNInteger(8)],
          ],
        ],
      ),
    ],
  ]),
  new If("c", 7, [
    [
      new ApplyGate(
        "u1",
        [["q", 0]],
        [
          [
            [new Minus()],
            [new NNInteger(7)],
            [new Times()],
            [new Pi()],
            [new Divide()],
            [new NNInteger(8)],
          ],
        ],
      ),
    ],
  ]),
  [new ApplyGate("h", [["q", 0]], [])],
  new Measure("q", "c", 0, 3),
];
