import {
  Include,
  IntType,
  UIntType,
  BitType,
  Range,
  Identifier,
  SubscriptedIdentifier,
  Pi,
  ArithmeticOp,
  Arithmetic,
  BinaryOp,
  Binary,
  IndexSet,
  QuantumMeasurement,
  QuantumMeasurementAssignment,
  ClassicalDeclaration,
  QuantumDeclaration,
  AliasStatement,
  QuantumGateCall,
  QuantumReset,
  ProgramBlock,
  SubroutineDefinition,
  SubroutineCall,
  BranchingStatement,
  ForLoopStatement,
  IntegerLiteral,
  Parameters,
} from "../../../src/qasm3/ast";

export const varteleportAst = [
  new Include('"stdgates.inc"'),
  new ClassicalDeclaration(
    new IntType(new IntegerLiteral(32)),
    new Identifier("n_pairs"),
    new IntegerLiteral(10),
    true,
  ),
  new SubroutineDefinition(
    new Identifier("bellprep"),
    new ProgramBlock([
      new QuantumReset(new Identifier("q")),
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
    ]),
    new Parameters([
      [new QuantumDeclaration(new Identifier("q"), new IntegerLiteral(2))],
    ]),
    null,
  ),
  new SubroutineDefinition(
    new Identifier("xprepare"),
    new ProgramBlock([
      new QuantumReset(new Identifier("q")),
      new QuantumGateCall(new Identifier("h"), [new Identifier("q")], null, []),
    ]),
    new Parameters([[new QuantumDeclaration(new Identifier("q"), null)]]),
    null,
  ),
  new QuantumDeclaration(new Identifier("input_qubit"), null),
  new ClassicalDeclaration(
    new BitType(null),
    new Identifier("output_qubit"),
    null,
    false,
  ),
  new QuantumDeclaration(
    new Identifier("q"),
    new Arithmetic(
      ArithmeticOp.TIMES,
      new IntegerLiteral(2),
      new Identifier("n_pairs"),
    ),
  ),
  new SubroutineCall(
    new Identifier("xprepare"),
    new Parameters([new Identifier("input_qubit")]),
  ),
  new QuantumGateCall(
    new Identifier("rz"),
    [new Identifier("input_qubit")],
    new Parameters([
      new Arithmetic(ArithmeticOp.DIVISION, new Pi(), new IntegerLiteral(4)),
    ]),
    [],
  ),
  new AliasStatement(new Identifier("io"), new Identifier("input_qubit")),
  new ForLoopStatement(
    new Range(
      new IntegerLiteral(0),
      new Arithmetic(
        ArithmeticOp.MINUS,
        new Identifier("n_pairs"),
        new IntegerLiteral(1),
      ),
      new IntegerLiteral(1),
    ),
    new UIntType(32),
    new Identifier("i"),
    new ProgramBlock([
      new AliasStatement(
        new Identifier("bp"),
        new SubscriptedIdentifier(
          "q",
          new IndexSet([
            new Arithmetic(
              ArithmeticOp.TIMES,
              new IntegerLiteral(2),
              new Identifier("i"),
            ),
            new Arithmetic(
              ArithmeticOp.PLUS,
              new Arithmetic(
                ArithmeticOp.TIMES,
                new IntegerLiteral(2),
                new Identifier("i"),
              ),
              new IntegerLiteral(1),
            ),
          ]),
        ),
      ),
      new ClassicalDeclaration(
        new BitType(new IntegerLiteral(2)),
        new Identifier("pf"),
        null,
        false,
      ),
      new SubroutineCall(new Identifier("bellprep"), null),
      new Identifier("bp"),
      new QuantumGateCall(
        new Identifier("cx"),
        [
          new Identifier("io"),
          new SubscriptedIdentifier("bp", new IntegerLiteral(0)),
        ],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("h"),
        [new Identifier("io")],
        null,
        [],
      ),
      new QuantumMeasurementAssignment(
        new SubscriptedIdentifier("pf", new IntegerLiteral(0)),
        new QuantumMeasurement([new Identifier("io")]),
      ),
      new QuantumMeasurementAssignment(
        new SubscriptedIdentifier("pf", new IntegerLiteral(1)),
        new QuantumMeasurement([
          new SubscriptedIdentifier("bp", new IntegerLiteral(0)),
        ]),
      ),
      new BranchingStatement(
        new Binary(
          BinaryOp.EQUAL,
          new SubscriptedIdentifier("pf", new IntegerLiteral(0)),
          new IntegerLiteral(1),
        ),
        new ProgramBlock([
          new QuantumGateCall(
            new Identifier("z"),
            [new SubscriptedIdentifier("bp", new IntegerLiteral(1))],
            null,
            [],
          ),
        ]),
        null,
      ),
      new BranchingStatement(
        new Binary(
          BinaryOp.EQUAL,
          new SubscriptedIdentifier("pf", new IntegerLiteral(1)),
          new IntegerLiteral(1),
        ),
        new ProgramBlock([
          new QuantumGateCall(
            new Identifier("x"),
            [new SubscriptedIdentifier("bp", new IntegerLiteral(1))],
            null,
            [],
          ),
        ]),
        null,
      ),
      new AliasStatement(
        new Identifier("io"),
        new SubscriptedIdentifier("bp", new IntegerLiteral(1)),
      ),
    ]),
  ),
  new QuantumGateCall(new Identifier("h"), [new Identifier("io")], null, []),
  new QuantumMeasurementAssignment(
    new Identifier("output_qubit"),
    new QuantumMeasurement([new Identifier("io")]),
  ),
];
