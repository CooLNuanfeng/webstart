#!/usr/bin/env node
var program = require('commander');
var package = require('./package.json');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var swig = require('swig');
var pwd = process.cwd();

program.version(package.version)
    .usage('mobile|pc')
    .option('-s, --sass','output sass file')
    .option('-v, --vue', 'import vue file')
    .option('-j, --jquery','import jquery file')

program
    .command('pc [name]')
    .description('create pc init pro')
    .action(function(name){
        var filename = name || 'demo';
        makeFile(filename,false);
    });

program
    .command('mobile [name]')
    .description('create mobile init pro')
    .action(function(name){
        var filename = name || 'demo';
        makeFile(filename,true);
    });


function makeFile(name,flage){
    let options = {
        'name' : name,
        'flag' : flage,
        'libs' : ['jquery'],
    }
    //vue
    program.vue && options.libs.push('vue');

    let template = swig.compileFile(path.join(__dirname,'tpl/tpl.html'));
    let html = template(options);

    mkdirp.sync(path.join(pwd,'images'));
    mkdirp.sync(path.join(pwd,'styles'));
    mkdirp.sync(path.join(pwd,'js'));
    //html
    fs.writeFileSync(pwd+'/'+name+'.html',html);
    //css
    fs.writeFileSync(pwd+'/styles/'+name+'.css','');
    //js
    let readStreamJs = fs.createReadStream(path.join(__dirname,'tpl/tpl.js'));
    let writeStreamJs = fs.createWriteStream(pwd+'/js/'+name+'.js');
    readStreamJs.pipe(writeStreamJs);
    //jquery
    let readStreamJquery = fs.createReadStream(path.join(__dirname,'tpl/jquery.js'));
    let writeStreamJquery = fs.createWriteStream(pwd+'/js/jquery.js');
    readStreamJquery.pipe(writeStreamJquery);
    //scss
    if(program.sass){
        let readStreamScss = fs.createReadStream(path.join(__dirname,'tpl/tpl.scss'));
        let writeStreamScss = fs.createWriteStream(pwd+'/styles/'+name+'.scss');
        readStreamScss.pipe(writeStreamScss);
    }
    //vue
    if(program.vue){
        let readStreamVue = fs.createReadStream(path.join(__dirname,'tpl/vue.js'));
        let writeStreamVue = fs.createWriteStream(pwd+'/js/vue.js');
        readStreamVue.pipe(writeStreamVue);
    }
}




program.on('--help',function(){
    console.log('');
    console.log('  Example: ');
    console.log('');
    console.log('  $ webstart mobile demo -s');
    console.log('');
});


program.parse(process.argv);
if(!program.args.length){
    program.help();
}
