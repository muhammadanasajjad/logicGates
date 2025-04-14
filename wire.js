class Wire {
    constructor(from, fromI, to, toI, midPoints = [], stateCount = 1) {
        this.from = from;
        this.fromI = fromI;
        this.to = to;
        this.toI = toI;

        this.stateCount = stateCount;
        this.travelled = Array(stateCount).fill(0.0);
        this.currentStates = Array(stateCount).fill(false);
        this.travelSpeed = 0.1;

        this.midPoints = midPoints;

        this.onColour = color(233, 50, 69);
        this.offColour = color(51, 24, 25);
    }

    update(gates) {
        for (let i = 0; i < this.currentStates.length; i++) {
            let from = gates[this.from];
            let to = gates[this.to];
            this.travelled[i] += this.travelSpeed;

            let state = from.currentOutputs[this.fromI][i];
            if (this.travelled[i] > 0 && this.currentStates[i] == state) {
                this.travelled[i] = 0.0;
                // this.currentState = !state;
            }
            if (this.travelled[i] >= 1) {
                to.currentInputs[this.toI][i] = state;
                this.currentStates[i] = state;
                this.travelled[i] = 0.0;
            } else if (this.currentStates[i] != state) {
                this.travelled[i] += this.travelSpeed;
                this.travelled[i] = min(this.travelled[i], 1.0);
            }
            if (this.travelled[i] == 0 && to.currentInputs[this.toI] != state) {
                to.currentInputs[this.toI][i] = state;
            }
        }
    }

    show(gates) {
        for (let i = 0; i < this.currentStates.length; i++) {
            let from = gates[this.from];
            let to = gates[this.to];

            let fromPos = from.outputPos(this.fromI);
            let toPos = to.inputPos(this.toI);

            let currentPoints = [fromPos, ...this.midPoints, toPos];

            let previousDir = createVector(0, 0);
            let previousPoint = currentPoints[0];

            let currentDistance = 0;
            for (let j = 0; j < currentPoints.length - 1; j++) {
                let totalDistance = 0;
                for (let k = 0; k < currentPoints.length - 1; k++) {
                    let p1 = currentPoints[k];
                    let p2 = currentPoints[k + 1];
                    totalDistance += dist(p1.x, p1.y, p2.x, p2.y);
                }

                let p1 = currentPoints[j];
                let p2 = currentPoints[j + 1];

                let perpendicularVector = createVector(
                    p1.y - p2.y,
                    p2.x - p1.x
                );
                perpendicularVector.normalize();
                perpendicularVector
                    .mult(4.5)
                    .mult(i - this.currentStates.length / 2 + 0.5);

                push();
                translate(perpendicularVector.x, perpendicularVector.y);

                push();
                strokeWeight(4.9);
                stroke(this.currentStates[i] ? this.onColour : this.offColour);
                strokeJoin(ROUND);

                line(p1.x, p1.y, p2.x, p2.y);

                let thisDistance = dist(p1.x, p1.y, p2.x, p2.y);
                let thisTravelled =
                    (this.travelled[i] * totalDistance - currentDistance) /
                    thisDistance;
                thisTravelled = constrain(thisTravelled, 0, 1);
                let x = lerp(p1.x, p2.x, thisTravelled);
                let y = lerp(p1.y, p2.y, thisTravelled);

                if (thisTravelled > 0.0) {
                    strokeWeight(5);
                    stroke(
                        this.currentStates[i] ? this.offColour : this.onColour
                    );
                    line(p1.x, p1.y, x, y);
                }

                pop();
                currentDistance += dist(p1.x, p1.y, p2.x, p2.y);
                if (frameCount % 100 == 0) {
                    // console.log(totalDistance, currentDistance);
                }
                pop();

                let currentDir = createVector(p2.x - p1.x, p2.y - p1.y);
                let angleBetween = p5.Vector.angleBetween(
                    currentDir,
                    previousDir
                );

                if (
                    (angleBetween < PI &&
                        angleBetween > 0 &&
                        i > this.currentStates.length / 2) ||
                    (angleBetween > -PI &&
                        angleBetween < 0 &&
                        i < this.currentStates.length / 2)
                ) {
                    push();
                    strokeWeight(5);
                    stroke(
                        this.currentStates[i] ? this.onColour : this.offColour
                    );

                    line(
                        previousPoint.x,
                        previousPoint.y,
                        p1.x + perpendicularVector.x,
                        p1.y + perpendicularVector.y
                    );
                    pop();
                }

                previousPoint = createVector(
                    p2.x + perpendicularVector.x,
                    p2.y + perpendicularVector.y
                );
                previousDir = createVector(p2.x - p1.x, p2.y - p1.y);
            }
        }
    }
}
