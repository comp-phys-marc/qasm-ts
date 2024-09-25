import { OpenQASMVersion } from "./version";

/** Base class representing a basic AST node. */
class AstNode {}

/** Class representing the version statement. */
class Version extends AstNode {
  version: OpenQASMVersion;
  constructor(version: OpenQASMVersion) {
    super();
    this.version = version;
  }
}

/** Class representing an include statement. */
class Include extends AstNode {
  filename: string;
  constructor(filename: string) {
    super();
    this.filename = filename;
  }
}

/** Class to represent a statement. */
class Statement extends AstNode {}

/** Class representing a qubit register. */
class QReg extends AstNode {
  size: number;
  id: string;
  constructor(id: string, size: number) {
    super();
    this.id = id;
    this.size = size;
  }
}

/** Class representing a classical register. */
class CReg extends AstNode {
  size: number;
  id: string;
  constructor(id: string, size: number) {
    super();
    this.id = id;
    this.size = size;
  }
}

/** Class representing an identifier. */
class Id extends AstNode {
  id: string;
  constructor(id: string) {
    super();
    this.id = id;
  }
}

/** Class representing a barrier. */
class Barrier extends AstNode {
  index: number;
  register: string;
  constructor(register: string, index?: number) {
    super();
    this.index = index || null;
    this.register = register;
  }
}

/** Class representing a variable. */
class Variable extends AstNode {
  value: string;
  constructor(value: string) {
    super();
    this.value = value || null;
  }
}

/** Class representing a measurement. */
class Measure extends AstNode {
  src_index: number | null;
  src_register: string;
  dest_index: number | null;
  dest_register: string;
  constructor(
    src_register: string,
    dest_register: string,
    src_index?: number | null,
    dest_index?: number | null,
  ) {
    super();
    this.src_register = src_register;
    this.dest_register = dest_register;
    this.src_index = src_index ?? null;
    this.dest_index = dest_index ?? null;
  }
}

/** Class representing a gate application. */
class ApplyGate extends AstNode {
  name: string;
  qubits: Array<[string, number?]>;
  params: Array<AstNode>;
  constructor(
    name: string,
    qubits: Array<[string, number?]>,
    params: Array<AstNode>,
  ) {
    super();
    this.name = name;
    this.qubits = qubits;
    this.params = params;
  }
}

/** Class representing a gate. */
class Gate extends AstNode {
  name: string;
  registers: Array<string>;
  params: Array<string>;
  nodes: Array<AstNode>;
  constructor(
    name: string,
    registers: Array<string>,
    params: Array<string>,
    nodes: Array<AstNode>,
  ) {
    super();
    this.name = name;
    this.registers = registers;
    this.params = params;
    this.nodes = nodes;
  }
}

/** Class representing an opaque gate declaration (only available in OpenQASM 2.x versions) */
class Opaque extends AstNode {
  name: string;
  qubits: Array<[string, number?]>;
  params: Array<string>;
  constructor(
    name: string,
    qubits: Array<[string, number?]>,
    params: Array<string> = [],
  ) {
    super();
    this.name = name;
    this.qubits = qubits;
    this.params = params;
  }
}

/** TODO : Add new AstNode subclass for the `ctrl @` modifier called ControlledGate that
 * would have an attribute of single qubit gate. When parsing, expect next tokens to be
 * a single qubit gate. Qiskit adds it to the applygate, check their impelemntation also. */

/** TODO : expression, check https://github.com/comp-phys-marc/blackbird-ts/blob/master/src/ast.ts#L116 */

/** Class representing conditional. */
class If extends AstNode {
  register: string;
  param: number;
  gate: AstNode;
  constructor(register: string, param: number, gate: AstNode) {
    super();
    this.register = register;
    this.param = param;
    this.gate = gate;
  }
}

/** Class representing expressions. */
class Expression extends AstNode {}

/** Class representing a range expression. */
class Range extends Expression {
  start: number;
  end: number;
  step: number;
  constructor(start: number, end: number, step: number) {
    super();
    this.start = start;
    this.end = end;
    this.step = step;
  }
}

/** Class representing a unary operator. */
class Unary extends Expression {
  static Op = class {
    static LOGIC_NOT = "!";
    static BIT_NOT = "~";
  };
  op: string;
  operand: Expression;
}

/** Class representing a binary operator. */
class Binary extends Expression {
  static Op = class {
    static BIT_AND = "&";
    static BIT_OR = "|";
    static BIT_XOR = "^";
    static LOGIC_AND = "&&";
    static LOGIC_OR = "||";
    static LESS = "<";
    static LESS_EQUAL = "<=";
  };
}

/** Class representing minus. */
class Minus extends AstNode {}

/** Class representing plus. */
class Plus extends AstNode {}

/** Class representing times. */
class Times extends AstNode {}

/** Class representing power. */
class Power extends AstNode {}

/** Class representing division. */
class Divide extends AstNode {}

/** Class representing pi. */
class Pi extends AstNode {}

/** Class representing the square root. */
class Sqrt extends AstNode {}

/** Class representing natural logarithm. */
class Ln extends AstNode {}

/** Class representing exponentiation. */
class Exp extends AstNode {}

/** Class representing tagnent. */
class Tan extends AstNode {}

/** Class representing cosine. */
class Cos extends AstNode {}

/** Class representing sine. */
class Sin extends AstNode {}

/** Class representing an integer. */
class NNInteger extends AstNode {
  value: number;
  constructor(value: number) {
    super();
    this.value = value;
  }
}

/** Class representing a real. */
class Real extends AstNode {
  value: number;
  constructor(value: number) {
    super();
    this.value = value;
  }
}

export {
  AstNode,
  Version,
  Include,
  Statement,
  Expression,
  Range,
  Unary,
  QReg,
  CReg,
  Barrier,
  Measure,
  ApplyGate,
  Gate,
  Opaque,
  If,
  Id,
  Divide,
  Plus,
  Minus,
  Times,
  Power,
  Sin,
  Cos,
  Tan,
  Exp,
  Ln,
  Sqrt,
  Pi,
  NNInteger,
  Real,
  Variable,
};
