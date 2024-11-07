import {
  Version,
  FloatType,
  IntType,
  UIntType,
  Range,
  Identifier,
  NumericLiteral,
  FloatLiteral,
  SizeOf,
  Unary,
  Arithmetic,
  ArrayDeclaration,
  ArrayInitializer,
  ArrayReference,
  ArrayReferenceModifier,
  ArrayAccess,
  ClassicalDeclaration,
  AssignmentStatement,
  ProgramBlock,
  SubroutineDefinition,
  IntegerLiteral,
  Parameters,
  ArithmeticOp,
  UnaryOp,
} from "../../../src/qasm3/ast";
import { OpenQASMVersion, OpenQASMMajorVersion } from "../../../src/version";

export const arraysAst = [
  new Version(new OpenQASMVersion(OpenQASMMajorVersion.Version3, 0)),
  new ArrayDeclaration(
    new IntType(new IntegerLiteral(8)),
    [new IntegerLiteral(16)],
    new Identifier("my_ints"),
    null,
  ),
  new ArrayDeclaration(
    new FloatType(new IntegerLiteral(64)),
    [new IntegerLiteral(8), new IntegerLiteral(4)],
    new Identifier("my_doubles"),
    null,
  ),
  new ArrayDeclaration(
    new UIntType(new IntegerLiteral(32)),
    [new IntegerLiteral(4)],
    new Identifier("my_defined_uints"),
    new ArrayInitializer([
      new IntegerLiteral(5),
      new IntegerLiteral(6),
      new IntegerLiteral(7),
      new IntegerLiteral(8),
    ]),
  ),
  new ArrayDeclaration(
    new FloatType(new IntegerLiteral(32)),
    [new IntegerLiteral(4), new IntegerLiteral(2)],
    new Identifier("my_defined_floats"),
    new ArrayInitializer([
      new ArrayInitializer([new FloatLiteral(0.5), new FloatLiteral(0.5)]),
      new ArrayInitializer([new FloatLiteral(1), new FloatLiteral(2)]),
      new ArrayInitializer([
        new Unary(UnaryOp.MINUS, new FloatLiteral(0.4)),
        new FloatLiteral(0.7),
      ]),
      new ArrayInitializer([
        new FloatLiteral(1.3),
        new Unary(UnaryOp.MINUS, new NumericLiteral("2.1e-2")),
      ]),
    ]),
  ),
  new ArrayDeclaration(
    new FloatType(new IntegerLiteral(32)),
    [new IntegerLiteral(2)],
    new Identifier("my_defined_float_row"),
    new ArrayAccess(new Identifier("my_defined_floats"), [
      new IntegerLiteral(0),
    ]),
  ),
  new ClassicalDeclaration(
    new UIntType(new IntegerLiteral(8)),
    new Identifier("DIM_SIZE"),
    new IntegerLiteral(2),
    true,
  ),
  new ArrayDeclaration(
    new IntType(new IntegerLiteral(8)),
    [new Identifier("DIM_SIZE"), new Identifier("DIM_SIZE")],
    new Identifier("all_ones"),
    new ArrayInitializer([
      new ArrayInitializer([
        new Arithmetic(
          ArithmeticOp.PLUS,
          new IntegerLiteral(2),
          new IntegerLiteral(3),
        ),
        new Arithmetic(
          ArithmeticOp.MINUS,
          new IntegerLiteral(4),
          new IntegerLiteral(1),
        ),
      ]),
      new ArrayInitializer([
        new Arithmetic(
          ArithmeticOp.PLUS,
          new IntegerLiteral(3),
          new IntegerLiteral(8),
        ),
        new Arithmetic(
          ArithmeticOp.MINUS,
          new IntegerLiteral(12),
          new IntegerLiteral(4),
        ),
      ]),
    ]),
  ),
  new ClassicalDeclaration(
    new UIntType(new IntegerLiteral(8)),
    new Identifier("a"),
    new ArrayAccess(new Identifier("my_defined_uints"), [
      new IntegerLiteral(0),
    ]),
    false,
  ),
  new ClassicalDeclaration(
    new FloatType(new IntegerLiteral(32)),
    new Identifier("b"),
    new ArrayAccess(new Identifier("my_defined_floats"), [
      new IntegerLiteral(2),
      new IntegerLiteral(1),
    ]),
    false,
  ),
  new AssignmentStatement(
    new ArrayAccess(new Identifier("my_defined_uints"), [
      new IntegerLiteral(1),
    ]),
    new IntegerLiteral(5),
  ),
  new AssignmentStatement(
    new ArrayAccess(new Identifier("my_defined_floats"), [
      new IntegerLiteral(3),
      new IntegerLiteral(0),
    ]),
    new Unary(UnaryOp.MINUS, new FloatLiteral(0.45)),
  ),
  new AssignmentStatement(
    new ArrayAccess(new Identifier("my_defined_uints"), [
      new Arithmetic(
        ArithmeticOp.MINUS,
        new Identifier("a"),
        new IntegerLiteral(1),
      ),
    ]),
    new Arithmetic(
      ArithmeticOp.PLUS,
      new Identifier("a"),
      new IntegerLiteral(1),
    ),
  ),
  new AssignmentStatement(
    new ArrayAccess(new Identifier("my_defined_floats"), [
      new IntegerLiteral(2),
    ]),
    new Identifier("my_defined_float_row"),
  ),
  new AssignmentStatement(
    new ArrayAccess(
      new Identifier("my_defined_floats"),
      new Range(
        new IntegerLiteral(0),
        new IntegerLiteral(1),
        new IntegerLiteral(1),
      ),
    ),
    new ArrayAccess(
      new Identifier("my_defined_floats"),
      new Range(
        new IntegerLiteral(2),
        new IntegerLiteral(3),
        new IntegerLiteral(1),
      ),
    ),
  ),
  new ClassicalDeclaration(
    new UIntType(new IntegerLiteral(32)),
    new Identifier("dimension"),
    new SizeOf(new Identifier("my_defined_uints"), new IntegerLiteral(0)),
    true,
  ),
  new ClassicalDeclaration(
    new UIntType(new IntegerLiteral(32)),
    new Identifier("first_dimension"),
    new SizeOf(new Identifier("my_doubles"), new IntegerLiteral(0)),
    true,
  ),
  new ClassicalDeclaration(
    new UIntType(new IntegerLiteral(32)),
    new Identifier("second_dimension"),
    new SizeOf(new Identifier("my_doubles"), new IntegerLiteral(1)),
    true,
  ),
  new ClassicalDeclaration(
    new UIntType(new IntegerLiteral(32)),
    new Identifier("first_dimension"),
    new SizeOf(new Identifier("my_doubles"), new IntegerLiteral(0)),
    true,
  ),
  new SubroutineDefinition(
    new Identifier("copy_3_bytes"),
    new ProgramBlock([]),
    new Parameters([
      new ArrayReference(
        new ArrayDeclaration(
          new UIntType(new IntegerLiteral(8)),
          [new IntegerLiteral(3)],
          new Identifier("in_array"),
          null,
        ),
        ArrayReferenceModifier.READONLY,
      ),
      new ArrayReference(
        new ArrayDeclaration(
          new UIntType(new IntegerLiteral(8)),
          [new IntegerLiteral(3)],
          new Identifier("out_array"),
          null,
        ),
        ArrayReferenceModifier.MUTABLE,
      ),
    ]),
    null,
  ),
  new SubroutineDefinition(
    new Identifier("multi_dimensional_input"),
    new ProgramBlock([
      new ClassicalDeclaration(
        new UIntType(new IntegerLiteral(32)),
        new Identifier("dimension_0"),
        new SizeOf(new Identifier("my_array"), new IntegerLiteral(0)),
        false,
      ),
      new ClassicalDeclaration(
        new UIntType(new IntegerLiteral(32)),
        new Identifier("dimension_1"),
        new SizeOf(new Identifier("my_array"), new IntegerLiteral(1)),
        false,
      ),
      new ClassicalDeclaration(
        new UIntType(new IntegerLiteral(32)),
        new Identifier("dimension_2"),
        new SizeOf(new Identifier("my_array"), new IntegerLiteral(2)),
        false,
      ),
    ]),
    new Parameters([
      new ArrayReference(
        new ArrayDeclaration(
          new IntType(new IntegerLiteral(32)),
          3,
          new Identifier("my_array"),
          null,
        ),
        ArrayReferenceModifier.READONLY,
      ),
    ]),
    null,
  ),
];
