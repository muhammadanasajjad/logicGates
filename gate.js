const handlers = {
    AND: (inputs) => [inputs[0] && inputs[1]],
    OR: (inputs) => [inputs[0] || inputs[1]],
    NOT: (inputs) => [!inputs[0]],
    INPUT: (inputs) => [inputs[0]],
    OUTPUT: (inputs) => [inputs[0]],
    HANDLER: (inputs) => {
        // if (inputs.length !== 4) throw new Error("Input must be a 4-bit array");

        // Convert boolean array to binary digits
        let [A, B, C, D] = inputs;

        // Logic for each segment using simplified boolean equations
        const a =
            (!A && !B && !C && !D) || //0
            (!A && B && !C && !D) || //2
            (A && B && !C && !D) || //3
            (A && !B && C && !D) || //5
            (!A && B && C && !D) || //6
            (A && B && C && !D) || //7
            (!A && !B && !C && D) || //8
            (A && !B && !C && D); //9

        const b =
            (!A && !B && !C && !D) || //0
            (A && !B && !C && !D) || //1
            (!A && B && !C && !D) || //2
            (A && B && !C && !D) || //3
            (!A && !B && C && !D) || //4
            (A && B && C && !D) || //7
            (!A && !B && !C && D) || //8
            (A && !B && !C && D); //9

        const c =
            (!A && !B && !C && !D) || //0
            (A && !B && !C && !D) || //1
            (A && B && !C && !D) || //3
            (!A && !B && C && !D) || //4
            (A && !B && C && !D) || //5
            (!A && B && C && !D) || //6
            (A && B && C && !D) || //7
            (!A && !B && !C && D) || //8
            (A && !B && !C && D); //9

        const d =
            (!A && !B && !C && !D) || //0
            (!A && B && !C && !D) || //2
            (A && B && !C && !D) || //3
            (A && !B && C && !D) || //5
            (!A && B && C && !D) || //6
            (!A && !B && !C && D) || //8
            (A && !B && !C && D); //9

        const e =
            (!A && !B && !C && !D) || //0
            (!A && B && !C && !D) || //2
            (!A && B && C && !D) || //6
            (!A && !B && !C && D); //8

        const f =
            (!A && !B && !C && !D) || //0
            (!A && !B && C && !D) || //4
            (A && !B && C && !D) || //5
            (!A && B && C && !D) || //6
            (!A && !B && !C && D) || //8
            (A && !B && !C && D); //9

        const g =
            (!A && B && !C && !D) || //2
            (A && B && !C && !D) || //3
            (!A && !B && C && !D) || //4
            (A && !B && C && !D) || //5
            (!A && B && C && !D) || //6
            (!A && !B && !C && D) || //8
            (A && !B && !C && D); //9

        // Return as a list [a, b, c, d, e, f, g]
        return [a, b, c, d, e, f, g];
    },
};

const inputCounts = {
    AND: 2,
    OR: 2,
    NOT: 1,
    INPUT: 1,
    OUTPUT: 1,
    HANDLER: 4,
};

const outputCounts = {
    AND: 1,
    OR: 1,
    NOT: 1,
    INPUT: 1,
    OUTPUT: 1,
    HANDLER: 7,
};

class Gate {
    constructor(x, y, type, customName = "") {
        this.x = x;
        this.y = y;
        this.inputCount = inputCounts[type];
        this.outputCount = outputCounts[type];
        this.currentInputs = Array.from(
            { length: inputCounts[type] },
            () => false
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
        return createVector(
            this.x - this.width / 2,
            (this.connectorSpacing + this.connectorDiameter) / 2 +
                this.y +
                (this.connectorSpacing + this.connectorDiameter) *
                    (i - this.inputCount / 2)
        );
    }

    outputPos(i) {
        return createVector(
            this.x + this.width / 2,
            (this.connectorSpacing + this.connectorDiameter) / 2 +
                this.y +
                (this.connectorSpacing + this.connectorDiameter) *
                    (i - this.outputCount / 2)
        );
    }

    show(onColour, offColour) {
        push();
        let p = 0.75;
        stroke(this.color[0] * p, this.color[1] * p, this.color[2] * p);
        strokeWeight(3);
        fill(...this.color);
        rectMode(CENTER);
        rect(this.x, this.y, this.width, this.height);
        noStroke();
        text;
        fill(255);
        textAlign(CENTER, CENTER);
        text(this.type, this.x, this.y);

        for (let i = 0; i < this.inputCount; i++) {
            if (this.currentInputs[i]) {
                fill(onColour);
            } else {
                fill(offColour);
            }
            let pos = this.inputPos(i);
            ellipse(
                pos.x,
                pos.y,
                this.connectorDiameter,
                this.connectorDiameter
            );
        }

        for (let i = 0; i < this.outputCount; i++) {
            if (this.currentOutputs[i]) {
                fill(onColour);
            } else {
                fill(offColour);
            }
            let pos = this.outputPos(i);
            ellipse(
                pos.x,
                pos.y,
                this.connectorDiameter,
                this.connectorDiameter
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
