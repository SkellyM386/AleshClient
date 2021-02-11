# AleshClient
Alesh Posts stuff on his youtube and most people I run into that are new and don't know what or how to use discord.js-commando so this basically does what Alesh does with his command handler and the usage is pretty simple.<hr />
<br />
<h2>Updates</h2>
Added the plugin and play update which means all you have to do is copy that file put it in your code adn replace
<hr />
<h1>example usage</h1>

```js
const Client = require('./clientBase');

const client = new Client({}, 'commands', require('./config.json'));

```
<hr />
<h1>make a config file and set it up the file like so</h1>
<hr>

```json
{
  "token": "YOUR TOKEN",
  "prefix": "YOUR PREFIX"
}
```
