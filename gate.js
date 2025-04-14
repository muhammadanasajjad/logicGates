const handlers = {
    AND: (inputs) => [[inputs[0][0] && inputs[1][0]]],
    OR: (inputs) => [[inputs[0][0] || inputs[1][0]]],
    NOT: (inputs) => [[!inputs[0][0]]],
    INPUT: (inputs) => [[inputs[0][0]]],
    INPUT2: (inputs) => [[inputs[0][0], inputs[0][1]]],
    INPUT4: (inputs) => [
        [inputs[0][0], inputs[0][1], inputs[0][2], inputs[0][3]],
    ],
    INPUT6: (inputs) => [
        [
            inputs[0][0],
            inputs[0][1],
            inputs[0][2],
            inputs[0][3],
            inputs[0][4],
            inputs[0][5],
        ],
    ],
    INPUT8: (inputs) => [
        [
            inputs[0][0],
            inputs[0][1],
            inputs[0][2],
            inputs[0][3],
            inputs[0][4],
            inputs[0][5],
            inputs[0][6],
            inputs[0][7],
        ],
    ],
    OUTPUT: (inputs) => [[inputs[0][0]]],
    OUTPUT2: (inputs) => [[inputs[0][0], inputs[0][1]]],
    OUTPUT4: (inputs) => [
        [inputs[0][0], inputs[0][1], inputs[0][2], inputs[0][3]],
    ],
    OUTPUT6: (inputs) => [
        [
            inputs[0][0],
            inputs[0][1],
            inputs[0][2],
            inputs[0][3],
            inputs[0][4],
            inputs[0][5],
        ],
    ],
    OUTPUT8: (inputs) => [
        [
            inputs[0][0],
            inputs[0][1],
            inputs[0][2],
            inputs[0][3],
            inputs[0][4],
            inputs[0][5],
            inputs[0][6],
            inputs[0][7],
        ],
    ],
};

const inputCounts = {
    AND: [1, 1],
    OR: [1, 1],
    NOT: [1],
    INPUT: [1],
    INPUT2: [2],
    INPUT4: [4],
    INPUT6: [6],
    INPUT8: [8],
    OUTPUT: [1],
    OUTPUT2: [2],
    OUTPUT4: [4],
    OUTPUT6: [6],
    OUTPUT8: [8],
    HANDLER: [1, 1, 1, 1],
};

const outputCounts = {
    AND: [1],
    OR: [1],
    NOT: [1],
    INPUT: [1],
    INPUT2: [2],
    INPUT4: [4],
    INPUT6: [6],
    INPUT8: [8],
    OUTPUT: [1],
    OUTPUT2: [2],
    OUTPUT4: [4],
    OUTPUT6: [6],
    OUTPUT8: [8],
    HANDLER: [1, 1, 1, 1, 1, 1, 1],
};

class Gate {
    constructor(x, y, type, customName = "") {
        this.x = x;
        this.y = y;
        this.inputCount = inputCounts[type].length;
        this.outputCount = outputCounts[type].length;
        this.currentInputs = Array.from(
            { length: inputCounts[type].length },
            (_, i) => Array(inputCounts[type][i]).fill(false)
        );
        this.type = type;
        this.customName = customName;
        this.handler = handlers[type];
        this.currentOutputs = this.handler(this.currentInputs);

        this.connectorDiameter = 15;
        this.connectorSpacing = 5;
        this.width = textWidth(type) + 15 + 20;
        this.height =
            this.connectorSpacing +
            (this.connectorSpacing + this.connectorDiameter) *
                max(this.inputCount, this.outputCount);
        this.color = [144, 31, 26];
    }

    compute() {
        setTimeout(() => {
            // let outputs = this.currentOutputs;
            this.currentOutputs = this.handler(this.currentInputs);
            // let same = true;
            // for (let i = 0; i < outputs.length; i++) {
            //     if (outputs[i] != this.currentOutputs[i]) {
            //         same = false;
            //         break;
            //     }
            // }
            // if (!same) {
            //     console.log(this.currentOutputs);
            // }
        }, random() * 50);
    }

    inputPos(i) {
        if (this.type.startsWith("INPUT")) {
            let perRow = max(min(4, this.currentInputs[0].length / 2), 2);
            let rows = ceil(this.currentInputs[0].length / perRow);

            return createVector(
                this.x - this.width / 2 + (i % perRow) * this.connectorDiameter,
                this.y +
                    this.connectorDiameter * floor(i / perRow) -
                    ((rows - 1) * this.connectorDiameter) / 2
            );
        }
        return createVector(
            this.x - this.width / 2,
            (this.connectorSpacing + this.connectorDiameter) / 2 +
                this.y +
                (this.connectorSpacing + this.connectorDiameter) *
                    (i - this.inputCount / 2)
        );
    }

    outputPos(i) {
        if (this.type.startsWith("OUTPUT")) {
            let perRow = max(min(4, this.currentOutputs[0].length / 2), 2);
            let rows = ceil(this.currentOutputs[0].length / perRow);

            return createVector(
                this.x +
                    this.width / 2 -
                    (perRow - (i % perRow)) * this.connectorDiameter,
                this.y +
                    this.connectorDiameter * floor(i / perRow) -
                    ((rows - 1) * this.connectorDiameter) / 2
            );
        }
        return createVector(
            this.x + this.width / 2,
            (this.connectorSpacing + this.connectorDiameter) / 2 +
                this.y +
                (this.connectorSpacing + this.connectorDiameter) *
                    (i - this.outputCount / 2)
        );
    }

    showInput(onColour, offColour) {
        let perRow = max(min(4, this.currentInputs[0].length / 2), 2);
        let rows = ceil(this.currentInputs[0].length / perRow);

        let x =
            this.inputPos(0).x -
            this.connectorDiameter / 2 -
            this.connectorSpacing / 2;
        let y =
            this.inputPos(0).y -
            this.connectorDiameter / 2 -
            this.connectorSpacing / 2;
        let w =
            min(4, this.currentInputs[0].length / 2) * this.connectorDiameter +
            this.connectorSpacing;
        let h = rows * this.connectorDiameter + this.connectorSpacing;
        this.height = h;

        push();
        noStroke();
        fill(0);
        rect(x, y, w, h);
        pop();

        push();
        stroke(0);
        strokeWeight(5);
        line(x + w / 2, y + h / 2, this.outputPos(0).x, this.outputPos(0).y);
        pop();

        push();
        fill(0);
        ellipse(
            this.outputPos(0).x,
            this.outputPos(0).y,
            max(this.connectorDiameter, 4.5 * this.currentOutputs[0].length) +
                this.connectorSpacing
        );
        pop();

        for (let i = 0; i < this.currentInputs[0].length; i++) {
            push();
            noStroke();
            if (this.currentInputs[0][i] == true) {
                fill(onColour);
            } else {
                fill(offColour);
            }
            ellipse(
                this.inputPos(i).x,
                this.inputPos(i).y,
                this.connectorDiameter
            );
            pop();
        }

        for (let i = 0; i < this.currentOutputs.length; i++) {
            push();
            noStroke();
            if (this.currentOutputs[i][0] == true) {
                fill(onColour);
            } else {
                fill(offColour);
            }
            ellipse(
                this.outputPos(i).x,
                this.outputPos(i).y,
                max(this.connectorDiameter, 4.5 * this.currentOutputs[0].length)
            );
            pop();
        }
    }

    showOutput(onColour, offColour) {
        let perRow = max(min(4, this.currentOutputs[0].length / 2), 2);
        let rows = ceil(this.currentOutputs[0].length / perRow);

        let x =
            this.outputPos(0).x -
            this.connectorDiameter / 2 -
            this.connectorSpacing / 2;
        let y =
            this.outputPos(0).y -
            this.connectorDiameter / 2 -
            this.connectorSpacing / 2;
        let w =
            min(4, this.currentOutputs[0].length / 2) * this.connectorDiameter +
            this.connectorSpacing;
        let h = rows * this.connectorDiameter + this.connectorSpacing;
        this.height = h;

        push();
        noStroke();
        fill(0);
        rect(x, y, w, h);
        pop();

        push();
        stroke(0);
        strokeWeight(5);
        line(x + w / 2, y + h / 2, this.inputPos(0).x, this.inputPos(0).y);
        pop();

        push();
        fill(0);
        ellipse(
            this.inputPos(0).x,
            this.inputPos(0).y,
            max(this.connectorDiameter, 4.5 * this.currentInputs[0].length) +
                this.connectorSpacing
        );
        pop();

        for (let i = 0; i < this.currentOutputs[0].length; i++) {
            push();
            noStroke();
            if (this.currentOutputs[0][i] == true) {
                fill(onColour);
            } else {
                fill(offColour);
            }
            ellipse(
                this.outputPos(i).x,
                this.outputPos(i).y,
                this.connectorDiameter
            );
            pop();
        }

        for (let i = 0; i < this.currentInputs.length; i++) {
            push();
            noStroke();
            if (this.currentInputs[i][0] == true) {
                fill(onColour);
            } else {
                fill(offColour);
            }
            ellipse(
                this.inputPos(i).x,
                this.inputPos(i).y,
                max(this.connectorDiameter, 4.5 * this.currentInputs[0].length)
            );
            pop();
        }
    }

    show(onColour, offColour) {
        if (this.type.startsWith("INPUT"))
            return this.showInput(onColour, offColour);
        if (this.type.startsWith("OUTPUT"))
            return this.showOutput(onColour, offColour);
        push();
        let p = 0.75;
        stroke(this.color[0] * p, this.color[1] * p, this.color[2] * p);
        strokeWeight(3);
        fill(...this.color);
        rectMode(CENTER);
        rect(this.x, this.y, this.width, this.height);
        noStroke();

        fill(255);
        textAlign(CENTER, CENTER);
        text(this.type, this.x, this.y);

        for (let i = 0; i < this.inputCount; i++) {
            if (this.currentInputs[i][0]) {
                fill(onColour);
            } else {
                fill(offColour);
            }
            let pos = this.inputPos(i);
            ellipse(
                pos.x,
                pos.y,
                max(this.connectorDiameter, 4.5 * this.currentInputs[i].length)
            );
        }

        for (let i = 0; i < this.outputCount; i++) {
            if (this.currentOutputs[i][0]) {
                fill(onColour);
            } else {
                fill(offColour);
            }
            let pos = this.outputPos(i);
            ellipse(
                pos.x,
                pos.y,
                max(this.connectorDiameter, 4.5 * this.currentOutputs[i].length)
            );
        }
        pop();

        if (
            this.customName != "" &&
            mouseX > this.x - this.width / 2 + 7.5 &&
            mouseX < this.x + this.width / 2 - 7.5 &&
            mouseY > this.y - this.height / 2 &&
            mouseY < this.y + this.height / 2
        ) {
            push();
            fill(55, 235);
            rectMode(CENTER);
            rect(mouseX, mouseY, textWidth(this.customName) + 20, 20);

            fill(255);
            textAlign(CENTER, CENTER);
            text(this.customName, mouseX, mouseY);
            pop();
        }
    }
}
