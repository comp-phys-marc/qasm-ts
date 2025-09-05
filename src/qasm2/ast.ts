/**
 * OpenQASM 2.0 Abstract Syntax Tree Node Definitions
 *
 * This module defines the AST node classes for OpenQASM 2.0, which provides
 * a simpler and more limited set of constructs compared to OpenQASM 3.0.
 *
 * OpenQASM 2.0 focuses on:
 * - Basic quantum register (`qreg`) and classical register (`creg`) declarations
 * - Gate definitions and applications
 * - Measurement operations
 * - Simple conditional statements
 * - Basic arithmetic expressions
 *
 * Key limitations compared to 3.0:
 * - No advanced classical types (only registers)
 * - No control flow structures (loops, complex conditionals)
 * - No function definitions or subroutines
 * - Limited expression capabilities
 *
 * @module
 *
 * @example Basic OpenQASM 2.0 constructs
 * ```typescript
 * // Quantum register: qreg q[2];
 * new QReg('q', 2)
 *
 * // Gate application: h q[0];
 * new ApplyGate('h', [['q', 0]], [])
 *
 * // Measurement: measure q[0] -> c[0];
 * new Measure('q', 'c', 0, 0)
 * ```
 */

import { OpenQASMVersion } from "../version";

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
  src_index: number;
  src_register: string;
  dest_index: number;
  dest_register: string;
  constructor(
    src_register: string,
    dest_register: string,
    src_index?: number,
    dest_index?: number,
  ) {
    super();
    this.src_index = src_index != undefined ? src_index : null;
    this.src_register = src_register;
    this.dest_index = dest_index != undefined ? dest_index : null;
    this.dest_register = dest_register;
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
