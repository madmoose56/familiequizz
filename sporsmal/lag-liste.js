// Lager lister.json med alle .csv-filer i denne mappen. Kjør: node sporsmal/lag-liste.js
var fs=require('fs'),path=require('path');
var files=fs.readdirSync(__dirname).filter(function(f){return /\.csv$/i.test(f)}).sort();
fs.writeFileSync(path.join(__dirname,'lister.json'),JSON.stringify(files,null,1)+'\n');
console.log(files.length+' lister: '+files.join(', '));
