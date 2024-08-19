/** Class representing a bad argument exception. */
class BadArgumentError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = BadArgumentError.name;
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

/** Class representing an unsupported OpenQASM version exception. */
class UnsupportedOpenQASMVersionError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = UnsupportedOpenQASMVersionError.name;
  }
}

export {
  BadArgumentError,
  BadCregError,
  BadQregError,
  BadConditionalError,
  BadBarrierError,
  BadMeasurementError,
  BadGateError,
  BadEqualsError,
  BadParameterError,
  MissingSemicolonError,
  UnsupportedOpenQASMVersionError,
};
