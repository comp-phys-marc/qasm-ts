# QASM TypeScript

OpenQASM, the low-level programming language for quantum circuit specification, implemented in TypeScript.

Language documentation is provided by IBM [here](https://github.com/Qiskit/openqasm/blob/master/spec/qasm2.rst).

## New in Version 1.1.0

- Checking for invalid code structure
- Supporting custom gates
- Rejecting unsupported gates
- Better parameter parsing
- Added conformance tests
- Found and fixed bugs related to conformity
- Jasmine unit tests
- Lexing string literals

## New in Latest Subversion

- Updated readme.

## Usage

Import the parse function or parseString function from the package.

```
import { parse, parseString } from 'qasm-ts';
```

`parse` can be called with a file path to a `.qasm` file. It will parse the file and return the abstract syntax tree representation.

```
let ast = parse(<file-path>);
```

`parseString` should be called with a string of QASM code. It will parse the code and return the abstract syntax tree representation.

```
let ast = parseString(<qasm-string>);
```

## Example I/O

### Input: Deutsch_Algorithm.qasm

```
// Implementation of Deutsch algorithm with two qubits for f(x)=x
OPENQASM 2.0;
include "qelib1.inc";

qreg q[5];
creg c[5];

x q[4];
h q[3];
h q[4];
cx q[3],q[4];
h q[3];
measure q[3] -> c[3];
```

### Output: Abstract Syntax Tree

```
[ QReg { id: 'q', size: 5 },
  QReg { id: 'c', size: 5 },
  [ ApplyGate { name: 'x', qubits: [['q',4]], params: [] } ],
  [ ApplyGate { name: 'h', qubits: [['q',3]], params: [] } ],
  [ ApplyGate { name: 'h', qubits: [['q',4]], params: [] } ],
  [ ApplyGate { name: 'cx', qubits: [['q',3],['q',4]], params: [] } ],
  [ ApplyGate { name: 'h', qubits: [['q',3]], params: [] } ],
  Measure {
    src_index: 3,
    src_register: 'q',
    dest_index: 3,
    dest_register: 'c' 
  } ]
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

- Andrew W. Cross, Lev S. Bishop, John A. Smolin, Jay M. Gambetta "Open Quantum Assembly Language" [arXiv:1707.03429](http://web.archive.org/web/20210121114036/https://arxiv.org/abs/1707.03429).

Another strongly typed implementation from which this project took some inspiration:

- [Adam Kelly's Rust QASM Parser](https://github.com/libtangle/qasm-rust) 

## License

Copyright 2019 Marcus Edwards

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

```
http://www.apache.org/licenses/LICENSE-2.0
```

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.