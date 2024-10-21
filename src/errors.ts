/** Class representing a bad argument exception. */
class BadArgumentError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = BadArgumentError.name;
  }
}

/** Class representing a bad include statement */
class BadIncludeError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = BadIncludeError.name;
  }
}

/** Class representing a bad quantum register exception. */
class BadQregError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = BadQregError.name;
  }
}

/** Class representing a bad equality exception. */
class BadEqualsError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = BadEqualsError.name;
  }
}

/** Class representing a bad classical register exception. */
class BadCregError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = BadCregError.name;
  }
}

/** Class representing a bad conditional exception. */
class BadConditionalError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = BadConditionalError.name;
  }
}

/** Class representing a bad barrier exception. */
class BadBarrierError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = BadBarrierError.name;
  }
}

/** Class representing a bad measurement exception. */
class BadMeasurementError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = BadMeasurementError.name;
  }
}

/** Class representing a bad gate exception. */
class BadGateError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = BadGateError.name;
  }
}

/** Class representing a bad parameter exception. */
class BadParameterError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = BadParameterError.name;
  }
}

/** Class representing a missing semicolon exception. */
class MissingSemicolonError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = MissingSemicolonError.name;
  }
}

/** Class representing a missing opening or closing parenthesis, bracket, or curly brakcet. */
class MissingBraceError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = MissingSemicolonError.name;
  }
}

/** Class representing an unsupported OpenQASM version exception. */
class UnsupportedOpenQASMVersionError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = UnsupportedOpenQASMVersionError.name;
  }
}

/** Class representing an error parsing an expected string literal. */
class BadStringLiteralError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = BadStringLiteralError.name;
  }
}

/** Class representing an error parsing scalar types. */
class BadClassicalTypeError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = BadClassicalTypeError.name;
  }
}

/** Class representing an error parsing an expression. */
class BadExpressionError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = BadExpressionError.name;
  }
}

/** Class representing an error in defining or calling a custom subroutine. */
class BadSubroutineError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = BadSubroutineError.name;
  }
}

/** Class representing a bad loop statement declaration. */
class BadLoopError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = BadLoopError.name;
  }
}

/** Class representing a bad quantum instruction. */
class BadQuantumInstructionError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = BadQuantumInstructionError.name;
  }
}

/** Type for returning an error constructor. */
type ReturnErrorConstructor = new (message?: string) => Error;

export {
  BadArgumentError,
  BadIncludeError,
  BadCregError,
  BadQregError,
  BadConditionalError,
  BadBarrierError,
  BadMeasurementError,
  BadGateError,
  BadEqualsError,
  BadParameterError,
  MissingSemicolonError,
  MissingBraceError,
  UnsupportedOpenQASMVersionError,
  BadStringLiteralError,
  BadClassicalTypeError,
  BadExpressionError,
  BadSubroutineError,
  BadLoopError,
  BadQuantumInstructionError,
  ReturnErrorConstructor,
};
