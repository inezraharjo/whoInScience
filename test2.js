var a = ["test1", "test2", "test3"];
console.log(a);
var b = a[1];
console.log(b);
var c = b.substring(2,5);
console.log(c);
var d = b.indexOf("-");
console.log(d);

var e = [];
var f = ["test"];

f = f.concat(e);
console.log(f);

var g = ["my"];
g = e.concat(f,g);
console.log(g);

var h = e.concat(["hey"]);
console.log(h);