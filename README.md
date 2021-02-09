# AleshClient
Alesh Posts stuff on his youtube and most people I run into that are new and don't know what or how to use discord.js-commando so this basically does what Alesh does with his command handler and the usage is pretty simple.<hr />
<br />
<h1>Heres an example for those that just want the copy and paste but make sure you have the other files too!</h1>
```js
const Discord = require('discord.js');

const AleshClient = require('./clientBase');

const client = new AleshClient();

const prefix = '.';

const commands = client.createRegistry('commands');

client.login(require('./config.json').token).catch(console.log)

client.on('ready', () => console.log(`${client.user.username} has logged in!`))

const runCommand = (command) => new Promise(callback => {
  const usableCommands = commands.commands.filter(cmd => cmd.name === command || cmd.aliases.includes(command));
  if(!usableCommands.size)return;
  if(usableCommands.size !== 1)throw Error('multiple commands with the same name or alias found');
  callback(usableCommands.array()[0]);
});


client.on("message", async message => {
  const { content, author } = message;
  if (!content.startsWith(prefix) || author.bot) return;

  const args = content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  const cmd = await runCommand(command);
  cmd.execute({
    client: client,
    message: message,
    args: args,
    command: command,
    Discord: Discord,
  });
});
```
