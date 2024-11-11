import {
  Include,
  StretchType,
  DurationType,
  Identifier,
  FloatLiteral,
  DurationOf,
  UnaryOp,
  Unary,
  ArithmeticOp,
  Arithmetic,
  ClassicalDeclaration,
  HardwareQubit,
  QuantumGateCall,
  QuantumDelay,
  ProgramBlock,
  BoxDefinition,
  IntegerLiteral,
} from "../../../src/qasm3/ast";

export const ddAst = [
  new Include('"stdgates.inc"'),
  new ClassicalDeclaration(new StretchType(), new Identifier("a"), null, false),
  new ClassicalDeclaration(
    new DurationType(),
    new Identifier("start_stretch"),
    new Arithmetic(
      ArithmeticOp.PLUS,
      new Arithmetic(
        ArithmeticOp.TIMES,
        new Unary(UnaryOp.MINUS, new FloatLiteral(0.5)),
        new DurationOf(
          new ProgramBlock([
            new QuantumGateCall(
              new Identifier("x"),
              [new HardwareQubit(0)],
              null,
              [],
            ),
          ]),
        ),
      ),
      new Identifier("a"),
    ),
    false,
  ),
  new ClassicalDeclaration(
    new DurationType(),
    new Identifier("middle_stretch"),
    new Arithmetic(
      ArithmeticOp.PLUS,
      new Arithmetic(
        ArithmeticOp.TIMES,
        new Arithmetic(
          ArithmeticOp.MINUS,
          new Arithmetic(
            ArithmeticOp.TIMES,
            new Unary(UnaryOp.MINUS, new FloatLiteral(0.5)),
            new DurationOf(
              new ProgramBlock([
                new QuantumGateCall(
                  new Identifier("x"),
                  [new HardwareQubit(0)],
                  null,
                  [],
                ),
              ]),
            ),
          ),
          new IntegerLiteral(5),
        ),
        new DurationOf(
          new ProgramBlock([
            new QuantumGateCall(
              new Identifier("y"),
              [new HardwareQubit(0)],
              null,
              [],
            ),
          ]),
        ),
      ),
      new Identifier("a"),
    ),
    false,
  ),
  new ClassicalDeclaration(
    new DurationType(),
    new Identifier("end_stretch"),
    new Arithmetic(
      ArithmeticOp.PLUS,
      new Arithmetic(
        ArithmeticOp.TIMES,
        new Unary(UnaryOp.MINUS, new FloatLiteral(0.5)),
        new DurationOf(
          new ProgramBlock([
            new QuantumGateCall(
              new Identifier("y"),
              [new HardwareQubit(0)],
              null,
              [],
            ),
          ]),
        ),
      ),
      new Identifier("a"),
    ),
    false,
  ),
  new BoxDefinition(
    new ProgramBlock([
      new QuantumDelay(new Identifier("start_stretch"), [new HardwareQubit(0)]),
      new QuantumGateCall(
        new Identifier("x"),
        [new HardwareQubit(0)],
        null,
        [],
      ),
      new QuantumDelay(new Identifier("middle_stretch"), [
        new HardwareQubit(0),
      ]),
      new QuantumGateCall(
        new Identifier("y"),
        [new HardwareQubit(0)],
        null,
        [],
      ),
      new QuantumDelay(new Identifier("middle_stretch"), [
        new HardwareQubit(0),
      ]),
      new QuantumGateCall(
        new Identifier("x"),
        [new HardwareQubit(0)],
        null,
        [],
      ),
      new QuantumDelay(new Identifier("middle_stretch"), [
        new HardwareQubit(0),
      ]),
      new QuantumGateCall(
        new Identifier("y"),
        [new HardwareQubit(0)],
        null,
        [],
      ),
      new QuantumDelay(new Identifier("end_stretch"), [new HardwareQubit(0)]),
      new QuantumGateCall(
        new Identifier("cx"),
        [new HardwareQubit(2), new HardwareQubit(3)],
        null,
        [],
      ),
      new QuantumGateCall(
        new Identifier("cx"),
        [new HardwareQubit(1), new HardwareQubit(2)],
        null,
        [],
      ),
    ]),
    null,
  ),
];
