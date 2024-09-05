/** Enum representing the major OpenQASM versions. */
enum OpenQASMMajorVersion {
  Version2 = 2,
  Version3 = 3,
}

/** Class representing the OpenQASM version. */
class OpenQASMVersion {
  /** The major OpenQASM version. */
  major: OpenQASMMajorVersion;
  /** The minor OpenQASM version. */
  minor: number;

  /**
   * Creates an OpenQASMVersion instance.
   * @param major - The OpenQASM major version.
   * @param minor - The OpenQASM minor version (optional).
   */
  constructor(major: OpenQASMMajorVersion, minor?: number) {
    this.major = major;
    this.minor = minor ? minor : 0;
  }

  /** Returns the version as a formatted string. */
  toString(): string {
    return `${this.major}.${this.minor}`;
  }
}

export { OpenQASMMajorVersion, OpenQASMVersion };
