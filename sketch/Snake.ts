// Snake is made up of body_blocks
class Body_block{
    row: number;
    col: number;
    constructor(x:number, y:number){
        this.row=x;
        this.col=y;
    }
    update(x:number, y:number){
        grid[this.row][this.col].isDisabled = false;
        this.row = x;
        this.col = y;
        grid[this.row][this.col].isDisabled = true;;
    }

    draw():void{
        noStroke();
        let c = color(50, 55, 100);
        fill(c);
        square(this.col*GLOBAL_SIZE, this.row*GLOBAL_SIZE, GLOBAL_SIZE);
    }
}

// Our Larry
class Snake{
    body:Body_block[] = [];
    current_direction: number[] = [0,0];
    constructor(x:number=2, y:number=2){
        let temp = new Body_block(x,y);
        this.body.push(temp);
    }

    advance(direction:number[]):void{
        this.current_direction = direction;
        let nRow = this.body[0].row+direction[0];
        if(nRow < 0) nRow = grid.length-1;
        nRow %= grid.length;
        let nCol = this.body[0].col+direction[1];
        if(nCol < 0) nCol = grid[0].length-1;
        nCol %= grid[0].length;
        

        if(grid[nRow][nCol].isDisabled == true){
           
            grid[nRow][nCol].isDisabled = false;
           
            gameOver(1);
            return;
        }
        let nBlock = this.body.splice(this.body.length-1, 1)[0];        
        this.body.splice(0,0,nBlock);
        this.body[0].update(nRow, nCol);

        if(grid[nRow][nCol].hasFood == true){
            // this.body.splice(0,0, new Body_block(nRow, nCol));
            foodEaten();
            gameOver(0);
            return;
        }

    }

    draw():void{
        for(let ele of this.body){
            ele.draw();
        }
    }
}

// Handle food being eaten event
function foodEaten():void{
    grid[food[0]][food[1]].hasFood = false;
    let i = randomRange(1, grid.length);
    let j = randomRange(1, grid[0].length)
    food = [i,j];
    // console.log(i,j, grid.length,grid[0].length);
    grid[i][j].hasFood = true;
}