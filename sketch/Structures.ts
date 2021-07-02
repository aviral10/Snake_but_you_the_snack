// Generate those weird obstacles 
function generateBlocks(num:number=10, sz:number=10):void{
    let points= []
    for(let i=0;i<num;i++){
        let x = floor(randomRange(3,grid.length-2));
        let y = floor(randomRange(3,grid[0].length-2));
        points.push([x,y]);
    }
    
    for(let i=0;i<num;i++){
        if(grid[points[i][0]][points[i][1]].isDisabled == false){
            randomizedDFS_commence(points[i][0],points[i][1],sz);
        }
    }
    
}
// Uses randomized DFS for generating those Blocking elements
function randomizedDFS_commence(i: number, j: number, TILL: number):void{
    let visited:boolean[][] = [];
    let FOUND = false;
    for(let i=0;i<grid.length;i++){
        let tp = [];
        for(let j=0;j<grid[0].length;j++){
            tp.push(false);
        }
        visited.push(tp);
    }

    let isValid = (i:number, j:number) => {
        if(i > 3 && j > 3 && i < grid.length-2 && j < grid[0].length-2){
            if(grid[i][j].isDisabled == false && visited[i][j] == false && grid[i][j].hasFood == false){
                return true;
            }
        }
        return false;
    }
    function manhatten_dist(i:number, j:number, x:number, y:number):number{
        return abs(x-i)+abs(y-j);
    }

    let farthest = 0;
    function DFS(x: number, y: number){
        if(TILL <= 0){
            return;
        }
        visited[x][y] = true;
        grid[x][y].isDisabled = true;
        BLOCKS.push([x,y]);
        let neighbours:number[][] = [];
        let hold = [x,y];
        let top    = [hold[0]-1, hold[1], manhatten_dist(i,j,hold[0]-1,hold[1])];
        let bottom = [hold[0]+1, hold[1], manhatten_dist(i,j,hold[0]+1,hold[1])];
        let left   = [hold[0], hold[1]-1, manhatten_dist(i,j,hold[0],hold[1]-1)];
        let right  = [hold[0], hold[1]+1, manhatten_dist(i,j,hold[0],hold[1]+1)];
        let insideMx = 0;
        if(isValid(top[0], top[1]) && top[2] >= farthest){
            neighbours.push([top[0],top[1]]);
            insideMx = max(insideMx, top[2]);
        }
        if(isValid(right[0], right[1]) && right[2] >= farthest){
            neighbours.push([right[0],right[1]]);
            insideMx = max(insideMx, right[2]);
        }
        if(isValid(bottom[0], bottom[1]) && bottom[2] >= farthest){
            neighbours.push([bottom[0],bottom[1]]);
            insideMx = max(insideMx, bottom[2]);
        }
        if(isValid(left[0], left[1]) && left[2] >= farthest){
            neighbours.push([left[0],left[1]]);
            insideMx = max(insideMx, left[2]);
        }
        
        farthest = max(farthest, insideMx);

        while(neighbours.length != 0){
            let rval = floor(random(neighbours.length));
            let ob = neighbours[rval];
            // console.log(neighbours);
            neighbours.splice(rval,1);
            
            if(visited[ob[0]][ob[1]] == false){
                TILL--;
                DFS(ob[0], ob[1]);
            }
        }
    }
    DFS(i,j);

}
