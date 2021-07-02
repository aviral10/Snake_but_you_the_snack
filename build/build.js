class Box {
    constructor(i, j) {
        this.hasFood = false;
        this.isDisabled = false;
        this.row = i;
        this.col = j;
    }
    draw() {
        fill(100);
        stroke(5);
        square(this.col * GLOBAL_SIZE, this.row * GLOBAL_SIZE, GLOBAL_SIZE);
    }
}
const pq_top = 0;
const PARENT = (i) => ((i + 1) >>> 1) - 1;
const left = (i) => (i << 1) + 1;
const right = (i) => (i + 1) << 1;
function comp(a, b) {
    if (a.f == b.f) {
        return a.h < b.h;
    }
    return a.f < b.f;
}
class Priority_Queue {
    constructor(comparator = comp) {
        this._heap = [];
        this._comparator = comparator;
    }
    size() {
        return this._heap.length;
    }
    empty() {
        return this.size() == 0;
    }
    top() {
        return this._heap[pq_top];
    }
    insert(...values) {
        values.forEach((value) => {
            this._heap.push(value);
            this._siftUp();
        });
        return this.size();
    }
    pop() {
        const poppedValue = this.top();
        const bottom = this.size() - 1;
        if (bottom > pq_top) {
            this._swap(pq_top, bottom);
        }
        this._heap.pop();
        this._siftDown();
        return poppedValue;
    }
    replace(value) {
        const replacedValue = this.top();
        this._heap[pq_top] = value;
        this._siftDown();
        return replacedValue;
    }
    _greater(i, j) {
        return this._comparator(this._heap[i], this._heap[j]);
    }
    _swap(i, j) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }
    _siftUp() {
        let node = this.size() - 1;
        while (node > pq_top && this._greater(node, PARENT(node))) {
            this._swap(node, PARENT(node));
            node = PARENT(node);
        }
    }
    _siftDown() {
        let node = pq_top;
        while ((left(node) < this.size() && this._greater(left(node), node)) ||
            (right(node) < this.size() && this._greater(right(node), node))) {
            let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }
}
function BFS() {
    let q = [];
    let parents = [];
    let visited = [];
    let FOUND = false;
    for (let i = 0; i < grid.length; i++) {
        let tp = [];
        let tpp = [];
        for (let j = 0; j < grid[0].length; j++) {
            tp.push(false);
            tpp.push([-1, -1]);
        }
        visited.push(tp);
        parents.push(tpp);
    }
    let isValid = (i, j) => {
        if (i >= 0 && j >= 0 && i < grid.length && j < grid[0].length) {
            if (grid[i][j].isDisabled == false && visited[i][j] == false) {
                return true;
            }
        }
        return false;
    };
    q.push([larry.body[0].row, larry.body[0].col]);
    while (q.length != 0) {
        let hold = q[0];
        if (food[0] == hold[0] && food[1] == hold[1]) {
            FOUND = true;
            break;
        }
        q.shift();
        if (visited[hold[0]][hold[1]] == false) {
            visited[hold[0]][hold[1]] = true;
            let top = [hold[0] - 1, hold[1]];
            let bottom = [hold[0] + 1, hold[1]];
            let left = [hold[0], hold[1] - 1];
            let right = [hold[0], hold[1] + 1];
            if (isValid(top[0], top[1])) {
                parents[top[0]][top[1]] = hold;
                q.push([top[0], top[1]]);
            }
            if (isValid(right[0], right[1])) {
                parents[right[0]][right[1]] = hold;
                q.push([right[0], right[1]]);
            }
            if (isValid(bottom[0], bottom[1])) {
                parents[bottom[0]][bottom[1]] = hold;
                q.push([bottom[0], bottom[1]]);
            }
            if (isValid(left[0], left[1])) {
                parents[left[0]][left[1]] = hold;
                q.push([left[0], left[1]]);
            }
        }
    }
    if (FOUND) {
        let x = food[0];
        let y = food[1];
        let path = [[x, y]];
        let test_c = 0;
        while (true) {
            let tx = parents[x][y][0];
            let ty = parents[x][y][1];
            x = tx;
            y = ty;
            if (parents[x][y][0] == -1 && parents[x][y][1] == -1) {
                gameOver(0);
                return;
            }
            path.push([x, y]);
            if (parents[x][y][0] == larry.body[0].row && parents[x][y][1] == larry.body[0].col) {
                break;
            }
            test_c++;
            if (test_c > 200) {
                console.log("INF");
                console.log(parents);
                console.log(food);
                console.log(larry.body[0]);
                console.log(path);
                alert("SOMETHING_WENT_WRONG");
                reset();
                break;
            }
        }
        path.reverse();
        return path;
    }
    else {
        console.log("NPF");
        gameOver(1);
        return [];
    }
}
class Body_block {
    constructor(x, y) {
        this.row = x;
        this.col = y;
    }
    update(x, y) {
        grid[this.row][this.col].isDisabled = false;
        this.row = x;
        this.col = y;
        grid[this.row][this.col].isDisabled = true;
        ;
    }
    draw() {
        noStroke();
        let c = color(50, 55, 100);
        fill(c);
        square(this.col * GLOBAL_SIZE, this.row * GLOBAL_SIZE, GLOBAL_SIZE);
    }
}
class Snake {
    constructor(x = 2, y = 2) {
        this.body = [];
        this.current_direction = [0, 0];
        let temp = new Body_block(x, y);
        this.body.push(temp);
    }
    advance(direction) {
        this.current_direction = direction;
        let nRow = this.body[0].row + direction[0];
        if (nRow < 0)
            nRow = grid.length - 1;
        nRow %= grid.length;
        let nCol = this.body[0].col + direction[1];
        if (nCol < 0)
            nCol = grid[0].length - 1;
        nCol %= grid[0].length;
        if (grid[nRow][nCol].isDisabled == true) {
            grid[nRow][nCol].isDisabled = false;
            gameOver(1);
            return;
        }
        let nBlock = this.body.splice(this.body.length - 1, 1)[0];
        this.body.splice(0, 0, nBlock);
        this.body[0].update(nRow, nCol);
        if (grid[nRow][nCol].hasFood == true) {
            foodEaten();
            gameOver(0);
            return;
        }
    }
    draw() {
        for (let ele of this.body) {
            ele.draw();
        }
    }
}
function foodEaten() {
    grid[food[0]][food[1]].hasFood = false;
    let i = randomRange(1, grid.length);
    let j = randomRange(1, grid[0].length);
    food = [i, j];
    grid[i][j].hasFood = true;
}
function generateBlocks(num = 10, sz = 10) {
    let points = [];
    for (let i = 0; i < num; i++) {
        let x = floor(randomRange(3, grid.length - 2));
        let y = floor(randomRange(3, grid[0].length - 2));
        points.push([x, y]);
    }
    for (let i = 0; i < num; i++) {
        if (grid[points[i][0]][points[i][1]].isDisabled == false) {
            randomizedDFS_commence(points[i][0], points[i][1], sz);
        }
    }
}
function randomizedDFS_commence(i, j, TILL) {
    let visited = [];
    let FOUND = false;
    for (let i = 0; i < grid.length; i++) {
        let tp = [];
        for (let j = 0; j < grid[0].length; j++) {
            tp.push(false);
        }
        visited.push(tp);
    }
    let isValid = (i, j) => {
        if (i > 3 && j > 3 && i < grid.length - 2 && j < grid[0].length - 2) {
            if (grid[i][j].isDisabled == false && visited[i][j] == false && grid[i][j].hasFood == false) {
                return true;
            }
        }
        return false;
    };
    function manhatten_dist(i, j, x, y) {
        return abs(x - i) + abs(y - j);
    }
    let farthest = 0;
    function DFS(x, y) {
        if (TILL <= 0) {
            return;
        }
        visited[x][y] = true;
        grid[x][y].isDisabled = true;
        BLOCKS.push([x, y]);
        let neighbours = [];
        let hold = [x, y];
        let top = [hold[0] - 1, hold[1], manhatten_dist(i, j, hold[0] - 1, hold[1])];
        let bottom = [hold[0] + 1, hold[1], manhatten_dist(i, j, hold[0] + 1, hold[1])];
        let left = [hold[0], hold[1] - 1, manhatten_dist(i, j, hold[0], hold[1] - 1)];
        let right = [hold[0], hold[1] + 1, manhatten_dist(i, j, hold[0], hold[1] + 1)];
        let insideMx = 0;
        if (isValid(top[0], top[1]) && top[2] >= farthest) {
            neighbours.push([top[0], top[1]]);
            insideMx = max(insideMx, top[2]);
        }
        if (isValid(right[0], right[1]) && right[2] >= farthest) {
            neighbours.push([right[0], right[1]]);
            insideMx = max(insideMx, right[2]);
        }
        if (isValid(bottom[0], bottom[1]) && bottom[2] >= farthest) {
            neighbours.push([bottom[0], bottom[1]]);
            insideMx = max(insideMx, bottom[2]);
        }
        if (isValid(left[0], left[1]) && left[2] >= farthest) {
            neighbours.push([left[0], left[1]]);
            insideMx = max(insideMx, left[2]);
        }
        farthest = max(farthest, insideMx);
        while (neighbours.length != 0) {
            let rval = floor(random(neighbours.length));
            let ob = neighbours[rval];
            neighbours.splice(rval, 1);
            if (visited[ob[0]][ob[1]] == false) {
                TILL--;
                DFS(ob[0], ob[1]);
            }
        }
    }
    DFS(i, j);
}
let numberOfShapesControl;
let slider;
let GLOBAL_SIZE = 30;
var grid;
let wid, hei;
let canv;
let larry;
let TIME = 300;
let STOP = false;
let inter;
let food = [];
let SCORE = 0, HIGHSCORE = 0;
function setup() {
    console.log("Setup initialized - P5 is running");
    frameRate(60);
    wid = floor((windowWidth / 1.1) / GLOBAL_SIZE) * GLOBAL_SIZE;
    hei = floor((windowHeight / 1.1) / GLOBAL_SIZE) * GLOBAL_SIZE;
    hei = min(hei, 700);
    canv = createCanvas(wid, hei);
    canv.parent("canv_holder");
    slider = createSlider(1, 5, 3, 1);
    slider.parent("left");
    let butt = createButton("RESET");
    butt.parent("lower");
    butt.class("button1");
    butt.mouseClicked(() => {
        clearInterval(inter);
        reset();
    });
    reset();
    slider.input(() => {
        keepAdvancing(larry.current_direction);
    });
}
function reset() {
    clearInterval(inter);
    setScore("SCOREBOARD", "0");
    grid = [];
    for (let i = 0; i < hei / GLOBAL_SIZE; i++) {
        let brid = [];
        for (let j = 0; j < wid / GLOBAL_SIZE; j++) {
            let temp = new Box(i, j);
            temp.draw();
            brid.push(temp);
        }
        grid.push(brid);
    }
    larry = new Snake();
    SCORE = 0;
    keyCount = 0;
    BLOCKS = [];
    let _points = grid.length > 20 ? 30 : 20;
    let _len = floor((5 / 41) * grid[0].length);
    generateBlocks(_points, 5);
    generateFood();
}
let keyCount = 0;
let x = 0;
let BLOCKS = [];
function draw() {
    background(240);
    larry.draw();
    if (food.length != 0) {
        push();
        noStroke();
        let c = color(212, 0, 0);
        fill(c);
        square(food[1] * GLOBAL_SIZE, food[0] * GLOBAL_SIZE, GLOBAL_SIZE);
        pop();
    }
    if (larry.body.length >= grid.length * grid[0].length) {
        noLoop();
    }
    for (let ele of BLOCKS) {
        push();
        noStroke();
        let c = color(120, 64, 0);
        fill(c);
        square(ele[1] * GLOBAL_SIZE, ele[0] * GLOBAL_SIZE, GLOBAL_SIZE);
        pop();
    }
}
function keepAdvancing(direction) {
    if (direction[0] == 0 && direction[1] == 0) {
        return;
    }
    let val = slider.value();
    clearInterval(inter);
    inter = setInterval(() => {
        larry.advance(direction);
    }, TIME / (val + 1));
}
function generateFood(i = 0, j = 0) {
    if (i != 0 && j != 0) {
        food = [i, j];
        grid[i][j].hasFood = true;
        return;
    }
    let avai = [];
    for (let x = 3; x < grid.length; x += floor(randomRange(1, 4))) {
        for (let y = 0; y < grid[0].length; y += floor(randomRange(2, 6))) {
            if (grid[x][y].isDisabled == false) {
                avai.push([x, y]);
            }
        }
    }
    let ra = floor(randomRange(0, avai.length));
    let rand = avai[ra];
    food = [rand[0], rand[1]];
    grid[food[0]][food[1]].hasFood = true;
}
function windowResized() {
}
function randomRange(min, max) {
    return floor(Math.random() * (max - min) + min);
}
function followPath_altered(path, idx = 0) {
    if (path.length == 0) {
        console.log("Nothing to travel to");
        return;
    }
    clearInterval(inter);
    let val = slider.value();
    inter = setInterval(() => {
        let now = path[idx];
        now[0] -= larry.body[0].row;
        now[1] -= larry.body[0].col;
        larry.advance(now);
        idx++;
        if (idx >= path.length) {
            clearInterval(inter);
        }
    }, TIME / (val + 1));
}
function updateFood(x, y) {
    clearInterval(inter);
    grid[food[0]][food[1]].hasFood = false;
    food[0] = x;
    food[1] = y;
    grid[x][y].hasFood = true;
    let path_gen = BFS();
    if (path_gen === undefined) {
        return;
    }
    followPath_altered(path_gen, 0);
}
function keyPressed() {
    keyCount++;
    let fx = food[0], fy = food[1];
    if (keyCode === 65) {
        fy = food[1] - 1;
        fy = (fy < 0 ? grid[0].length - 1 : fy);
        if (grid[fx][fy].isDisabled == false) {
            updateFood(fx, fy);
        }
    }
    else if (keyCode === 68) {
        fy = food[1] + 1;
        fy = (fy >= grid[0].length ? 0 : fy);
        if (grid[fx][fy].isDisabled == false) {
            updateFood(fx, fy);
        }
    }
    else if (keyCode === 87) {
        fx = food[0] - 1;
        fx = (fx < 0 ? grid.length - 1 : fx);
        if (grid[fx][fy].isDisabled == false) {
            updateFood(fx, fy);
        }
    }
    else if (keyCode === 83) {
        fx = food[0] + 1;
        fx = (fx >= grid.length - 1 ? 0 : fx);
        if (grid[fx][fy].isDisabled == false) {
            updateFood(fx, fy);
        }
    }
    if (keyCount >= 10) {
        keyCount = 0;
        let val = slider.value();
        SCORE += floor(pow(2, val) * 10 / 8.2);
        setScore("SCOREBOARD", SCORE.toString());
        if (SCORE > HIGHSCORE) {
            HIGHSCORE = SCORE;
            document.getElementById("HIGHSCORE").innerHTML = "High Score: " + HIGHSCORE;
        }
        larry.body.push(new Body_block(larry.body[larry.body.length - 1].row, larry.body[larry.body.length - 1].col));
    }
}
let swears = ["You suck at this", "Aww Crap!", "Try harder!", "Better Luck next time...", "Sedlyf", "A two year old plays better than you"];
function gameOver(x) {
    clearInterval(inter);
    if (x == 0)
        alert(`${swears[floor(randomRange(0, swears.length))]}\nYour Score: ${SCORE}`);
    else
        alert(`Damn! that snake is stupid huh..\nYour Score: ${SCORE}`);
    reset();
}
function setScore(od, x) {
    document.getElementById(od).innerHTML = "SCORE: " + x;
}
//# sourceMappingURL=../sketch/sketch/build.js.map