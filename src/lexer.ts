import { default as Qasm2Lexer } from "./qasm2/lexer";
import { default as Qasm3Lexer } from "./qasm3/lexer";
import { Token as Qasm2Token } from "./qasm2/token";
import { Token as Qasm3Token } from "./qasm3/token";
import { OpenQASMVersion, OpenQASMMajorVersion } from "./version";
import { UnsupportedOpenQASMVersionError } from "./errors";

export function lex(
  qasm: string,
  cursor?: number,
  version?: OpenQASMVersion | OpenQASMMajorVersion | number,
): Array<[Qasm2Token | Qasm3Token, (number | string)?]> {
  let lexer: Qasm2Lexer | Qasm3Lexer;
  if (version instanceof OpenQASMVersion) {
    switch (version.major) {
      case OpenQASMMajorVersion.Version2:
        lexer = new Qasm2Lexer(qasm, cursor);
        break;
      case OpenQASMMajorVersion.Version3:
        lexer = new Qasm3Lexer(qasm, cursor);
        break;
      default:
        throw new UnsupportedOpenQASMVersionError(
          `Unsupported OpenQASM version detected: ${version.major}`,
        );
    }
  } else if (typeof version === "number") {
    switch (version) {
      case 2:
        lexer = new Qasm2Lexer(qasm, cursor);
        break;
      case 3:
        lexer = new Qasm3Lexer(qasm, cursor);
        break;
      default:
        throw new UnsupportedOpenQASMVersionError(
          `Unsupported OpenQASM version detected: ${version}`,
        );
    }
  } else if (version === OpenQASMMajorVersion.Version2) {
    lexer = new Qasm2Lexer(qasm, cursor);
  } else if (version === OpenQASMMajorVersion.Version3) {
    lexer = new Qasm3Lexer(qasm, cursor);
  } else {
    lexer = new Qasm3Lexer(qasm, cursor);
  }
  const tokens = lexer.lex();
  return tokens;
}
