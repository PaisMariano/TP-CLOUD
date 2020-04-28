class Printer {
    print(header, array) {
        console.log(header);
        console.log("-------------------");
        array.forEach(element => {
            console.log(element);
        });
        console.log("-------------------");
    }
}
module.exports = Printer;