import {loadBinaryString, loadDecimalString, toBinary16} from "../converter.js"
import binary16_data from  "./binary16_values.js"


toBinary16();
for(const [decimal, expected] of binary16_data) {
    console.log('Testing', decimal)
    const {hex, bin} = loadDecimalString(decimal, '0')
    
    if(hex === expected.toUpperCase()) {
        console.log("pass")
    } else {
        console.log("fail", decimal, "actual:", hex, "expected:", expected.toUpperCase())
        process.exit(1)
    }
}