class SegmentedDisplay extends Chip {
    constructor(x, y) {
        let gates = [];
        gates.push(new Gate(x, y, "INPUT"));
        gates.push(new Gate(x, y + 10, "INPUT"));
        gates.push(new Gate(x, y + 20, "INPUT"));
        gates.push(new Gate(x, y + 30, "INPUT"));
        gates.push(new Gate(x, y + 40, "INPUT"));
        gates.push(new Gate(x, y + 50, "INPUT"));
        gates.push(new Gate(x, y + 60, "INPUT"));
        super(x, y, gates, [], "SEGMENTED-DISPLAY");
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
        this.currentInputs[0] ? fill(onColour) : fill(offColour);
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
        this.currentInputs[1] ? fill(onColour) : fill(offColour);
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
        this.currentInputs[2] ? fill(onColour) : fill(offColour);
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
        this.currentInputs[3] ? fill(onColour) : fill(offColour);
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
        this.currentInputs[4] ? fill(onColour) : fill(offColour);
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
        this.currentInputs[5] ? fill(onColour) : fill(offColour);
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
        this.currentInputs[6] ? fill(onColour) : fill(offColour);
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
    }
}
