const Discord = require('discord.js');

const fs = require('fs');

module.exports = class Client extends Discord.Client {
  constructor(clientoptions, commandFile, config){
    super(clientoptions);

    this.login(config.token).catch(console.log);


    this.commands = new Discord.Collection();

    const commands = fs.readdirSync(commandFile).filter(file => file.endsWith('.js'));

    const usedCommands = [];

    for(const file of commands){
      const command = require(`./${commandFile}/${file}`);

      const reformCommand = (cmd) => {
        let object = { command: cmd };
        if(!cmd)return {};
        if(cmd.cooldown)if(cmd.cooldown >= 0){
          object.cooldown = {
            recentlyUsed: new Set(),
            duration: cmd.cooldown
          };
        };
        return object;
      }
      console.log(`Registered Command ${command.name} in file ${file}`)
      this.commands.set(command.name, reformCommand(command));
    }

    this.run = (message, command, req) => {
      const cmds = this.commands.filter(cmd => cmd.command.name === command || (cmd.command.aliases ? cmd.command.aliases.includes(command): false));
      if(!cmds)return;
      if(cmds.size < 1)return;
      const selectedCommand = cmds.get(cmds.first().command.name);
      const hasCooldown = (selectedCommand.cooldown ? selectedCommand.cooldown: false);
      if(!hasCooldown)return selectedCommand.command.execute(req);
      if(selectedCommand.cooldown.recentlyUsed.has(message.author.id))return message.channel.send(`your on cooldown please wait ${selectedCommand.cooldown.duration * 0.001} seconds`);
      selectedCommand.cooldown.recentlyUsed.add(message.author.id);
      setTimeout(() => {
        return selectedCommand.cooldown.recentlyUsed.delete(message.author.id);
      }, selectedCommand.cooldown.duration);
      return selectedCommand.command.execute(req);
    };

    this.on('message', message => { try {
      if (!message.content.startsWith(config.prefix) || message.author.bot) return;

      const args = message.content.slice(config.prefix.length).trim().split(/ /);
      const command = args.shift().toLowerCase();

      const req = {
        Discord: Discord,
        message: message,
        prefix: config.prefix,
        command: command,
        args: args,
      };

      this.run(message, command, req);
    } catch(e){
      return;
    }
    })
  }
}
