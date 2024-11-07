import {
  Include,
  Identifier,
  SubscriptedIdentifier,
  Pi,
  Unary,
  Arithmetic,
  QuantumGateCall,
  ProgramBlock,
  QuantumGateDefinition,
  IntegerLiteral,
  Parameters,
  ArithmeticOp,
  UnaryOp,
} from "../../../src/qasm3/ast";

export const cphaseAst = [
  new Include('"stdgates.inc"'),
  new QuantumGateDefinition(
    new Identifier("cphase"),
    new Parameters([new Identifier("θ")]),
    [new Identifier("a"), new Identifier("b")],
    new ProgramBlock([
      new QuantumGateCall(
        new Identifier("U"),
        [new Identifier("a")],
        new Parameters([
          new IntegerLiteral(0),
          new IntegerLiteral(0),
          new Arithmetic(
            ArithmeticOp.DIVISION,
            new Identifier("θ"),
            new IntegerLiteral(2),
          ),
        ]),
        [],
      ),
      new QuantumGateCall(
        new Identifier("CX"),
        [new Identifier("a"), new Identifier("b")],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("U"),
        [new Identifier("b")],
        new Parameters([
          new IntegerLiteral(0),
          new IntegerLiteral(0),
          new Arithmetic(
            ArithmeticOp.DIVISION,
            new Unary(UnaryOp.MINUS, new Identifier("θ")),
            new IntegerLiteral(2),
          ),
        ]),
        [],
      ),
      new QuantumGateCall(
        new Identifier("CX"),
        [new Identifier("a"), new Identifier("b")],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("U"),
        [new Identifier("b")],
        new Parameters([
          new IntegerLiteral(0),
          new IntegerLiteral(0),
          new Arithmetic(
            ArithmeticOp.DIVISION,
            new Identifier("θ"),
            new IntegerLiteral(2),
          ),
        ]),
        [],
      ),
    ]),
  ),
  new QuantumGateCall(
    new Identifier("cphase"),
    [
      new SubscriptedIdentifier("q", new IntegerLiteral(0)),
      new SubscriptedIdentifier("q", new IntegerLiteral(1)),
    ],
    new Parameters([
      new Arithmetic(ArithmeticOp.DIVISION, new Pi(), new IntegerLiteral(2)),
    ]),
    [],
  ),
];
