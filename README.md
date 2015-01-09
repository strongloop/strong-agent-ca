strong-agent-ca
===============

strong-agent plugin that sends metrics to a CA EPAgent using its REST API.

## Usage

Install as dependency of application:
```
$ npm install --save strong-agent-ca
```

Configure stronga-agent to use strong-agent-ca repoter:
```js
var ca = require('strong-agent-ca')({ port: 8000 });
require(strong-agent).use(ca);

// your code here!
```

---
Copyright &copy; 2014-2015 StrongLoop
