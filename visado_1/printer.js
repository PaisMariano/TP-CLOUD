class Printer {
  printMessage(message) {
    console.log(message);
  }

  printArray(header, array) {
    console.log(header);
    console.log('-------------------');
    array.forEach((element) => {
      console.log(element);
    });
    console.log('-------------------');
  }

  printEntity(header, entity) {
    console.log(`${header}: ${entity}`);
  }
}
module.exports = Printer;