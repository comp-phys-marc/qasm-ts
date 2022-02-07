import { ApplyGate, Measure, QReg } from "../../../src/ast";

export default [ 
    new QReg('q', 5),
    new QReg('c', 5),
    [ new ApplyGate('x', [['q',4]], []) ],
    [ new ApplyGate('h', [['q',3]], []) ],
    [ new ApplyGate('h', [['q',4]], []) ],
    [ new ApplyGate('cx', [['q',3],['q',4]], []) ],
    [ new ApplyGate('h', [['q',3]], []) ],
    new Measure('q', 'c', 3, 3)
];