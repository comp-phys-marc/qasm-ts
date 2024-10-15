import { Token as Qasm2Token } from "./qasm2/token";
import { Token as Qasm3Token } from "./qasm3/token";
import { default as Qasm2Parser } from "./qasm2/parser";
import { default as Qasm3Parser } from "./qasm3/parser";
import { OpenQASMVersion, OpenQASMMajorVersion } from "./version";
import { UnsupportedOpenQASMVersionError } from "./errors";

export function parse(
  tokens: Array<[Qasm2Token | Qasm3Token, (number | string)?]>,
  version?: OpenQASMVersion | OpenQASMMajorVersion | number,
) {
  let parser: Qasm2Parser | Qasm3Parser;
  let castTokens:
    | Array<[Qasm2Token, (number | string)?]>
    | Array<[Qasm3Token, (number | string)?]>;
  if (version instanceof OpenQASMVersion) {
    switch (version.major) {
      case OpenQASMMajorVersion.Version2:
        castTokens = tokens as Array<[Qasm2Token, (number | string)?]>;
        parser = new Qasm2Parser(castTokens);
        break;
      case OpenQASMMajorVersion.Version3:
        castTokens = tokens as Array<[Qasm2Token, (number | string)?]>;
        parser = new Qasm2Parser(castTokens);
        break;
      default:
        throw new UnsupportedOpenQASMVersionError(
          `Unsupported OpenQASM version detected: ${version.major}`,
        );
    }
  } else if (typeof version === "number") {
    switch (version) {
      case 2:
        castTokens = tokens as Array<[Qasm2Token, (number | string)?]>;
        parser = new Qasm2Parser(castTokens);
        break;
      case 3:
        castTokens = tokens as Array<[Qasm3Token, (number | string)?]>;
        parser = new Qasm3Parser(castTokens);
        break;
      default:
        throw new UnsupportedOpenQASMVersionError(
          `Unsupported OpenQASM version detected: ${version}`,
        );
    }
  } else if (version === OpenQASMMajorVersion.Version2) {
    castTokens = tokens as Array<[Qasm2Token, (number | string)?]>;
    parser = new Qasm2Parser(castTokens);
  } else if (version === OpenQASMMajorVersion.Version3) {
    castTokens = tokens as Array<[Qasm3Token, (number | string)?]>;
    parser = new Qasm3Parser(castTokens);
  } else {
    castTokens = tokens as Array<[Qasm3Token, (number | string)?]>;
    parser = new Qasm3Parser(castTokens);
  }
  const ast = parser.parse();
  return ast;
}
