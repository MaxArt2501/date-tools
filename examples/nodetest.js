var DateTools = require("../date-tools"),
    date = new Date(),
    easter = DateTools.getEaster(date.getFullYear());

console.log("ISO 8601: " + DateTools.format(date, DateTools.ISO_8601));
console.log("Common database datetime format: " + DateTools.format(date, DateTools.DBT));
console.log("Easter this year is on " + DateTools.format(easter, DateTools.EUD));

DateTools.extendDatePrototype();
var dst = new Date(2014, 2, 30);
console.log(dst.getDSTChange() + " " + new Date(dst.getDSTChangeTime()).format("H:i"));
console.log(date);
console.log(date.format("D M d Y H:i:s 'GMT'O", "en-UK"));
