var val = {

  getInput: function() {
    var word = prompt("enter string:", "xxx-xxx-xxxx");
        return word;
    },

//trim out any leading and trailing blank space.
 trim: function(str){
     return str.replace(/^\s+|\s+$/g, '');
    },

  printAll: function(obj) {   // dump object to the page at "test" ID
      for (i in obj) {
        $('body').append( "<br />" + obj[i] );
    }
  },

  analyzeString: function(word) {
    var wordFacts = {
        wordLength: word.length,
        wordThird: word.charAt(2),
        wordUpper: word.toUpperCase(),
        wordLower: word.toLowerCase(),
        wordSearchA: word.search("a"),           //can take regex
        wordFirstA: word.indexOf("a"),
        wordLastA: word.lastIndexOf("a"),
        wordSlice13: word.slice(1,3),
        wordSubstring13: word.substring(1,3),
        wordSubstr: word.substr(1,3),
        wordReplaceA: word.replace("a","A"),
        wordConcat: word.concat("+","A"),
        wordSplit: word.split("-",3)             //returns an array of length not greater than 3
    }
    if (word.length === 12
        && "-" === word.charAt(3)
        && "-" === word.charAt(7)
       ){ $('#demo').css('background-color','green')
          $('#demo').append('<p> GOOD TEST </p>')
        }
  return wordFacts;
  },

  readForm: function(){
      this.printAll(this.analyzeString(document.getElementById('phone').value))
  },

   readPrompt:function(){
      this.printAll(this.stringFunctions(this.getInput()))
  },


  phonenumber: function(inputtxt) { //HOW DO I REFERENCE THIS FROM analyzeString()
   var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
   if(inputtxt.value.match(phoneno)) {
    return true;
   }
   else {
    alert("NO");
    return false;
    }
  }
}
