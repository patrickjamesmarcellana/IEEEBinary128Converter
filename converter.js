const Decimal = require('decimal.js');

var shift_forward = -1;
var binary = [];
;
var decimal_val = '15000000000'
var actual_val = ''
var binary_val = '';
var error_val = '';
var hex_val = '';
var sign_bit = [];
var exponent_bits = [];
var mantissa_bits = [];

function updateFromNewDecimalString() {
    // Use when decimal input has been changed.
    // All other values will change accordingly.

    Decimal.set({ precision: 150 });
    var x = new Decimal(decimal_val);
    Decimal.rounding = Decimal.ROUND_DOWN;
    if (x.greaterThanOrEqualTo(0)){
        sign_bit = [0];
    } else {
        sign_bit = [1];
        x = x.negated();
    }
    var number_binary = getNumberBinary(x);
    var number_bits_total = number_binary.length;

    var decimal_binary = getDecimalBinary(x, 113 - number_bits_total);
    if (number_binary.length == 0){
        decimal_binary = popUntilFirstOne(decimal_binary);
    }
    if (decimal_binary.length > 112 - number_bits_total){
        if (decimal_binary[113 - number_bits_total] == 1){
            decimal_binary = roundUpBinary(decimal_binary)
            decimal_binary.pop();
        } else {
            decimal_binary.pop();
        };
    }
    console.log(number_binary.join(''));
    console.log(decimal_binary.join(''));

    var exponent = 0;
    if (number_bits_total > 0) {
        exponent = number_bits_total - 1;
    } else {
        exponent = shift_forward;
    }

    var exponent_binary = new Decimal(16383 + exponent);
    exponent_binary = getNumberBinary(exponent_binary);
    exponent_bits = exponent_binary;
    console.log(exponent_bits.join(''));

    var mantissa = []
    mantissa = number_binary.slice(1);
    mantissa = mantissa.concat(decimal_binary);
    mantissa_bits = addZerosToArray(mantissa, 112);
    console.log(addSpaces(mantissa_bits.join('')));

    binary_val = sign_bit.join('') + exponent_bits.join('') + mantissa_bits.join('')
    console.log(binary_val);

    var hex_string = convertBinaryStringToHex();
    hex_val = hex_string.join('');
    console.log(hex_val);

    getDecimalFromBinary();
    getError();
}

function updateFromNewBinaryString(){
    // Use when binary_val has changed.
    // All other values will change accordingly.
    Decimal.set({ precision: 150 });

    var binary_string = binary_val;
    sign_bit = binary_string.slice(0, 1).split('');
    exponent = binary_string.slice(1, 12).split('');
    mantissa = binary_string.slice(12).split('');

    getDecimalFromBinary();
    decimal_val = actual_val
    hex_val = convertBinaryStringToHex.join('');
    getError();
}

function updateFromNewBinaryToggle(){
    // Use when a binary bit is changed.
    // All other calues will change accordingly.
    Decimal.set({ precision: 150 });

    binary_val = sign_bit.join('') + exponent_bits.join('') + mantissa_bits.join('');
    getDecimalFromBinary();
    decimal_val = actual_val
    hex_val = convertBinaryStringToHex.join('');
    getError();
}

function getDecimalFromBinary() {
    // Takes the current binary bits and gets the actual decimal value.
    // Will modify actual_val.

    var exponent = binaryToNumber(exponent_bits.join(''));
    exponent = exponent.sub(16383);
    var mantissa = mantissa_bits.join('');
    if (exponent < 0) {
        var fractional_string = addZerosAndOneToBeginning(mantissa, exponent.negated());
        var fractional = binaryToFractional(fractional_string);
        actual_val = fractional.toFixed();
    } else if (exponent < mantissa_bits.length){
        var number_string = '1' + mantissa.slice(0, exponent);
        var fractional_string = mantissa.slice(exponent);
        var number_string_val = binaryToNumber(number_string).toPrecision();
        var fractional_string_val = binaryToFractional(fractional_string).toDP(30).toFixed();
        actual_val = number_string_val + fractional_string_val.slice(1);
    }
    else {
        var number_string = '1' + addZerosToEnd(mantissa, exponent - mantissa_bits.length);
        var number_string_val = binaryToNumber(number_string).toPrecision();
        actual_val = number_string_val;
    }

    if (sign_bit[0] == 1){
        actual_val = '-' + actual_val
    }
}

function getError(){
    // Gets the error between actual_val and decimal_val and stores it in error_val

    var decimal = new Decimal(decimal_val);
    var actual = new Decimal(actual_val);

    error_val = actual.sub(decimal).toFixed();
}

function binaryToFractional(string) {
    // Gets the fractional value of a given string.

    var decimal = new Decimal(0);
    var one = new Decimal(1);
    var power = new Decimal(2);

    for (let i = 0; i < string.length; i++) {

        if (string[i] === '1') {
            decimal = decimal.add(one.div(power));
        }
        power = power.mul(2);
    }

    return decimal;
}

function binaryToNumber(string) {
    // Gets the number value of a givens string.

    var decimal = new Decimal(0);
    var power = new Decimal(1); // The power of 2 associated with the rightmost bit

    // Iterate over the binary string from right to left
    for (let i = string.length - 1; i >= 0; i--) {
        // If the current bit is '1', add the corresponding power of 2 to the decimal value
        if (string[i] === '1') {
            decimal = decimal.add(power);
        }
        // Update the power of 2 for the next bit
        power = power.mul(2);
    }

    return decimal;
}

function roundUpBinary(arr) {
    // Rounds binary
    var i = arr.length - 1;
    while (arr[i] != 0){
        arr[i] = 0;
        i--
    }
    arr[i] = 1;
    return arr;
}

function convertBinaryStringToHex(){
    // Converts a given binary string into hex. Assumes it is a string divisible by 4.
    var hex_string = []
    var split4 = binary_val.match(/.{1,4}/g);

    split4.forEach(split => {
        hex_string.push(parseInt(split, 2).toString(16).toUpperCase());
    });

    return hex_string
}

function addZerosToArray(arr, desiredLength) {
    // Adds zeros at the end of array to match length.
    while (arr.length < desiredLength) {
        arr.push(0);
    }
    return arr;
}

function addZerosAndOneToBeginning(str, num){
    // Adds a set of zeros and one to a string
    // For numbers where exponent moves the fixed point back past the original value
    var zeros = '0'.repeat(num - 1);
    return zeros + '1' + str;
}

function addZerosToEnd(str, num){
    // Adds a set of zeros to the end of a string
    var zeros = '0'.repeat(num - 1);
    return str + zeros;
}

function addSpaces(str) {
    // Splits number into sections of 4 for visual purposes.
    return str.replace(/(.{4})/g, '$1 ');
}

function popUntilFirstOne(arr){
    while(arr[0] == 0){
        arr = arr.slice(1);
    }
    return arr;
}

function getNumberBinary(number){
    // Gets the binary bits of a number
    var number_portion = number.round();
    var binary_bits = [];
    while(!number_portion.equals(0)){
        var cur_binary = number_portion.modulo(2);
        binary_bits.push(cur_binary.toNumber());
        number_portion = number_portion.div(2).round();
    }
    return binary_bits.reverse();
}

function getDecimalBinary(number, limit){
    // Gets the binary bits of a fractional number
    var decimal_portion = number.minus(number.round());
    var binary_bits = [];
    var current_bit_total = 0;
    var no_number = false;
    var zero_trigger = true;
    if (limit == 121){
        no_number = true;
    }

    while(current_bit_total <= limit && !decimal_portion.equals(0)){
        decimal_portion = decimal_portion.mul(2);
        if (decimal_portion.greaterThanOrEqualTo(1)){
            decimal_portion = decimal_portion.minus(1);
            binary_bits.push(1);
            zero_trigger = false;
        } else {
            binary_bits.push(0);
        }
        current_bit_total = current_bit_total + 1;
        if (zero_trigger){
            current_bit_total = current_bit_total - 1;
            shift_forward = shift_forward - 1;
        }
    }
    return binary_bits;
}

updateFromNewDecimalString();
