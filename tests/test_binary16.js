import {loadBinaryString, loadDecimalString, toBinary16} from "../converter.js"
import binary16_data from  "./binary16_values.js"
import binary16_data_floatmode_unique from  "./binary16_values_floatmode_unique.js"


toBinary16();

const test = (data) => {
    for(const [decimal, expected] of data) {
        console.log('Testing', decimal)
        const {hex, bin} = loadDecimalString(decimal, '0')
        
        if(hex === expected.toUpperCase()) {
            console.log("pass")
        } else {
            console.log("fail", decimal, "actual:", hex, "expected:", expected.toUpperCase())
            process.exit(1)
        }
    }
}

test(binary16_data)
test(binary16_data_floatmode_unique)