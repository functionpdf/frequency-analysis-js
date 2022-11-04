const ciphertextElement = document.getElementById("ciphertext")
const subdTextElement = document.getElementById("subd-text")

function isCapitalLetter(letter) {
  return (letter >= 'A') && (letter <= 'Z')
}

/**
 * Count the number of uppercase letters in the text
 *
 * @note The function will only count uppercase ascii characters
 */
function countUpperCaseLetter(text) {
  let numberOfLetters = 0  
  
  for (const letter of text) {
    if (isCapitalLetter(letter)) {
      numberOfLetters += 1
    }
  }
  
  return numberOfLetters
}

/**
 * Count the number of occurences of each letter in the given text
 *
 * @return  A map with a key for each letter with it's count as the value
 *          and the total number of letters in the text
 * @note The function will only count uppercase ascii characters
 */
function countLetterOccurrences(text) {
  let letterCount = {}
  
  for (const letter of text) {
    if (isCapitalLetter(letter)) {
      letterCount[letter] = (letterCount[letter] || 0) + 1
    }
  }
  
  return letterCount
}

/**
 * Transform the letter count map into an array sorted 
 * from the highest to the lowest count
 */
function sortLetterCount(letterCount) {
  return Object.entries(letterCount).sort((lhs, rhs) => {
    return rhs[1] - lhs[1]
  })
}

/**
 * Calculate the occurrence frequency (in percent) of the given letter
 * based on the number of occurrences of the letter in the text and the
 * total number of letters in the text
 */
function letterCountToFrequencyPercent(count, numberOfLetters) {
  return ((count / numberOfLetters) * 100).toFixed(2)
}

/**
 * Populate the HTML table containing the analysis results
 * and the substitution inputs
 */
function populateAnalysisTable(letterCount, numberOfLetters) {
  let table = document.getElementById("key-table")
  let tableBody = table.getElementsByTagName("tbody")[0]
  let tableRows = tableBody.children
  
  for (let index=0; index < letterCount.length; index++) {
    const [letter, count] = letterCount[index]
    const tableRow = tableRows[index]
    const tableRowData = tableRow.children
    
    tableRowData[0].innerHTML = letter
    tableRowData[1].innerHTML = count
    tableRowData[2].innerHTML = letterCountToFrequencyPercent(Number(count), numberOfLetters)
    
    // Show the current table row.
    // The table rows are hidden by default such that ciphertexts which don't contain
    // every letter of the alphabet won't cause empty rows to be displayed.
    tableRow.style.display = "table-row"
  }
}

/**
 * Handle the user clicking the Analyze button by building the
 * analysis table and attaching it to the DOM
 */
document.getElementById("analyze-btn").onclick = () => {
  // Analyze the ciphertext and create the tables
  const ciphertext = ciphertextElement.value.toUpperCase()
  
  const numberOfLetters = countUpperCaseLetter(ciphertext)
  const letterOccurrences = countLetterOccurrences(ciphertext)
  let sortedLetterCount = sortLetterCount(letterOccurrences)

  populateAnalysisTable(sortedLetterCount, numberOfLetters)
  
  // Update the DOM
  document.getElementById("analysis-container").style.display = "block"
  document.getElementById("setup-container").style.display = "none"
  subdTextElement.innerHTML = ciphertext
}

/**
 * This function convert the Original UPPERCASE letter to the replacement lowercase letter
 * @returns  text with replaced letters
 */
function substituteLetter(text, fromLetter, toLetter) {
  // If the input exists and isn't empty
  if(toLetter) {
    // Make sure we're only replacing upper case letters (encrypted) to lowercase (plaintext)
    text = text.replaceAll(fromLetter.toUpperCase(), toLetter.toLowerCase())
  }
  return text
}

/**
 * This function runs every time a substitution input is changed
 * and perfroms all substitutions on the ciphertext based on the key table
 */
function performSubstitution() {
  const keyTableRows = document.getElementById("key-table").getElementsByTagName("tbody")[0].children
  
  let ciphertext = ciphertextElement.value.toUpperCase()
  
  // Iterate over the key table
  for (const keyRow of keyTableRows) {
    const originalLetter = keyRow.firstElementChild.innerText
    const replaceLetter = keyRow.lastElementChild.firstElementChild.value

    ciphertext = substituteLetter(ciphertext, originalLetter, replaceLetter)
  }
  
  subdTextElement.innerHTML = ciphertext
}