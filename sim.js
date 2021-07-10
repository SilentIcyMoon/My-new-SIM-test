Array.prototype.shuffle = function () {
    var i = this.length;
    while (i) {
        var j = Math.floor(Math.random() * i);
        var t = this[--i];
        this[i] = this[j];
        this[j] = t;
    }
    return this;
}

// invalid enter key
function invalid_enter() {
    if (window.event.keyCode == 13) {
        return false;
    }
}

// start experiment
function start_experiment() {
    // get user name
    var name = document.getElementById("name").value.replace(" ", "_");
    if (name == "") {
        alert("Please enter your name.");
        return false;
    }

    // get setlist number
    var set_num = "0"
    var number = document.getElementsByName("set");
    for (var i = 0; i < number.length; i++) {
        if (number[i].checked) {
            set_num = number[i].value;
        }
    }
    if (set_num == "0") {
        alert("Please press the setlist number button.");
        return false;
    }

    // convert display
    Display();

    var method_list_path = [];
    /*
        you have to customize this part
    */
    var method_paths = [];
    // read filepath
    if (set_num == 1 || set_num == 2) {
        method_paths.push(wav_dir + "set" + set_num + "/natural2natural.list");
        method_paths.push(wav_dir + "set" + set_num + "/natural2pseudo.list");
        method_paths.push(wav_dir + "set" + set_num + "/pseudo2natural.list");
        method_paths.push(wav_dir + "set" + set_num + "/pseudo2pseudo.list");
        method_paths.push(wav_dir + "set" + set_num + "/mix.list");
    } else if (set_num == 3) {
        method_paths.push(wav_dir + "set" + set_num + "/PR0.list");
        method_paths.push(wav_dir + "set" + set_num + "/PR50.list");
        method_paths.push(wav_dir + "set" + set_num + "/PR50cut.list");
        method_paths.push(wav_dir + "set" + set_num + "/PR1.list");
    } else if (set_num == 4 || set_num == 5) {
        method_paths.push(wav_dir + "set" + set_num + "/natural2natural.list");
        method_paths.push(wav_dir + "set" + set_num + "/natural2pseudo.list");
        method_paths.push(wav_dir + "set" + set_num + "/pseudo2natural.list");
        method_paths.push(wav_dir + "set" + set_num + "/pseudo2pseudo.list");
    }
    console.log(method_paths);
    file_list = makeFileList(method_paths);
    console.log(file_list);
    outfile = name + "_set" + set_num + ".csv";
    scores = (new Array(file_list.length)).fill(0);
    eval = document.getElementsByName("eval");
    init()
}

// convert display
function Display() {
    document.getElementById("Display1").style.display = "none";
    document.getElementById("Display2").style.display = "block";
}

// load text file
function loadText(filename) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", filename, false);
    xhr.send(null);
    var list = xhr.responseText.split(/\r\n|\r|\n/);
    list.pop();

    return list;
}

// make file list
function makeFileList(method_list_path) {
    // prepare file list of all methods
    var method = Array();
    for (var i = 0; i < method_list_path.length; i++) {
        // if you want to shuffle to compare
        // non parallel pairs, commentout the first line.
        method.push(loadText(method_list_path[i]));
        // method.push(loadText(method_list_path[i]).shuffle());
    }
    var set_num = "0"
    var number = document.getElementsByName("set");
    for (var i = 0; i < number.length; i++) {
        if (number[i].checked) {
            set_num = number[i].value;
        }
    }
    if (set_num == "0") {
        alert("Please press the setlist number button.");
        return false;
    }
    var files = Array();
	if (set_num == 1 || set_num == 2) {
	    for (var i = 0; i <set1.length; i++) {
                pairs = [
                    [method[i][0], method[i][4]],
                    [method[i][1], method[i][5]],
                    [method[i][2], method[i][6]],
                    [method[i][3], method[i][7]],
                    [method[i][8], method[i][12]],
                    [method[i][9], method[i][13]],
                    [method[i][10], method[i][14]],
                    [method[i][11], method[i][15]],
                ]
	    }
	    for (var j = 0; j < pairs.length; j++) {
	        files.push(pairs[j]);
	    }
	} else if (set_num == 3) {
	    for (var i = 0; i <set3.length; i++) {
	        pairs = [
	            [method[i][0], method[i][4]],
                    [method[i][1], method[i][5]],
                    [method[i][2], method[i][6]],
                    [method[i][3], method[i][7]],
                ] 
            }
	    for (var j = 0; j < pairs.length; j++) {
	        files.push(pairs[j]);
	    }
	} else if (set_num == 4 || set_num == 5) {
	    for (var i = 0; i <set4.length; i++) {
	        pairs = [
                    [method[i][0], method[i][4]],
                    [method[i][1], method[i][5]],
                    [method[i][2], method[i][6]],
                    [method[i][3], method[i][7]],
                    [method[i][8], method[i][4]],
                    [method[i][9], method[i][5]],
                    [method[i][10], method[i][6]],
                    [method[i][11], method[i][7]],
                ]
            }
 	    for (var j = 0; j < pairs.length; j++) {
 	        files.push(pairs[j]);
 	    }
	    
	}
    files.shuffle();
    return files;
}		 

function setAudio() {
    document.getElementById("page").textContent = "" + (n + 1) + "/" + scores.length;

    document.getElementById("audio_a").innerHTML = 'VoiceA:<br>'
        + '<audio src="' + file_list[n][0]
        + '" controls preload="auto">'
        + '</audio>';

    document.getElementById("audio_b").innerHTML = 'VoiceB:<br>'
        + '<audio src="' + file_list[n][1]
        + '" controls preload="auto">'
        + '</audio>';
}

function init() {
    n = 0;
    setAudio();
    evalCheck();
    setButton();
}

function evalCheck() {
    const c = scores[n];
    if ((c <= 0) || (c > eval.length)) {
        for (var i = 0; i < eval.length; i++) {
            eval[i].checked = false;
        }
    }
    else {
        eval[c - 1].checked = true;
    }
}

function setButton() {
    if (n == (scores.length - 1)) {
        document.getElementById("prev").disabled = false;
        document.getElementById("next2").disabled = true;
        document.getElementById("finish").disabled = true;
        for (var i = 0; i < eval.length; i++) {
            if (eval[i].checked) {
                document.getElementById("finish").disabled = false;
                break;
            }
        }
    }
    else {
        if (n == 0) {
            document.getElementById("prev").disabled = true;
        }
        else {
            document.getElementById("prev").disabled = false;
        }
        document.getElementById("next2").disabled = true;
        document.getElementById("finish").disabled = true;
        for (var i = 0; i < eval.length; i++) {
            if (eval[i].checked) {
                document.getElementById("next2").disabled = false;
                break;
            }
        }
    }
}

function evaluation() {
    for (var i = 0; i < eval.length; i++) {
        if (eval[i].checked) {
            scores[n] = 4 - i;
        }
    }
    setButton();
}

function exportCSV() {
    var csvData = "";
    for (var i = 0; i < file_list.length; i++) {
        csvData += "" + file_list[i][0] + ","
            + file_list[i][1] + ","
            + scores[i] + "\r\n";
    }

    const link = document.createElement("a");
    document.body.appendChild(link);
    link.style = "display:none";
    const blob = new Blob([csvData], { type: "octet/stream" });
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.download = outfile;
    link.click();
    window.URL.revokeObjectURL(url);
    link.parentNode.removeChild(link);
}

function next() {
    n++;
    setAudio();
    evalCheck();
    setButton();
}

function prev() {
    n--;
    setAudio();
    evalCheck();
    setButton();
}

function finish() {
    exportCSV();
}


// directory name
const wav_dir = "wav/";

// invalid enter key
document.onkeypress = invalid_enter();

// global variables
var outfile;
var file_list;
var scores;

// since loadText() doesn't work in local
var n = 0;
var eval = document.getElementsByName("eval");
