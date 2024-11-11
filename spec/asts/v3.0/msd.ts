import {
  Include,
  BoolType,
  IntType,
  UIntType,
  BitType,
  Range,
  Identifier,
  SubscriptedIdentifier,
  Pi,
  UnaryOp,
  Unary,
  ArithmeticOp,
  Arithmetic,
  BinaryOp,
  Binary,
  Cast,
  QuantumMeasurement,
  QuantumMeasurementAssignment,
  ClassicalDeclaration,
  AssignmentStatement,
  QuantumDeclaration,
  AliasStatement,
  QuantumGateModifier,
  QuantumGateCall,
  QuantumReset,
  ReturnStatement,
  ProgramBlock,
  SubroutineDefinition,
  SubroutineCall,
  BranchingStatement,
  ForLoopStatement,
  WhileLoopStatement,
  IntegerLiteral,
  Parameters,
} from "../../../src/qasm3/ast";

export const msdAst = [
  new Include('"stdgates.inc"'),
  new ClassicalDeclaration(
    new IntType(new IntegerLiteral(32)),
    new Identifier("buffer_size"),
    new IntegerLiteral(6),
    true,
  ),
  new SubroutineDefinition(
    new Identifier("ymeasure"),
    new ProgramBlock([
      new QuantumGateCall(new Identifier("s"), [new Identifier("q")], null, []),
      new QuantumGateCall(new Identifier("h"), [new Identifier("q")], null, []),
      new ReturnStatement([new QuantumMeasurement([new Identifier("q")])]),
    ]),
    new Parameters([[new QuantumDeclaration(new Identifier("q"), null)]]),
    new BitType(null),
  ),
  new SubroutineDefinition(
    new Identifier("distill"),
    new ProgramBlock([
      new ClassicalDeclaration(
        new BitType(null),
        new Identifier("temp"),
        null,
        false,
      ),
      new ClassicalDeclaration(
        new BitType(new IntegerLiteral(3)),
        new Identifier("checks"),
        null,
        false,
      ),
      new QuantumReset(
        new SubscriptedIdentifier(
          "scratch",
          new Range(
            new IntegerLiteral(0),
            new IntegerLiteral(1),
            new IntegerLiteral(1),
          ),
        ),
      ),
      new QuantumGateCall(
        new Identifier("h"),
        [new SubscriptedIdentifier("scratch", new IntegerLiteral(1))],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cx"),
        [
          new SubscriptedIdentifier("scratch", new IntegerLiteral(1)),
          new SubscriptedIdentifier("magic", new IntegerLiteral(0)),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cx"),
        [
          new SubscriptedIdentifier("magic", new IntegerLiteral(1)),
          new SubscriptedIdentifier("scratch", new IntegerLiteral(0)),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cx"),
        [
          new SubscriptedIdentifier("magic", new IntegerLiteral(0)),
          new SubscriptedIdentifier("scratch", new IntegerLiteral(0)),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cx"),
        [
          new SubscriptedIdentifier("scratch", new IntegerLiteral(1)),
          new SubscriptedIdentifier("magic", new IntegerLiteral(1)),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cy"),
        [
          new SubscriptedIdentifier("magic", new IntegerLiteral(2)),
          new SubscriptedIdentifier("scratch", new IntegerLiteral(0)),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("h"),
        [new SubscriptedIdentifier("magic", new IntegerLiteral(1))],
        null,
        [],
      ),
      new AssignmentStatement(
        new Identifier("temp"),
        new SubroutineCall(
          new Identifier("ymeasure"),
          new Parameters([
            new SubscriptedIdentifier("magic", new IntegerLiteral(2)),
          ]),
        ),
      ),
      new BranchingStatement(
        new Binary(
          BinaryOp.EQUAL,
          new Identifier("temp"),
          new IntegerLiteral(1),
        ),
        new ProgramBlock([
          new QuantumGateCall(
            new Identifier("ry"),
            [new SubscriptedIdentifier("scratch", new IntegerLiteral(0))],
            new Parameters([
              new Arithmetic(
                ArithmeticOp.DIVISION,
                new Unary(UnaryOp.MINUS, new Pi()),
                new IntegerLiteral(2),
              ),
            ]),
            [],
          ),
        ]),
        null,
      ),
      new QuantumReset(
        new SubscriptedIdentifier("scratch", new IntegerLiteral(2)),
      ),
      new QuantumGateCall(
        new Identifier("h"),
        [new SubscriptedIdentifier("scratch", new IntegerLiteral(2))],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cz"),
        [
          new SubscriptedIdentifier("scratch", new IntegerLiteral(2)),
          new SubscriptedIdentifier("scratch", new IntegerLiteral(0)),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cy"),
        [
          new SubscriptedIdentifier("magic", new IntegerLiteral(3)),
          new SubscriptedIdentifier("scratch", new IntegerLiteral(0)),
        ],
        null,
        [],
      ),
      new AssignmentStatement(
        new Identifier("temp"),
        new SubroutineCall(
          new Identifier("ymeasure"),
          new Parameters([
            new SubscriptedIdentifier("magic", new IntegerLiteral(3)),
          ]),
        ),
      ),
      new BranchingStatement(
        new Binary(
          BinaryOp.EQUAL,
          new Identifier("temp"),
          new IntegerLiteral(0),
        ),
        new ProgramBlock([
          new QuantumGateCall(
            new Identifier("ry"),
            [new SubscriptedIdentifier("scratch", new IntegerLiteral(0))],
            new Parameters([
              new Arithmetic(
                ArithmeticOp.DIVISION,
                new Pi(),
                new IntegerLiteral(2),
              ),
            ]),
            [],
          ),
        ]),
        null,
      ),
      new QuantumGateCall(
        new Identifier("h"),
        [new SubscriptedIdentifier("scratch", new IntegerLiteral(0))],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("s"),
        [new SubscriptedIdentifier("scratch", new IntegerLiteral(0))],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cy"),
        [
          new SubscriptedIdentifier("magic", new IntegerLiteral(4)),
          new SubscriptedIdentifier("scratch", new IntegerLiteral(1)),
        ],
        null,
        [],
      ),
      new AssignmentStatement(
        new Identifier("temp"),
        new SubroutineCall(
          new Identifier("ymeasure"),
          new Parameters([
            new SubscriptedIdentifier("magic", new IntegerLiteral(4)),
          ]),
        ),
      ),
      new BranchingStatement(
        new Binary(
          BinaryOp.EQUAL,
          new Identifier("temp"),
          new IntegerLiteral(1),
        ),
        new ProgramBlock([
          new QuantumGateCall(
            new Identifier("ry"),
            [new SubscriptedIdentifier("scratch", new IntegerLiteral(1))],
            new Parameters([
              new Arithmetic(
                ArithmeticOp.DIVISION,
                new Unary(UnaryOp.MINUS, new Pi()),
                new IntegerLiteral(2),
              ),
            ]),
            [],
          ),
        ]),
        null,
      ),
      new QuantumGateCall(
        new Identifier("cz"),
        [
          new SubscriptedIdentifier("scratch", new IntegerLiteral(3)),
          new SubscriptedIdentifier("scratch", new IntegerLiteral(2)),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cy"),
        [
          new SubscriptedIdentifier("magic", new IntegerLiteral(5)),
          new SubscriptedIdentifier("scratch", new IntegerLiteral(1)),
        ],
        null,
        [],
      ),
      new AssignmentStatement(
        new Identifier("temp"),
        new SubroutineCall(
          new Identifier("ymeasure"),
          new Parameters([
            new SubscriptedIdentifier("magic", new IntegerLiteral(5)),
          ]),
        ),
      ),
      new BranchingStatement(
        new Binary(
          BinaryOp.EQUAL,
          new Identifier("temp"),
          new IntegerLiteral(0),
        ),
        new ProgramBlock([
          new QuantumGateCall(
            new Identifier("ry"),
            [new SubscriptedIdentifier("scratch", new IntegerLiteral(1))],
            new Parameters([
              new Arithmetic(
                ArithmeticOp.DIVISION,
                new Pi(),
                new IntegerLiteral(2),
              ),
            ]),
            [],
          ),
        ]),
        null,
      ),
      new QuantumGateCall(
        new Identifier("cy"),
        [
          new SubscriptedIdentifier("scratch", new IntegerLiteral(0)),
          new SubscriptedIdentifier("magic", new IntegerLiteral(1)),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("s"),
        [new SubscriptedIdentifier("scratch", new IntegerLiteral(1))],
        null,
        [new QuantumGateModifier(2, null)],
      ),
      new QuantumGateCall(
        new Identifier("cz"),
        [
          new SubscriptedIdentifier("scratch", new IntegerLiteral(0)),
          new SubscriptedIdentifier("scratch", new IntegerLiteral(1)),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("h"),
        [new SubscriptedIdentifier("scratch", new IntegerLiteral(0))],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cy"),
        [
          new SubscriptedIdentifier("scratch", new IntegerLiteral(1)),
          new SubscriptedIdentifier("magic", new IntegerLiteral(1)),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cy"),
        [
          new SubscriptedIdentifier("magic", new IntegerLiteral(6)),
          new SubscriptedIdentifier("scratch", new IntegerLiteral(0)),
        ],
        null,
        [],
      ),
      new AssignmentStatement(
        new Identifier("temp"),
        new SubroutineCall(
          new Identifier("ymeasure"),
          new Parameters([
            new SubscriptedIdentifier("magic", new IntegerLiteral(6)),
          ]),
        ),
      ),
      new BranchingStatement(
        new Binary(
          BinaryOp.EQUAL,
          new Identifier("temp"),
          new IntegerLiteral(1),
        ),
        new ProgramBlock([
          new QuantumGateCall(
            new Identifier("ry"),
            [new SubscriptedIdentifier("scratch", new IntegerLiteral(0))],
            new Parameters([
              new Arithmetic(
                ArithmeticOp.DIVISION,
                new Unary(UnaryOp.MINUS, new Pi()),
                new IntegerLiteral(2),
              ),
            ]),
            [],
          ),
        ]),
        null,
      ),
      new QuantumGateCall(
        new Identifier("cz"),
        [
          new SubscriptedIdentifier("scratch", new IntegerLiteral(2)),
          new SubscriptedIdentifier("scratch", new IntegerLiteral(1)),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cz"),
        [
          new SubscriptedIdentifier("scratch", new IntegerLiteral(2)),
          new SubscriptedIdentifier("scratch", new IntegerLiteral(0)),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cy"),
        [
          new SubscriptedIdentifier("magic", new IntegerLiteral(7)),
          new SubscriptedIdentifier("scratch", new IntegerLiteral(0)),
        ],
        null,
        [],
      ),
      new AssignmentStatement(
        new Identifier("temp"),
        new SubroutineCall(
          new Identifier("ymeasure"),
          new Parameters([
            new SubscriptedIdentifier("magic", new IntegerLiteral(7)),
          ]),
        ),
      ),
      new BranchingStatement(
        new Binary(
          BinaryOp.EQUAL,
          new Identifier("temp"),
          new IntegerLiteral(0),
        ),
        new ProgramBlock([
          new QuantumGateCall(
            new Identifier("ry"),
            [new SubscriptedIdentifier("scratch", new IntegerLiteral(0))],
            new Parameters([
              new Arithmetic(
                ArithmeticOp.DIVISION,
                new Pi(),
                new IntegerLiteral(2),
              ),
            ]),
            [],
          ),
        ]),
        null,
      ),
      new QuantumGateCall(
        new Identifier("cy"),
        [
          new SubscriptedIdentifier("magic", new IntegerLiteral(8)),
          new SubscriptedIdentifier("scratch", new IntegerLiteral(1)),
        ],
        null,
        [],
      ),
      new AssignmentStatement(
        new Identifier("temp"),
        new SubroutineCall(
          new Identifier("ymeasure"),
          new Parameters([
            new SubscriptedIdentifier("magic", new IntegerLiteral(8)),
          ]),
        ),
      ),
      new BranchingStatement(
        new Binary(
          BinaryOp.EQUAL,
          new Identifier("temp"),
          new IntegerLiteral(1),
        ),
        new ProgramBlock([
          new QuantumGateCall(
            new Identifier("ry"),
            [new SubscriptedIdentifier("scratch", new IntegerLiteral(1))],
            new Parameters([
              new Arithmetic(
                ArithmeticOp.DIVISION,
                new Unary(UnaryOp.MINUS, new Pi()),
                new IntegerLiteral(2),
              ),
            ]),
            [],
          ),
        ]),
        null,
      ),
      new QuantumGateCall(
        new Identifier("cz"),
        [
          new SubscriptedIdentifier("scratch", new IntegerLiteral(2)),
          new SubscriptedIdentifier("scratch", new IntegerLiteral(1)),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cy"),
        [
          new SubscriptedIdentifier("magic", new IntegerLiteral(9)),
          new SubscriptedIdentifier("scratch", new IntegerLiteral(1)),
        ],
        null,
        [],
      ),
      new AssignmentStatement(
        new Identifier("temp"),
        new SubroutineCall(
          new Identifier("ymeasure"),
          new Parameters([
            new SubscriptedIdentifier("magic", new IntegerLiteral(9)),
          ]),
        ),
      ),
      new BranchingStatement(
        new Binary(
          BinaryOp.EQUAL,
          new Identifier("temp"),
          new IntegerLiteral(0),
        ),
        new ProgramBlock([
          new QuantumGateCall(
            new Identifier("ry"),
            [new SubscriptedIdentifier("scratch", new IntegerLiteral(1))],
            new Parameters([
              new Arithmetic(
                ArithmeticOp.DIVISION,
                new Pi(),
                new IntegerLiteral(2),
              ),
            ]),
            [],
          ),
        ]),
        null,
      ),
      new QuantumGateCall(
        new Identifier("h"),
        [new SubscriptedIdentifier("scratch", new IntegerLiteral(2))],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cx"),
        [
          new SubscriptedIdentifier("magic", new IntegerLiteral(0)),
          new SubscriptedIdentifier("scratch", new IntegerLiteral(0)),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cx"),
        [
          new SubscriptedIdentifier("scratch", new IntegerLiteral(1)),
          new SubscriptedIdentifier("magic", new IntegerLiteral(1)),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cx"),
        [
          new SubscriptedIdentifier("magic", new IntegerLiteral(1)),
          new SubscriptedIdentifier("scratch", new IntegerLiteral(0)),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cx"),
        [
          new SubscriptedIdentifier("scratch", new IntegerLiteral(1)),
          new SubscriptedIdentifier("magic", new IntegerLiteral(0)),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("h"),
        [new SubscriptedIdentifier("scratch", new IntegerLiteral(1))],
        null,
        [],
      ),
      new QuantumMeasurementAssignment(
        new Identifier("checks"),
        new QuantumMeasurement([new Identifier("scratch")]),
      ),
      new AssignmentStatement(
        new Identifier("success"),
        new Unary(
          UnaryOp.BIT_NOT,
          new Binary(
            BinaryOp.BIT_OR,
            new Binary(
              BinaryOp.BIT_OR,
              new Cast(
                new BoolType(),
                new SubscriptedIdentifier("checks", new IntegerLiteral(0)),
              ),
              new Cast(
                new BoolType(),
                new SubscriptedIdentifier("checks", new IntegerLiteral(1)),
              ),
            ),
            new Cast(
              new BoolType(),
              new SubscriptedIdentifier("checks", new IntegerLiteral(2)),
            ),
          ),
        ),
      ),
      new ReturnStatement([new Identifier("success")]),
    ]),
    new Parameters([
      [new QuantumDeclaration(new Identifier("magic"), new IntegerLiteral(10))],
      [
        new QuantumDeclaration(
          new Identifier("scratch"),
          new IntegerLiteral(3),
        ),
      ],
    ]),
    new BoolType(),
  ),
  new SubroutineDefinition(
    new Identifier("rus_level_0"),
    new ProgramBlock([
      new ClassicalDeclaration(
        new BoolType(),
        new Identifier("success"),
        null,
        false,
      ),
      new WhileLoopStatement(
        new Unary(UnaryOp.BIT_NOT, new Identifier("success")),
        new ProgramBlock([
          new QuantumReset(new Identifier("magic")),
          new QuantumGateCall(
            new Identifier("ry"),
            [new Identifier("magic")],
            new Parameters([
              new Arithmetic(
                ArithmeticOp.DIVISION,
                new Pi(),
                new IntegerLiteral(4),
              ),
            ]),
            [],
          ),
          new AssignmentStatement(
            new Identifier("success"),
            new SubroutineCall(
              new Identifier("distill"),
              new Parameters([
                new Identifier("magic"),
                new Identifier("scratch"),
              ]),
            ),
          ),
        ]),
      ),
    ]),
    new Parameters([
      [new QuantumDeclaration(new Identifier("magic"), new IntegerLiteral(10))],
      [
        new QuantumDeclaration(
          new Identifier("scratch"),
          new IntegerLiteral(3),
        ),
      ],
    ]),
    null,
  ),
  new SubroutineDefinition(
    new Identifier("distill_and_buffer"),
    new ProgramBlock([
      new ClassicalDeclaration(
        new IntType(new IntegerLiteral(32)),
        new Identifier("index"),
        null,
        false,
      ),
      new ClassicalDeclaration(
        new BitType(null),
        new Identifier("success_0"),
        null,
        false,
      ),
      new ClassicalDeclaration(
        new BitType(null),
        new Identifier("success_1"),
        null,
        false,
      ),
      new AliasStatement(
        new Identifier("magic_lvl0"),
        new SubscriptedIdentifier(
          "work",
          new Range(
            new IntegerLiteral(0),
            new IntegerLiteral(9),
            new IntegerLiteral(1),
          ),
        ),
      ),
      new AliasStatement(
        new Identifier("magic_lvl1_0"),
        new SubscriptedIdentifier(
          "work",
          new Range(
            new IntegerLiteral(10),
            new IntegerLiteral(19),
            new IntegerLiteral(1),
          ),
        ),
      ),
      new AliasStatement(
        new Identifier("magic_lvl1_1"),
        new SubscriptedIdentifier(
          "work",
          new Range(
            new IntegerLiteral(20),
            new IntegerLiteral(29),
            new IntegerLiteral(1),
          ),
        ),
      ),
      new AliasStatement(
        new Identifier("scratch"),
        new SubscriptedIdentifier(
          "work",
          new Range(
            new IntegerLiteral(30),
            new IntegerLiteral(32),
            new IntegerLiteral(1),
          ),
        ),
      ),
      new ForLoopStatement(
        new Range(
          new IntegerLiteral(0),
          new IntegerLiteral(9),
          new IntegerLiteral(1),
        ),
        new UIntType(32),
        new Identifier("i"),
        new ProgramBlock([
          new SubroutineCall(
            new Identifier("rus_level_0"),
            new Parameters([
              new Identifier("magic_lvl0"),
              new Identifier("scratch"),
            ]),
          ),
          new QuantumGateCall(
            new Identifier("swap"),
            [
              new SubscriptedIdentifier("magic_lvl0", new IntegerLiteral(0)),
              new SubscriptedIdentifier("magic_lvl1_0", new Identifier("i")),
            ],
            null,
            [],
          ),
          new QuantumGateCall(
            new Identifier("swap"),
            [
              new SubscriptedIdentifier("magic_lvl0", new IntegerLiteral(1)),
              new SubscriptedIdentifier("magic_lvl1_1", new Identifier("i")),
            ],
            null,
            [],
          ),
        ]),
      ),
      new AssignmentStatement(
        new Identifier("success_0"),
        new SubroutineCall(
          new Identifier("distill"),
          new Parameters([
            new Identifier("magic_lvl1_0"),
            new Identifier("scratch"),
          ]),
        ),
      ),
      new AssignmentStatement(
        new Identifier("success_1"),
        new SubroutineCall(
          new Identifier("distill"),
          new Parameters([
            new Identifier("magic_lvl1_1"),
            new Identifier("scratch"),
          ]),
        ),
      ),
      new BranchingStatement(
        new Binary(
          BinaryOp.LESS,
          new Binary(
            BinaryOp.LOGIC_AND,
            new Identifier("success_0"),
            new Identifier("index"),
          ),
          new Identifier("buffer_size"),
        ),
        new ProgramBlock([
          new QuantumGateCall(
            new Identifier("swap"),
            [
              new SubscriptedIdentifier(
                "magic_lvl1_0",
                new Range(
                  new IntegerLiteral(0),
                  new IntegerLiteral(1),
                  new IntegerLiteral(1),
                ),
              ),
              new SubscriptedIdentifier(
                "buffer",
                new Range(
                  new Identifier("index"),
                  new Arithmetic(
                    ArithmeticOp.PLUS,
                    new Identifier("index"),
                    new IntegerLiteral(1),
                  ),
                  new IntegerLiteral(1),
                ),
              ),
            ],
            null,
            [],
          ),
          new AssignmentStatement(
            new Identifier("index"),
            new Arithmetic(
              ArithmeticOp.PLUS,
              new Identifier("index"),
              new IntegerLiteral(2),
            ),
          ),
        ]),
        null,
      ),
      new BranchingStatement(
        new Binary(
          BinaryOp.LESS,
          new Binary(
            BinaryOp.LOGIC_AND,
            new Identifier("success_1"),
            new Identifier("index"),
          ),
          new Identifier("buffer_size"),
        ),
        new ProgramBlock([
          new QuantumGateCall(
            new Identifier("swap"),
            [
              new SubscriptedIdentifier(
                "magic_lvl1_1",
                new Range(
                  new IntegerLiteral(0),
                  new IntegerLiteral(1),
                  new IntegerLiteral(1),
                ),
              ),
              new SubscriptedIdentifier(
                "buffer",
                new Range(
                  new Identifier("index"),
                  new Arithmetic(
                    ArithmeticOp.PLUS,
                    new Identifier("index"),
                    new IntegerLiteral(1),
                  ),
                  new IntegerLiteral(1),
                ),
              ),
            ],
            null,
            [],
          ),
          new AssignmentStatement(
            new Identifier("index"),
            new Arithmetic(
              ArithmeticOp.PLUS,
              new Identifier("index"),
              new IntegerLiteral(2),
            ),
          ),
        ]),
        null,
      ),
    ]),
    new Parameters([
      new ClassicalDeclaration(
        new IntType(new IntegerLiteral(32)),
        new Identifier("num"),
        null,
        false,
      ),
      [new QuantumDeclaration(new Identifier("work"), new IntegerLiteral(33))],
      [
        new QuantumDeclaration(
          new Identifier("buffer"),
          new Identifier("buffer_size"),
        ),
      ],
    ]),
    null,
  ),
  new SubroutineDefinition(
    new Identifier("Ty"),
    new ProgramBlock([
      new ClassicalDeclaration(
        new BitType(null),
        new Identifier("outcome"),
        null,
        false,
      ),
      new QuantumGateCall(
        new Identifier("cy"),
        [
          new SubscriptedIdentifier("buffer", new Identifier("addr")),
          new Identifier("q"),
        ],
        null,
        [],
      ),
      new AssignmentStatement(
        new Identifier("outcome"),
        new SubroutineCall(
          new Identifier("ymeasure"),
          new Parameters([
            new SubscriptedIdentifier("buffer", new Identifier("addr")),
          ]),
        ),
      ),
      new BranchingStatement(
        new Binary(
          BinaryOp.EQUAL,
          new Identifier("outcome"),
          new IntegerLiteral(1),
        ),
        new ProgramBlock([
          new QuantumGateCall(
            new Identifier("ry"),
            [new Identifier("q")],
            new Parameters([
              new Arithmetic(
                ArithmeticOp.DIVISION,
                new Pi(),
                new IntegerLiteral(2),
              ),
            ]),
            [],
          ),
        ]),
        null,
      ),
    ]),
    new Parameters([
      new ClassicalDeclaration(
        new IntType(new IntegerLiteral(32)),
        new Identifier("addr"),
        null,
        false,
      ),
      [new QuantumDeclaration(new Identifier("q"), null)],
      [
        new QuantumDeclaration(
          new Identifier("buffer"),
          new Identifier("buffer_size"),
        ),
      ],
    ]),
    null,
  ),
  new QuantumDeclaration(new Identifier("workspace"), new IntegerLiteral(33)),
  new QuantumDeclaration(
    new Identifier("buffer"),
    new Identifier("buffer_size"),
  ),
  new QuantumDeclaration(new Identifier("q"), new IntegerLiteral(5)),
  new ClassicalDeclaration(
    new BitType(new IntegerLiteral(5)),
    new Identifier("c"),
    null,
    false,
  ),
  new ClassicalDeclaration(
    new IntType(new IntegerLiteral(32)),
    new Identifier("address"),
    null,
    false,
  ),
  new QuantumReset(new Identifier("workspace")),
  new QuantumReset(new Identifier("buffer")),
  new QuantumReset(new Identifier("q")),
  new SubroutineCall(
    new Identifier("distill_and_buffer"),
    new Parameters([
      new Identifier("buffer_size"),
      new Identifier("workspace"),
      new Identifier("buffer"),
    ]),
  ),
  new QuantumGateCall(
    new Identifier("h"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(0))],
    null,
    [],
  ),
  new QuantumGateCall(
    new Identifier("cx"),
    [
      new SubscriptedIdentifier("q", new IntegerLiteral(0)),
      new SubscriptedIdentifier("q", new IntegerLiteral(1)),
    ],
    null,
    [],
  ),
  new SubroutineCall(
    new Identifier("Ty"),
    new Parameters([
      new Identifier("address"),
      new SubscriptedIdentifier("q", new IntegerLiteral(0)),
      new Identifier("buffer"),
    ]),
  ),
  new AssignmentStatement(
    new Identifier("address"),
    new Arithmetic(
      ArithmeticOp.PLUS,
      new Identifier("address"),
      new IntegerLiteral(1),
    ),
  ),
  new QuantumGateCall(
    new Identifier("cx"),
    [
      new SubscriptedIdentifier("q", new IntegerLiteral(0)),
      new SubscriptedIdentifier("q", new IntegerLiteral(1)),
    ],
    null,
    [],
  ),
  new SubroutineCall(
    new Identifier("Ty"),
    new Parameters([
      new Identifier("address"),
      new SubscriptedIdentifier("q", new IntegerLiteral(1)),
      new Identifier("buffer"),
    ]),
  ),
  new AssignmentStatement(
    new Identifier("address"),
    new Arithmetic(
      ArithmeticOp.PLUS,
      new Identifier("address"),
      new IntegerLiteral(1),
    ),
  ),
];
