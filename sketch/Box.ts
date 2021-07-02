class Box{
    row:number;
    col:number;
    hasFood:boolean = false;
    isDisabled:boolean = false;
    constructor(i:number, j:number){
        this.row = i;
        this.col = j;
    }
    draw():void{
        fill(100);
        stroke(5);
        square(this.col*GLOBAL_SIZE, this.row*GLOBAL_SIZE, GLOBAL_SIZE);
        
    }
}