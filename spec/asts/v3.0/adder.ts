import {
  Include,
  BoolType,
  UIntType,
  BitType,
  Range,
  Identifier,
  SubscriptedIdentifier,
  Unary,
  UnaryOp,
  Arithmetic,
  ArithmeticOp,
  Cast,
  QuantumMeasurement,
  QuantumMeasurementAssignment,
  ClassicalDeclaration,
  QuantumDeclaration,
  QuantumGateCall,
  QuantumReset,
  ProgramBlock,
  QuantumGateDefinition,
  BranchingStatement,
  ForLoopStatement,
  IntegerLiteral,
  Parameters,
} from "../../../src/qasm3/ast";

export const adderAst = [
  new Include("\"stdgates.inc\""),
  new QuantumGateDefinition(
    new Identifier("majority"),
    new Parameters([]),
    [new Identifier("a"), new Identifier("b"), new Identifier("c")],
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("cx"),
        [new Identifier("c"), new Identifier("b")],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cx"),
        [new Identifier("c"), new Identifier("a")],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("ccx"),
        [new Identifier("a"), new Identifier("b"), new Identifier("c")],
        null,
        [],
      ),
    ]),
  ),
  new QuantumGateDefinition(
    new Identifier("unmaj"),
    new Parameters([]),
    [new Identifier("a"), new Identifier("b"), new Identifier("c")],
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("ccx"),
        [new Identifier("a"), new Identifier("b"), new Identifier("c")],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cx"),
        [new Identifier("c"), new Identifier("a")],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cx"),
        [new Identifier("a"), new Identifier("b")],
        null,
        [],
      ),
    ]),
  ),
  new QuantumDeclaration(new Identifier("cin"), new IntegerLiteral(1)),
  new QuantumDeclaration(new Identifier("a"), new IntegerLiteral(4)),
  new QuantumDeclaration(new Identifier("b"), new IntegerLiteral(4)),
  new QuantumDeclaration(new Identifier("cout"), new IntegerLiteral(1)),
  new ClassicalDeclaration(
    new BitType(new IntegerLiteral(5)),
    new Identifier("ans"),
    null,
    false,
  ),
  new ClassicalDeclaration(
    new UIntType(new IntegerLiteral(4)),
    new Identifier("a_in"),
    new IntegerLiteral(1),
    false,
  ),
  new ClassicalDeclaration(
    new UIntType(new IntegerLiteral(4)),
    new Identifier("b_in"),
    new IntegerLiteral(15),
    false,
  ),
  new QuantumReset(new Identifier("cin")),
  new QuantumReset(new Identifier("a")),
  new QuantumReset(new Identifier("b")),
  new QuantumReset(new Identifier("cout")),
  new ForLoopStatement(
    new Range(
      new IntegerLiteral(0),
      new IntegerLiteral(3),
      new IntegerLiteral(1),
    ),
    new UIntType(32),
    new Identifier("i"),
    new ProgramBlock([
      new BranchingStatement(
        new Cast(
          new BoolType(),
          new SubscriptedIdentifier("a_in", new Identifier("i")),
        ),
        new ProgramBlock([
          new QuantumGateCall(
            new Identifier("x"),
            [new SubscriptedIdentifier("a", new Identifier("i"))],
            null,
            [],
          ),
        ]),
        null,
      ),
      new BranchingStatement(
        new Cast(
          new BoolType(),
          new SubscriptedIdentifier("b_in", new Identifier("i")),
        ),
        new ProgramBlock([
          new QuantumGateCall(
            new Identifier("x"),
            [new SubscriptedIdentifier("b", new Identifier("i"))],
            null,
            [],
          ),
        ]),
        null,
      ),
    ]),
  ),
  new QuantumGateCall(
    new Identifier("majority"),
    [
      new SubscriptedIdentifier("cin", new IntegerLiteral(0)),
      new SubscriptedIdentifier("b", new IntegerLiteral(0)),
      new SubscriptedIdentifier("a", new IntegerLiteral(0)),
    ],
    null,
    [],
  ),
  new ForLoopStatement(
    new Range(
      new IntegerLiteral(0),
      new IntegerLiteral(2),
      new IntegerLiteral(1),
    ),
    new UIntType(32),
    new Identifier("i"),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("majority"),
        [
          new SubscriptedIdentifier("a", new Identifier("i")),
          new SubscriptedIdentifier(
            "b",
            new Arithmetic(
              ArithmeticOp.PLUS,
              new Identifier("i"),
              new IntegerLiteral(1),
            ),
          ),
          new SubscriptedIdentifier(
            "a",
            new Arithmetic(
              ArithmeticOp.PLUS,
              new Identifier("i"),
              new IntegerLiteral(1),
            ),
          ),
        ],
        null,
        [],
      ),
    ]),
  ),
  new QuantumGateCall(
    new Identifier("cx"),
    [
      new SubscriptedIdentifier("a", new IntegerLiteral(3)),
      new SubscriptedIdentifier("cout", new IntegerLiteral(0)),
    ],
    null,
    [],
  ),
  new ForLoopStatement(
    new Range(
      new IntegerLiteral(2),
      new IntegerLiteral(0),
      new Unary(UnaryOp.MINUS, new IntegerLiteral(1)),
    ),
    new UIntType(32),
    new Identifier("i"),
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("unmaj"),
        [
          new SubscriptedIdentifier("a", new Identifier("i")),
          new SubscriptedIdentifier(
            "b",
            new Arithmetic(
              ArithmeticOp.PLUS,
              new Identifier("i"),
              new IntegerLiteral(1),
            ),
          ),
          new SubscriptedIdentifier(
            "a",
            new Arithmetic(
              ArithmeticOp.PLUS,
              new Identifier("i"),
              new IntegerLiteral(1),
            ),
          ),
        ],
        null,
        [],
      ),
    ]),
  ),
  new QuantumGateCall(
    new Identifier("unmaj"),
    [
      new SubscriptedIdentifier("cin", new IntegerLiteral(0)),
      new SubscriptedIdentifier("b", new IntegerLiteral(0)),
      new SubscriptedIdentifier("a", new IntegerLiteral(0)),
    ],
    null,
    [],
  ),
  new QuantumMeasurementAssignment(
    new SubscriptedIdentifier(
      "ans",
      new Range(
        new IntegerLiteral(0),
        new IntegerLiteral(3),
        new IntegerLiteral(1),
      ),
    ),
    new QuantumMeasurement([
      new SubscriptedIdentifier(
        "b",
        new Range(
          new IntegerLiteral(0),
          new IntegerLiteral(3),
          new IntegerLiteral(1),
        ),
      ),
    ]),
  ),
  new QuantumMeasurementAssignment(
    new SubscriptedIdentifier("ans", new IntegerLiteral(4)),
    new QuantumMeasurement([
      new SubscriptedIdentifier("cout", new IntegerLiteral(0)),
    ]),
  ),
];
