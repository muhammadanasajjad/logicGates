const HANDLER = (inputs) => {
    // Convert boolean array to binary digits
    let [[A, B, C, D]] = inputs;

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

    return [[a], [b], [c], [d], [e], [f], [g]];
};

class SegmentedDisplay extends Chip {
    constructor(x, y) {
        let gates = [];
        gates.push(new Gate(0, 0, "INPUT4"));
        super(x, y, gates, [], "SEGMENTED-DISPLAY");

        this.handlerOutputs = HANDLER(this.currentInputs);
        this.height = 150;
    }

    compute() {
        super.compute();
        this.handlerOutputs = HANDLER(this.currentInputs);
    }

    show(onColour, offColour) {
        super.show(onColour, offColour);
        let w = this.width - 30;
        let h = this.height - 20;

        push();
        fill(0);
        stroke(20);
        strokeWeight(5);
        rectMode(CENTER);
        rect(this.x, this.y, w, h);
        pop();

        let pillW = w / 8;
        let pillH = h / 8;
        let thickness = 10;

        // console.log(this.currentInputs);

        push();
        this.handlerOutputs[0][0] ? fill(onColour) : fill(offColour);
        translate(this.x, this.y - 2 * pillH - 10);
        beginShape();
        vertex(-pillW - thickness / 2, 0);
        vertex(-pillW, -thickness / 2);
        vertex(pillW, -thickness / 2);
        vertex(pillW + thickness / 2, 0);
        vertex(pillW, thickness / 2);
        vertex(-pillW, thickness / 2);
        endShape(CLOSE);
        pop();

        push();
        this.handlerOutputs[1][0] ? fill(onColour) : fill(offColour);
        translate(this.x + pillW + 5, this.y - pillH - 5);
        rotate(PI / 2);
        beginShape();
        vertex(-pillH - thickness / 2, 0);
        vertex(-pillH, -thickness / 2);
        vertex(pillH, -thickness / 2);
        vertex(pillH + thickness / 2, 0);
        vertex(pillH, thickness / 2);
        vertex(-pillH, thickness / 2);
        endShape(CLOSE);
        pop();

        push();
        this.handlerOutputs[2][0] ? fill(onColour) : fill(offColour);
        translate(this.x + pillW + 5, this.y + pillH + 5);
        rotate(PI / 2);
        beginShape();
        vertex(-pillH - thickness / 2, 0);
        vertex(-pillH, -thickness / 2);
        vertex(pillH, -thickness / 2);
        vertex(pillH + thickness / 2, 0);
        vertex(pillH, thickness / 2);
        vertex(-pillH, thickness / 2);
        endShape(CLOSE);
        pop();

        push();
        this.handlerOutputs[3][0] ? fill(onColour) : fill(offColour);
        translate(this.x, this.y + 2 * pillH + 10);
        beginShape();
        vertex(-pillW - thickness / 2, 0);
        vertex(-pillW, -thickness / 2);
        vertex(pillW, -thickness / 2);
        vertex(pillW + thickness / 2, 0);
        vertex(pillW, thickness / 2);
        vertex(-pillW, thickness / 2);
        endShape(CLOSE);
        pop();

        push();
        this.handlerOutputs[4][0] ? fill(onColour) : fill(offColour);
        translate(this.x - pillW - 5, this.y + pillH + 5);
        rotate(PI / 2);
        beginShape();
        vertex(-pillH - thickness / 2, 0);
        vertex(-pillH, -thickness / 2);
        vertex(pillH, -thickness / 2);
        vertex(pillH + thickness / 2, 0);
        vertex(pillH, thickness / 2);
        vertex(-pillH, thickness / 2);
        endShape(CLOSE);
        pop();

        push();
        this.handlerOutputs[5][0] ? fill(onColour) : fill(offColour);
        translate(this.x - pillW - 5, this.y - pillH - 5);
        rotate(PI / 2);
        beginShape();
        vertex(-pillH - thickness / 2, 0);
        vertex(-pillH, -thickness / 2);
        vertex(pillH, -thickness / 2);
        vertex(pillH + thickness / 2, 0);
        vertex(pillH, thickness / 2);
        vertex(-pillH, thickness / 2);
        endShape(CLOSE);
        pop();

        push();
        this.handlerOutputs[6][0] ? fill(onColour) : fill(offColour);
        translate(this.x, this.y);
        beginShape();
        vertex(-pillW - thickness / 2, 0);
        vertex(-pillW, -thickness / 2);
        vertex(pillW, -thickness / 2);
        vertex(pillW + thickness / 2, 0);
        vertex(pillW, thickness / 2);
        vertex(-pillW, thickness / 2);
        endShape(CLOSE);
        pop();

        this.showLabel();
    }
}
