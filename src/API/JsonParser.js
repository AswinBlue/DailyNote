/**
 * @brief   parse json data and return first json object and leftover string
 * @param[in] str   string data to parse
 * @return  pair of "json data" from 'str' and "leftover string". 
 */
export const parseJson = (str) => {
    let end = findEndOfJSON(str);
    
    // json 끝 찾기가 실패하면 전체를 string으로 판단
    if (end == -1) {
        return null, str;
    }

    return JSON.parse(str.slice(0, end + 1)), str.slice(end + 1)
}
/**
 * @param {string} str : string data that contains json
 * @returns return index of end of json
 */
const findEndOfJSON = (str) => {
    let stack = [];
    let index = 0;
    let inString = false;
    let currentChar;
    let currentString = '';

    console.log('findEndOfJSON', str);

    if (!str) {
      return -1;
    }
  
    while (index < str.length) {
      currentChar = str[index];
  
      if (currentChar === '"') {
        inString = !inString;
      } else if (!inString) {
        if (currentChar === '{' || currentChar === '[') {
          stack.push(currentChar);
        } else if (currentChar === '}' || currentChar === ']') {
          if (stack.length === 0) {
            return index;
          } else {
            stack.pop();
          }
        }
      }
      currentString += currentChar;
      index++;
    }
  
    return -1;
}