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
  Plus,
  NNInteger,
} from "../../../src/qasm2/ast";
import { OpenQASMVersion, OpenQASMMajorVersion } from "../../../src/version";

export const inverseqft1Ast = [
  new Version(new OpenQASMVersion(OpenQASMMajorVersion.Version2)),
  new Include('"qelib1.inc"'),
  new QReg("q", 4),
  new CReg("c", 4),
  [new ApplyGate("h", [["q", undefined]], [])],
  new Barrier("q", null),
  [new ApplyGate("h", [["q", 0]], [])],
  new Measure("q", "c", 0, 0),
  new If("c", 1, [
    [
      new ApplyGate(
        "u1",
        [["q", 1]],
        [[[new Pi()], [new Divide()], [new NNInteger(2)]]],
      ),
    ],
  ]),
  [new ApplyGate("h", [["q", 1]], [])],
  new Measure("q", "c", 1, 1),
  new If("c", 1, [
    [
      new ApplyGate(
        "u1",
        [["q", 2]],
        [[[new Pi()], [new Divide()], [new NNInteger(4)]]],
      ),
    ],
  ]),
  new If("c", 2, [
    [
      new ApplyGate(
        "u1",
        [["q", 2]],
        [[[new Pi()], [new Divide()], [new NNInteger(2)]]],
      ),
    ],
  ]),
  new If("c", 3, [
    [
      new ApplyGate(
        "u1",
        [["q", 2]],
        [
          [
            [new Pi()],
            [new Divide()],
            [new NNInteger(2)],
            [new Plus()],
            [new Pi()],
            [new Divide()],
            [new NNInteger(4)],
          ],
        ],
      ),
    ],
  ]),
  [new ApplyGate("h", [["q", 2]], [])],
  new Measure("q", "c", 2, 2),
  new If("c", 1, [
    [
      new ApplyGate(
        "u1",
        [["q", 3]],
        [[[new Pi()], [new Divide()], [new NNInteger(8)]]],
      ),
    ],
  ]),
  new If("c", 2, [
    [
      new ApplyGate(
        "u1",
        [["q", 3]],
        [[[new Pi()], [new Divide()], [new NNInteger(4)]]],
      ),
    ],
  ]),
  new If("c", 3, [
    [
      new ApplyGate(
        "u1",
        [["q", 3]],
        [
          [
            [new Pi()],
            [new Divide()],
            [new NNInteger(4)],
            [new Plus()],
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
        [["q", 3]],
        [[[new Pi()], [new Divide()], [new NNInteger(2)]]],
      ),
    ],
  ]),
  new If("c", 5, [
    [
      new ApplyGate(
        "u1",
        [["q", 3]],
        [
          [
            [new Pi()],
            [new Divide()],
            [new NNInteger(2)],
            [new Plus()],
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
        [["q", 3]],
        [
          [
            [new Pi()],
            [new Divide()],
            [new NNInteger(2)],
            [new Plus()],
            [new Pi()],
            [new Divide()],
            [new NNInteger(4)],
          ],
        ],
      ),
    ],
  ]),
  new If("c", 7, [
    [
      new ApplyGate(
        "u1",
        [["q", 3]],
        [
          [
            [new Pi()],
            [new Divide()],
            [new NNInteger(2)],
            [new Plus()],
            [new Pi()],
            [new Divide()],
            [new NNInteger(4)],
            [new Plus()],
            [new Pi()],
            [new Divide()],
            [new NNInteger(8)],
          ],
        ],
      ),
    ],
  ]),
  [new ApplyGate("h", [["q", 3]], [])],
  new Measure("q", "c", 3, 3),
];
