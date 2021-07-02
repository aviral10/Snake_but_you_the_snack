// GLOBAL Ingridients
let numberOfShapesControl: p5.Element;
let slider:any;
let GLOBAL_SIZE = 30;
var grid: Box[][];
let wid:number, hei:number;
let canv:p5.Element;
let larry:Snake;
let TIME = 300;
let STOP:boolean = false;
let inter:any;
let food:number[] = [];
let SCORE = 0, HIGHSCORE=0;


function setup(): void {
    console.log("Setup initialized - P5 is running");
    frameRate(60);
    
    wid = floor((windowWidth/1.1)/GLOBAL_SIZE)*GLOBAL_SIZE;
    hei = floor((windowHeight/1.1)/GLOBAL_SIZE)*GLOBAL_SIZE;
    hei = min(hei, 700);
    canv = createCanvas(wid, hei)
    canv.parent("canv_holder")

    slider = createSlider(1,5,3,1)
    slider.parent("left")
    let butt = createButton("RESET");
    butt.parent("lower");
    butt.class("button1")
    butt.mouseClicked(()=>{
        clearInterval(inter);
        reset();
    });
    
    //Initialization
    reset();
    slider.input(()=>{
        keepAdvancing(larry.current_direction);
    });
    
}

// Returns the entire setup(NOT the function above) to a Starting state
function reset():void{
    clearInterval(inter);
    setScore("SCOREBOARD","0");
    grid = []
    for(let i=0;i<hei/GLOBAL_SIZE;i++){
        let brid:Box[] = [];
        for(let j=0;j<wid/GLOBAL_SIZE;j++){
            let temp = new Box(i,j);
            temp.draw();
            brid.push(temp);
        }
        grid.push(brid);
    }
    //Snek
    larry = new Snake();
    

    //Cherry picked stuff
    SCORE = 0;
    keyCount = 0;
    BLOCKS = [];
    let _points = grid.length>20?30:20;
    let _len = floor((5/41)*grid[0].length);
    generateBlocks(_points,5);
    generateFood();
}

//Canvas Drawing
let keyCount = 0;
let x: number=0
let BLOCKS:number[][] = []
function draw(): void{
    background(240);
    
    larry.draw();
    if(food.length != 0){
        push()
        noStroke();
        let c = color(212, 0, 0);
        fill(c);
        // rectMode(CENTER);
        square(food[1]*GLOBAL_SIZE, food[0]*GLOBAL_SIZE, GLOBAL_SIZE);
        pop()
    }

    if(larry.body.length >= grid.length*grid[0].length){
        noLoop();
    }
    for(let ele of BLOCKS){
        push()
        noStroke();
        let c = color(120, 64, 0);
        fill(c);
        // rectMode(CENTER);
        square(ele[1]*GLOBAL_SIZE, ele[0]*GLOBAL_SIZE, GLOBAL_SIZE);
        pop()
    }
    
}

//Handy function to give snake a direction to advance to
function keepAdvancing(direction:any):void{
    if(direction[0] == 0 && direction[1] == 0){
        return;
    }
    let val:any = slider.value();
    clearInterval(inter);
    inter = setInterval(()=>{
        larry.advance(direction);
    }, TIME/(val+1));
}

// As the name suggests
function generateFood(i:number=0, j:number=0):void{
    if(i!=0 && j != 0){
        food = [i,j];
        grid[i][j].hasFood = true;
        return;
    }
    let avai:number[][] = [];
    for(let x=3;x<grid.length;x+=floor(randomRange(1,4))){
        for(let y=0;y<grid[0].length;y+=floor(randomRange(2,6))){
            if(grid[x][y].isDisabled == false){
                avai.push([x,y]);
            }
        }
    }
    let ra = floor(randomRange(0, avai.length));
    
    let rand = avai[ra];
    // console.log(avai);
    food = [rand[0], rand[1]]
    grid[food[0]][food[1]].hasFood = true;
    
}

// IDK why is it here
function windowResized() {
    // resizeCanvas(windowWidth/2, windowHeight/2);
}

// Handy funtion for getting a random number between min(inclusive) and max(exclusive)
function randomRange(min:number, max:number): number {
    return floor(Math.random() * (max - min) + min);
}

// Some juicy boi, Makes the snake follow a path, which in fact is shortest path to the food
function followPath_altered(path:number[][], idx:number=0):void{
    if(path.length == 0){
        console.log("Nothing to travel to")
        return;
    }
    clearInterval(inter);
    let val:any = slider.value();
    inter = setInterval(()=>{
        let now = path[idx];
        now[0] -= larry.body[0].row;
        now[1] -= larry.body[0].col;
        larry.advance(now);
        // console.log(idx);
        idx++;
        if(idx >= path.length){
            clearInterval(inter);
        }
    }, TIME/(val+1));

}

// Updates position of the food and recalibrates the path for the snake for new food location
// Massive improvements can be made here
function updateFood(x:number, y:number):void{
    clearInterval(inter);
    grid[food[0]][food[1]].hasFood = false;
    food[0] = x;
    food[1] = y;
    grid[x][y].hasFood = true;
    
    let path_gen = BFS();
    if(path_gen === undefined){
        return;
    }
    followPath_altered(path_gen, 0);
}

//Controls the food
function keyPressed(): void {
    keyCount++;
    let fx=food[0], fy=food[1];
    if (keyCode === 65) {
        //console.log("LEFT")
        fy = food[1]-1;
        fy = (fy<0?grid[0].length-1:fy);
        if(grid[fx][fy].isDisabled == false){
            updateFood(fx,fy);
        }
        
    } else if (keyCode === 68) {
        // console.log("RIGHT")
        fy = food[1]+1;
        fy = (fy>=grid[0].length?0:fy);
        if(grid[fx][fy].isDisabled == false){
            updateFood(fx,fy);
        }
    } else if (keyCode === 87) {
        // console.log("UP")
        fx = food[0]-1;
        fx = (fx<0?grid.length-1:fx);
        if(grid[fx][fy].isDisabled == false){
            updateFood(fx,fy);
        }
    } else if (keyCode === 83) {
        // console.log("DOWN")
        fx = food[0]+1;
        fx = (fx>=grid.length-1?0:fx);
        if(grid[fx][fy].isDisabled == false){
            updateFood(fx,fy);
        }
    }
    //Updating scores
    if(keyCount >= 10){
        keyCount = 0;
        let val = slider.value();
        SCORE += floor(pow(2, val)*10/8.2);
        setScore("SCOREBOARD",SCORE.toString());
        if(SCORE > HIGHSCORE){
            HIGHSCORE = SCORE;
            // setScore("HIGHSCORE", HIGHSCORE.toString());
            document.getElementById("HIGHSCORE").innerHTML = "High Score: "+HIGHSCORE;
        }
        larry.body.push(new Body_block(larry.body[larry.body.length-1].row, larry.body[larry.body.length-1].col))
    }
}


let swears = ["You suck at this", "Aww Crap!", "Try harder!", "Better Luck next time...", "Sedlyf","A two year old plays better than you"]
// Handle Game over incident
function gameOver(x:number):void{
    clearInterval(inter);
    if(x == 0)
        alert(`${swears[floor(randomRange(0, swears.length))]}\nYour Score: ${SCORE}`);
    else 
        alert(`Damn! that snake is stupid huh..\nYour Score: ${SCORE}`);
    reset();
}
// Handy funtion to update HTML elements
function setScore(od: string, x: string){
    document.getElementById(od).innerHTML = "SCORE: "+x;
}