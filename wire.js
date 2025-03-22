class Wire {
    constructor(from, fromI, to, toI, midPoints = []) {
        this.from = from;
        this.fromI = fromI;
        this.to = to;
        this.toI = toI;

        this.travelled = 0;
        this.currentState = false;
        this.travelSpeed = 0.1;

        this.midPoints = midPoints;
    }

    update(gates) {
        let from = gates[this.from];
        let to = gates[this.to];
        this.travelled += this.travelSpeed;

        let state = from.currentOutputs[this.fromI];
        if (this.travelled > 0 && this.currentState == state) {
            this.travelled = 0.0;
            // this.currentState = !state;
        }
        if (this.travelled >= 1) {
            to.currentInputs[this.toI] = state;
            this.currentState = state;
            this.travelled = 0.0;
        } else if (this.currentState != state) {
            this.travelled += this.travelSpeed;
            this.travelled = min(this.travelled, 1.0);
        }
        if (this.travelled == 0 && to.currentInputs[this.toI] != state) {
            to.currentInputs[this.toI] = state;
        }
    }

    show(gates, onColour, offColour) {
        let from = gates[this.from];
        let to = gates[this.to];

        let fromPos = from.outputPos(this.fromI);
        let toPos = to.inputPos(this.toI);

        let currentPoints = [fromPos, ...this.midPoints, toPos];

        let totalDistance = 0;
        for (let i = 0; i < currentPoints.length - 1; i++) {
            let p1 = currentPoints[i];
            let p2 = currentPoints[i + 1];
            totalDistance += dist(p1.x, p1.y, p2.x, p2.y);
        }

        let currentDistance = 0;
        for (let i = 0; i < currentPoints.length - 1; i++) {
            let p1 = currentPoints[i];
            let p2 = currentPoints[i + 1];

            push();
            strokeCap(ROUND);
            strokeWeight(4.9);
            stroke(this.currentState ? onColour : offColour);

            line(p1.x, p1.y, p2.x, p2.y);

            let thisDistance = dist(p1.x, p1.y, p2.x, p2.y);
            let thisTravelled =
                (this.travelled * totalDistance - currentDistance) /
                thisDistance;
            thisTravelled = constrain(thisTravelled, 0, 1);
            let x = lerp(p1.x, p2.x, thisTravelled);
            let y = lerp(p1.y, p2.y, thisTravelled);

            if (thisTravelled > 0.0) {
                strokeWeight(5);
                stroke(this.currentState ? offColour : onColour);
                line(p1.x, p1.y, x, y);
            }

            pop();
            currentDistance += dist(p1.x, p1.y, p2.x, p2.y);
            if (frameCount % 100 == 0) {
                // console.log(totalDistance, currentDistance);
            }
        }
    }
}
