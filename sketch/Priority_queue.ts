const pq_top = 0;
const PARENT:any = (i:any) => ((i + 1) >>> 1) - 1;
const left = (i:any) => (i << 1) + 1;
const right = (i:any) => (i + 1) << 1;

function comp(a:any,b:any){
  if(a.f == b.f){
    return a.h < b.h;
  }
  return a.f < b.f;
}

class Priority_Queue {
    _heap:any;
    _comparator:any;
  // constructor(comparator = (a, b) => a.f < b.f) {
  constructor(comparator:any = comp) {
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
  insert(...values:any) {
    values.forEach((value:any) => {
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
  replace(value:any) {
    const replacedValue = this.top();
    this._heap[pq_top] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i:any, j:any) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i:any, j:any) {
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
    while (
      (left(node) < this.size() && this._greater(left(node), node)) ||
      (right(node) < this.size() && this._greater(right(node), node))
    ) {
      let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}