# QASM TypeScript

![NPM Downloads](https://img.shields.io/npm/dy/qasm-ts)


OpenQASM, the low-level programming language for quantum circuit specification, implemented in TypeScript.

Language documentation is provided by IBM [here](https://github.com/Qiskit/openqasm/blob/master/spec/qasm2.rst).

## New in Version 2.0.0

- Support for the OpenQASM 3.0 spec while retaining OpenQASM 2.0 backwards compatability.

## Usage

Import the parse function or parseString function from the package.

```ts
import { parseFile, parseString } from 'qasm-ts';
```

`parseFile` can be called with a file path to a `.qasm` file. It will parse the file and return the abstract syntax tree representation. `parseFile` can also take 3 optional parameters: 
1. `version`: A `number`, `OpenQASMVersion`, or `OpenQASMMajorVersion` to specify whether to use the Qasm 2 or 3 lexer/parser (defaults to version 3).
2. `verbose`: Whether to return verbose objects that includes an extra key for each node's class name (defaults to `false`).
3. `stringify`: Whether to stringify and format the return object (defaults to `false`).

```ts
let ast = parseFile("<file-path>");
```

`parseString` should be called with a string of QASM code. It will parse the code and return the abstract syntax tree representation. `parseString` also takes the same optional arguments as `parseFile`.

```ts
let ast = parseString("<qasm-string>");
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

Run with: `const ast = parseFile("./alignment.qasm", 3);`.

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

## Source code

Feel free to clone, fork, comment or contribute on [GitHub](https://github.com/comp-phys-marc/qasm-ts)!

## Transpiling

```
tsc src/*.ts --outDir dist
```

## Installing dependencies

```
npm install
```

## Run Unit Tests, Conformance Tests

```
npm test
```

## References

The original OpenQASM authors:

- Andrew W. Cross, Lev S. Bishop, John A. Smolin, Jay M. Gambetta "Open Quantum Assembly Language" [arXiv:1707.03429](https://web.archive.org/web/20210121114036/https://arxiv.org/abs/1707.03429).
- Andrew W. Cross, Ali Javadi-Abhari, Thomas Alexander, Niel de Beaudrap, Lev S. Bishop, Steven Heidel, Colm A. Ryan, Prasahnt Sivarajah, John Smolin, Jay M. Gambetta, Blake R. Johnson "OpenQASM 3: A broader and deeper quantum assembly language" [arXiv:2104.14722](https://arxiv.org/abs/2104.14722)

Another strongly typed implementation from which this project took some inspiration:

- [Adam Kelly's Rust QASM Parser](https://github.com/libtangle/qasm-rust) 

## License

Copyright 2019 Marcus Edwards

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

```
http://www.apache.org/licenses/LICENSE-2.0
```

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
