class ConverterChip extends Chip {
    constructor(x, y, from, to) {
        let gates = [];
        if (from > to) {
            gates.push(new Gate(0, 0, "INPUT" + from));

            for (let i = 0; i < from / to; i++) {
                gates.push(new Gate(0, i * 10, "OUTPUT" + to));
            }
        } else {
            gates.push(new Gate(0, 0, "OUTPUT" + to));

            for (let i = 0; i < to / from; i++) {
                gates.push(new Gate(0, i * 10, "INPUT" + from));
            }
        }
        super(x, y, gates, [], "CONVERTER-" + from + "-" + to);

        this.fromConverter = from;
        this.toConverter = to;
    }

    compute() {
        for (let i = 0; i < this.inputCount; i++) {
            let index = this.inputIndices[i];
            this.subGates[index].currentInputs = [this.currentInputs[i]];
        }

        let tempOutputs = Array.from({ length: this.outputCount }, () =>
            Array(this.toConverter).fill(false)
        );

        for (let i = 0; i < this.inputCount; i++) {
            for (let j = 0; j < this.currentInputs[i].length; j++) {
                let globalIndex = i * this.currentInputs[i].length + j;
                let newLocalI = Math.floor(globalIndex / this.toConverter); // Adjusted this to use `this.toConverter`
                let newLocalJ = globalIndex % this.toConverter; // Adjusted this to use `this.toConverter`

                // Check bounds to prevent out-of-range errors
                if (
                    newLocalI < this.outputCount &&
                    newLocalJ < this.toConverter
                ) {
                    tempOutputs[newLocalI][newLocalJ] =
                        this.currentInputs[i][j];
                }
            }
        }

        this.currentOutputs = tempOutputs;

        for (let i = 0; i < this.outputCount; i++) {
            let index = this.outputIndices[i];
            this.subGates[index].currentInputs = [this.currentOutputs[i]];
        }
    }
}
