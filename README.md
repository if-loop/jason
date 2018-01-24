![jason logo](https://raw.githubusercontent.com/if-loop/jason/master/public/img/logo_dark.png)
[offical source of jason.codefactory.at](http://jason.codefactory.at)

Jason is an excel to schema.org converter. It uses Jason Config files to map your excel sheet to the right schema.org annotation. For a demofile check /server/jasonConfig.json (it converts an excel of scholarly articles to the ScholarlyArticle schema.org annotation. 

## Mapping
Cells with uppercase text will be ignored (use them for heading)
The we iterate through every cell and use our custom mapping parameters:
- `$A$` means use the content of row A 
- `$NUM$` convers the content of row A into a Integer (using JavaScript parseInt() function)


## Setup
- npm install
- node ./server/index.js

Jason will be available through localhost:3000 

## Contributions
Feel free to contribute ;-)
