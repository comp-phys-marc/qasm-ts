/**
 * OpenQASM version detection and management utilities
 *
 * Handles version detection from QASM source code and provides utilities
 * for working with different OpenQASM versions. Supports automatic version
 * detection from OPENQASM statements and manual version specification.
 *
 * @module Version Management
 *
 * @example Version detection
 * ```typescript
 * const version = new OpenQASMVersion(3, 0);
 * console.log(version.toString()); // "3.0"
 * console.log(version.isVersion3()); // true
 * ```
 */

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
   * @param major - The OpenQASM major version. (optional)
   * @param minor - The OpenQASM minor version (optional)
   */
  constructor(major?: OpenQASMMajorVersion, minor?: number) {
    this.major = major ? major : OpenQASMMajorVersion.Version3;
    this.minor = minor ? minor : 0;
  }

  /** Returns the version as a formatted string. */
  toString(): string {
    return `${this.major}.${this.minor}`;
  }

  /** Returns whether the version is 3.x */
  isVersion3(): boolean {
    if (this.major === OpenQASMMajorVersion.Version3) {
      return true;
    }
    return false;
  }

  /** Returns whether the version is 2.x */
  isVersion2(): boolean {
    if (this.major === OpenQASMMajorVersion.Version2) {
      return true;
    }
    return false;
  }
}

export { OpenQASMMajorVersion, OpenQASMVersion };
