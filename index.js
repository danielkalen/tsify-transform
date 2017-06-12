var ts = require('typescript'),
	through = require('through2'),
	useStrict = /\"use strict\";\n/;


function compile(file, source, sourceMap) {
	var result = ts.transpileModule(source, {fileName:file, compilerOptions:{module:ts.ModuleKind.CommonJS, sourceMap:sourceMap}}),
		compiled = result.outputText;

	if (!useStrict.test(source)) {
		compiled = compiled.replace(useStrict, '');
	}

	return compiled
}

module.exports = function(file, options){
	var chunks = [],
		sourceMap = options._flags.sourceMap;

	return through(
		function(chunk, enc, done){
			chunks.push(chunk);
			done()
		},
		function(done){
			var source = Buffer.concat(chunks).toString();
			this.push(compile(file, source, sourceMap));
			done();
		}
	)
}
