import {
  Include,
  IntType,
  BitType,
  Identifier,
  SubscriptedIdentifier,
  Pi,
  ArithmeticOp,
  Arithmetic,
  BinaryOp,
  Binary,
  Cast,
  QuantumMeasurement,
  QuantumMeasurementAssignment,
  ClassicalDeclaration,
  QuantumDeclaration,
  QuantumGateCall,
  QuantumBarrier,
  QuantumReset,
  ProgramBlock,
  BranchingStatement,
  IntegerLiteral,
  Parameters,
} from "../../../src/qasm3/ast";

export const inverseqft1Ast = [
  new Include('"stdgates.inc"'),
  new QuantumDeclaration(new Identifier("q"), new IntegerLiteral(4)),
  new ClassicalDeclaration(
    new BitType(new IntegerLiteral(4)),
    new Identifier("c"),
    null,
    false,
  ),
  new QuantumReset(new Identifier("q")),
  new QuantumGateCall(new Identifier("h"), [new Identifier("q")], null, []),
  new QuantumBarrier([new Identifier("q")]),
  new QuantumGateCall(
    new Identifier("h"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(0))],
    null,
    [],
  ),
  new QuantumMeasurementAssignment(
    new SubscriptedIdentifier("c", new IntegerLiteral(0)),
    new QuantumMeasurement([
      new SubscriptedIdentifier("q", new IntegerLiteral(0)),
    ]),
  ),
  new BranchingStatement(
    new Binary(
      BinaryOp.EQUAL,
      new Cast(new IntType(new IntegerLiteral(4)), new Identifier("c")),
      new IntegerLiteral(1),
    ),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("rz"),
        [new SubscriptedIdentifier("q", new IntegerLiteral(1))],
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
    [new SubscriptedIdentifier("q", new IntegerLiteral(1))],
    null,
    [],
  ),
  new QuantumMeasurementAssignment(
    new SubscriptedIdentifier("c", new IntegerLiteral(1)),
    new QuantumMeasurement([
      new SubscriptedIdentifier("q", new IntegerLiteral(1)),
    ]),
  ),
  new BranchingStatement(
    new Binary(
      BinaryOp.EQUAL,
      new Cast(new IntType(new IntegerLiteral(4)), new Identifier("c")),
      new IntegerLiteral(1),
    ),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("rz"),
        [new SubscriptedIdentifier("q", new IntegerLiteral(2))],
        new Parameters([
          new Arithmetic(
            ArithmeticOp.DIVISION,
            new Pi(),
            new IntegerLiteral(4),
          ),
        ]),
        [],
      ),
    ]),
    null,
  ),
  new BranchingStatement(
    new Binary(
      BinaryOp.EQUAL,
      new Cast(new IntType(new IntegerLiteral(4)), new Identifier("c")),
      new IntegerLiteral(2),
    ),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("rz"),
        [new SubscriptedIdentifier("q", new IntegerLiteral(2))],
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
  new BranchingStatement(
    new Binary(
      BinaryOp.EQUAL,
      new Cast(new IntType(new IntegerLiteral(4)), new Identifier("c")),
      new IntegerLiteral(3),
    ),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("rz"),
        [new SubscriptedIdentifier("q", new IntegerLiteral(2))],
        new Parameters([
          new Arithmetic(
            ArithmeticOp.DIVISION,
            new Arithmetic(
              ArithmeticOp.PLUS,
              new Arithmetic(
                ArithmeticOp.DIVISION,
                new Pi(),
                new IntegerLiteral(2),
              ),
              new Pi(),
            ),
            new IntegerLiteral(4),
          ),
        ]),
        [],
      ),
    ]),
    null,
  ),
  new QuantumGateCall(
    new Identifier("h"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(2))],
    null,
    [],
  ),
  new QuantumMeasurementAssignment(
    new SubscriptedIdentifier("c", new IntegerLiteral(2)),
    new QuantumMeasurement([
      new SubscriptedIdentifier("q", new IntegerLiteral(2)),
    ]),
  ),
  new BranchingStatement(
    new Binary(
      BinaryOp.EQUAL,
      new Cast(new IntType(new IntegerLiteral(4)), new Identifier("c")),
      new IntegerLiteral(1),
    ),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("rz"),
        [new SubscriptedIdentifier("q", new IntegerLiteral(3))],
        new Parameters([
          new Arithmetic(
            ArithmeticOp.DIVISION,
            new Pi(),
            new IntegerLiteral(8),
          ),
        ]),
        [],
      ),
    ]),
    null,
  ),
  new BranchingStatement(
    new Binary(
      BinaryOp.EQUAL,
      new Cast(new IntType(new IntegerLiteral(4)), new Identifier("c")),
      new IntegerLiteral(2),
    ),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("rz"),
        [new SubscriptedIdentifier("q", new IntegerLiteral(3))],
        new Parameters([
          new Arithmetic(
            ArithmeticOp.DIVISION,
            new Pi(),
            new IntegerLiteral(4),
          ),
        ]),
        [],
      ),
    ]),
    null,
  ),
  new BranchingStatement(
    new Binary(
      BinaryOp.EQUAL,
      new Cast(new IntType(new IntegerLiteral(4)), new Identifier("c")),
      new IntegerLiteral(3),
    ),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("rz"),
        [new SubscriptedIdentifier("q", new IntegerLiteral(3))],
        new Parameters([
          new Arithmetic(
            ArithmeticOp.DIVISION,
            new Arithmetic(
              ArithmeticOp.PLUS,
              new Arithmetic(
                ArithmeticOp.DIVISION,
                new Pi(),
                new IntegerLiteral(4),
              ),
              new Pi(),
            ),
            new IntegerLiteral(8),
          ),
        ]),
        [],
      ),
    ]),
    null,
  ),
  new BranchingStatement(
    new Binary(
      BinaryOp.EQUAL,
      new Cast(new IntType(new IntegerLiteral(4)), new Identifier("c")),
      new IntegerLiteral(4),
    ),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("rz"),
        [new SubscriptedIdentifier("q", new IntegerLiteral(3))],
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
  new BranchingStatement(
    new Binary(
      BinaryOp.EQUAL,
      new Cast(new IntType(new IntegerLiteral(4)), new Identifier("c")),
      new IntegerLiteral(5),
    ),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("rz"),
        [new SubscriptedIdentifier("q", new IntegerLiteral(3))],
        new Parameters([
          new Arithmetic(
            ArithmeticOp.DIVISION,
            new Arithmetic(
              ArithmeticOp.PLUS,
              new Arithmetic(
                ArithmeticOp.DIVISION,
                new Pi(),
                new IntegerLiteral(2),
              ),
              new Pi(),
            ),
            new IntegerLiteral(8),
          ),
        ]),
        [],
      ),
    ]),
    null,
  ),
  new BranchingStatement(
    new Binary(
      BinaryOp.EQUAL,
      new Cast(new IntType(new IntegerLiteral(4)), new Identifier("c")),
      new IntegerLiteral(6),
    ),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("rz"),
        [new SubscriptedIdentifier("q", new IntegerLiteral(3))],
        new Parameters([
          new Arithmetic(
            ArithmeticOp.DIVISION,
            new Arithmetic(
              ArithmeticOp.PLUS,
              new Arithmetic(
                ArithmeticOp.DIVISION,
                new Pi(),
                new IntegerLiteral(2),
              ),
              new Pi(),
            ),
            new IntegerLiteral(4),
          ),
        ]),
        [],
      ),
    ]),
    null,
  ),
  new BranchingStatement(
    new Binary(
      BinaryOp.EQUAL,
      new Cast(new IntType(new IntegerLiteral(4)), new Identifier("c")),
      new IntegerLiteral(7),
    ),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("rz"),
        [new SubscriptedIdentifier("q", new IntegerLiteral(3))],
        new Parameters([
          new Arithmetic(
            ArithmeticOp.DIVISION,
            new Arithmetic(
              ArithmeticOp.PLUS,
              new Arithmetic(
                ArithmeticOp.DIVISION,
                new Arithmetic(
                  ArithmeticOp.PLUS,
                  new Arithmetic(
                    ArithmeticOp.DIVISION,
                    new Pi(),
                    new IntegerLiteral(2),
                  ),
                  new Pi(),
                ),
                new IntegerLiteral(4),
              ),
              new Pi(),
            ),
            new IntegerLiteral(8),
          ),
        ]),
        [],
      ),
    ]),
    null,
  ),
  new QuantumGateCall(
    new Identifier("h"),
    [new SubscriptedIdentifier("q", new IntegerLiteral(3))],
    null,
    [],
  ),
  new QuantumMeasurementAssignment(
    new SubscriptedIdentifier("c", new IntegerLiteral(3)),
    new QuantumMeasurement([
      new SubscriptedIdentifier("q", new IntegerLiteral(3)),
    ]),
  ),
];
