function average(arr){
    var total=0;
    arr.forEach(function(index){
        total+=index;
    });
    
    total /= arr.length;
    return Math.round(total);
}

console.log("Average score for some class, it's an example");
console.log(average([92, 95, 80, 55, 72, 83, 99, 100, 50, 22, 67, 77]));