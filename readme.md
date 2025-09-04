# QASM TypeScript

![NPM Downloads](https://img.shields.io/npm/dy/qasm-ts)


OpenQASM, the low-level programming language for quantum circuit specification, implemented in TypeScript.

QASM-TS 2.0 is an implementation of a compiler frontend for OpenQASM 2.0 and 3.0. It includes a lexer and a parser of the OpenQASM language. The source is parsed into an Intermediate Representation (IR): an Abstract Syntax Tree (AST) that captures program structure including control flow and data flow.

The package is aimed at enabling implementations of verification and validation software (such as semantic and static analyzers), compilers and more. These tools may be instrumental in the formalization of hybrid quantum-classical computing.

Language documentation is provided by IBM [here](https://openqasm.com).

## New in Version 2.0.0

- Support for the OpenQASM 3.0 spec while retaining OpenQASM 2.0 backwards compatibility.

## Usage

Import the parse function or parseString function from the package.

```ts
import { parseFile, parseString } from 'qasm-ts';
```

`parseFile` can be called with a `String` file path to a `.qasm` file. It will parse the file and return the abstract syntax tree representation. `parseFile` can also take 3 optional parameters: 
1. `version`: A `number`, `OpenQASMVersion`, or `OpenQASMMajorVersion`. Specifies whether to use the Qasm 2 or 3 lexer/parser (defaults to version 3).
2. `verbose`: A `Boolean`. Whether to return verbose objects that includes an extra key for each node's class name (defaults to `false`).
3. `stringify`: A `Boolean`. Whether to stringify and format the return object (defaults to `false`).

```ts
let ast = parseFile("<file-path>");
```

`parseString` should be called with a `String` of QASM code. It will parse the code and return the abstract syntax tree representation. `parseString` also takes the same optional arguments as `parseFile`.

```ts
let ast = parseString("<qasm-string>");
```

The return type for both `parseFile` and `parseString` is `Array<AstNode>`, unless the `stringify` parameter is `true`, in which case the return is a `String`.

The parser is able to recognize and handle 19 distinct types of syntax errors, which are defined and
exported in `errors.ts`. While this is not an advanced semantic or static analysis, it should enable 
users to basically validate their OpenQASM 2.0 or 3.0 code.

Comprehensive API docs can be found in the `docs/` directory.

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

To reproduce this output, you could run the following script in the directory where `alignment.qasm` is located.

```
import { parseFile } from 'qasm-ts';

const ast = parseFile("./alignment.qasm", 3);

console.log(ast);
```

To run TypeScript files, you can use any number of compilers, but we recommend `ts-node`. For more information on `ts-node`, refer to [the docs](https://www.npmjs.com/package/ts-node).

```
ts-node script.ts
```

## Source code

Feel free to clone, fork, comment or contribute on [GitHub](https://github.com/comp-phys-marc/qasm-ts)!

## Contributing

To get started contributing to QASM-TS, please see the open issues for a place to start.
Alternatively, you are welcome to create any issues which you feel may capture changes, improvements or additions to the package that would be useful. These may be bug reports or enhancement requests. These will be reviewed in a timely manner by a maintainer. If you are able to implement any desired functionality or bug fixes yourself, we also welcome and promise to review any pull requests. Please simply fork the repository and create a branch in your fork with the changes in question. When you create your pull request, make sure to target our repo.

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

## Run benchmarks

To run benchmarks that compare this package's performance against pre-existing ANTLR and Rust based parsers, see the [benchmarking repo](https://github.com/seankim658/qasm-parser-testing) and its instructions.

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
