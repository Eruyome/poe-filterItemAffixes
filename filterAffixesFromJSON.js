var jsonfile = require('jsonfile');
var fs = require('fs');
const chalk = require('chalk');

try {
	fs.unlinkSync('affixes.json');	
} catch (err) {}

var dir = 'output/';
var outputFile = 'affixes';
var sourceFile = 'source/mods.json';
var affixes = {};
var sourceData = {};

/*------------------------------------- Read source data -----------------------------------*/

if (fs.existsSync(sourceFile)) {
    sourceData = jsonfile.readFileSync(sourceFile);
}
else {
	console.log(chalk.red("Source file not found:") + " 'source/mods.json'.");
	console.log(chalk.red("Exiting script."));
	process.exit(1);
}

/*------------------------ Filter data to only use non-unique mods -------------------------*/

for (var key in sourceData) {
    // skip loop if the property is from prototype
    if (!sourceData.hasOwnProperty(key)) continue;

    var obj = sourceData[key];
    if (obj.generation_type != 'unique') {
    	//console.log(key);
    	affixes[key] = obj;
    }
}

/*------------------------------------- Write output data -----------------------------------*/

var output = { "affixes" : affixes }
var file = dir + outputFile;

//pretty print (formatted) json
writeOutput(outputFile, 'formatted', '', {spaces: 4});
//minified json
writeOutput(outputFile, 'minified', '.min');	

function writeOutput(file, description, extension, options){
	jsonfile.writeFile(dir + file + extension + '.json', output, options, function(err) {
		if(err){
			console.error(err);
			console.log(chalk.red("Error writing json data."));
			console.log(chalk.red("Exiting script."));
			process.exit(1);	
		}
		else {
			console.log(chalk.green('Output JSON file saved (' + description + '):') + ' affixes' + extension + '.json');
		}
	});
};