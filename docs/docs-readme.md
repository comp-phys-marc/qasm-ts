# QASM TypeScript Documentation

OpenQASM, the low-level programming language for quantum circuit specification, implemented in TypeScript.

QASM-TS 2.0 is an implementation of a compiler frontend for OpenQASM 2.0 and 3.0. It includes a lexer and a parser of the OpenQASM language. The source is parsed into an Intermediate Representation (IR): an Abstract Syntax Tree (AST) that captures program structure including control flow and data flow.

The package is aimed at enabling implementations of verification and validation software (such as semantic and static analyzers), compilers and more. These tools may be instrumental in the formalization of hybrid quantum-classical computing.

Language documentation is provided by IBM [here](https://openqasm.com).

## Quick Start

### Installation

```bash
npm install qasm-ts
```

### Basic Usage

Parse from an OpenQASM string snippet:

```typescript
import { parseString } from "qasm-ts";

const qasmCode = `
OPENQASM 3.0;
include "stdgates.inc";
qubit[2] q;
h q[0];
cx q[0], q[1];
`;

const ast = parseString(qasmCode);
```

Parse from an OpenQASM file:

```typescript
import { parseFile } from "qasm-ts";

const ast = parseFile("./my-circuit.qasm");

// Specify OpenQASM version explicitly
const ast2 = parseFile("./legacy-circuit.qasm", 2); // OpenQASM 2.0
const ast3 = parseFile("./modern-circuit.qasm", 3); // OpenQASM 3.0
```

### Working with the AST

```typescript
// Get verbose output with class names
const verboseAst = parseString(qasmCode, 3, true);

// Get stringified JSON output
const jsonAst = parseString(qasmCode, 3, false, true);

// Both verbose and stringified
const verboseJsonAst = parseString(qasmCode, 3, true, true);
```

## Example I/O

### Input: `alignment.qasm` ([source](https://github.com/openqasm/openqasm/blob/main/examples/alignment.qasm))

```
include "stdgates.inc";

stretch g;

qubit[3] q;
barrier q;
cx q[0], q[1];
delay[g] q[2];
U(pi/4, 0, pi/2) q[2];
delay[2*g] q[2];
barrier q;

```

### Output: Abstract Syntax Tree

```
[
  Include { filename: '"stdgates.inc"' },
  ClassicalDeclaration {
    classicalType: StretchType {},
    identifier: Identifier { name: 'g' },
    initializer: null,
    isConst: false
  },
  QuantumDeclaration {
    identifier: Identifier { name: 'q' },
    size: IntegerLiteral { value: 3 }
  },
  QuantumBarrier { qubits: [ [Identifier] ] },
  QuantumGateCall {
    quantumGateName: Identifier { name: 'cx' },
    qubits: [ [SubscriptedIdentifier], [SubscriptedIdentifier] ],
    parameters: null,
    modifiers: []
  },
  QuantumDelay {
    duration: Identifier { name: 'g' },
    qubits: [ [SubscriptedIdentifier] ]
  },
  QuantumGateCall {
    quantumGateName: Identifier { name: 'U' },
    qubits: [ [SubscriptedIdentifier] ],
    parameters: Parameters { args: [Array] },
    modifiers: []
  },
  QuantumDelay {
    duration: Arithmetic { op: '*', left: [IntegerLiteral], right: [Identifier] },
    qubits: [ [SubscriptedIdentifier] ]
  },
  QuantumBarrier { qubits: [ [Identifier] ] }
]
```

## API Documentation Navigation

### Core Functions

Start here for the main parsing functions:

- **[parseString](functions/Main_Functions.parseString.html)** - Parse OpenQASM code from a string
- **[parseFile](functions/Main_Functions.parseFile.html)** - Parse OpenQASM code from a file

### Tokenization

Understand the tokenization process and available token types:

- **[OpenQASM 3.0 Tokens](modules/qasm3_token.html)** - Modern OpenQASM token set
- **[OpenQASM 2.0 Tokens](modules/qasm2_token.html)** - Legacy OpenQASM token set

### Lexing

Understand the Lexer:

- **[OpenQASM 3.0 Lexer](modules/qasm3_lexer.html)** - Modern OpenQASM lexer
- **[OpenQASM 2.0 Lexer](modules/qasm2_lexer.html)** - Legacy OpenQASM lexer

### AST Structure

Understand the abstract syntax tree nodes:

- **[OpenQASM 3.0 AST Nodes](modules/qasm3_ast.html)** - Modern OpenQASM syntax tree
- **[OpenQASM 2.0 AST Nodes](modules/qasm2_ast.html)** - Legacy OpenQASM syntax tree

### Parsing

Understand the Parser:

- **[OpenQASM 3.0 Parser](modules/qasm3_parser.html)** - Modern OpenQASM parser
- **[OpenQASM 2.0 Parser](modules/qasm2_parser.html)** - Legacy OpenQASM parser

### Utilities and Internals

- **[Error Handling](modules/Error_Handling.html)** - All error types and their usage
- **[Version Management](modules/Version_Management.html)** - Version detection and handling

Navigate using the sidebar or search functionality to find specific functions and classes.

## New In Version 2.0.0

- Support for the OpenQASM 3.0 spec while retaining OpenQASM 2.0 backwards compatibility.

## Source Code

Feel free to clone, fork, comment or contribute on [GitHub](https://github.com/comp-phys-marc/qasm-ts)!

## References

The original OpenQASM authors:

- Andrew W. Cross, Lev S. Bishop, John A. Smolin, Jay M. Gambetta "Open Quantum Assembly Language" [arXiv:1707.03429](https://web.archive.org/web/20210121114036/https://arxiv.org/abs/1707.03429)
- Andrew W. Cross, Ali Javadi-Abhari, Thomas Alexander, Niel de Beaudrap, Lev S. Bishop, Steven Heidel, Colm A. Ryan, Prasahnt Sivarajah, John Smolin, Jay M. Gambetta, Blake R. Johnson "OpenQASM 3: A broader and deeper quantum assembly language" [arXiv:2104.14722](https://arxiv.org/abs/2104.14722)

Another strongly typed implementation from which this project took some inspiration:

- [Adam Kelly's Rust QASM Parser](https://github.com/libtangle/qasm-rust)

## License

Copyright 2019 Marcus Edwards

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

```http://www.apache.org/licenses/LICENSE-2.0```

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## How to Cite

If you are using QASM-TS for research we appreciate any citations. Please read and cite our pre-print at https://arxiv.org/abs/2412.12578.

```
@misc{kim2024enablingverificationformalizationhybrid,
      title={Enabling the Verification and Formalization of Hybrid Quantum-Classical Computing with OpenQASM 3.0 compatible QASM-TS 2.0}, 
      author={Sean Kim and Marcus Edwards},
      year={2024},
      eprint={2412.12578},
      archivePrefix={arXiv},
      primaryClass={cs.PL},
      url={https://arxiv.org/abs/2412.12578}, 
}
```
