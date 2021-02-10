const Discord = require('discord.js');
const Duration = require('humanize-duration');


const fs = require('fs');
const { type } = require('os');
const { execute } = require('./commands/ping');

module.exports = class AleshClient extends Discord.Client {
  constructor(clientOptions) {
    super(clientOptions);

    class CommandRegistry {
      constructor(commandFolder) {
        this.commands = new Discord.Collection();
        this.cooldown = null;

        const commandFiles = fs.readdirSync(`./${commandFolder}/`).filter(file => (file.endsWith('.js') || !file.includes('.') && file !== 'procfile'));

        for(const file of commandFiles){
          const command = require(`./${commandFolder}/${file}`);

          this.commands.set(command.name, command);
        };

        this.commandFilter = (commands = this.commands, command) => {
          const usableCommands = commands.filter(cmd => {
            if(cmd.name)if(cmd.name === command)return true;
            if(cmd.aliases)if(cmd.aliases.includes(command))return true;
            return false;
        });
        return usableCommands;
      };

      this.commands.run = (message = new Discord.Message, command, req) => {
        const cmd = this.commandFilter(this.commands, command).first();
        if(cmd)return cmd.execute(req);
        return;
      };

      this.custom = {
        help: () => {
          let commands = [];
          let pushContent = (obj = new Object, property = String()) => {
            return (obj[property] ? obj[property]: undefined);
          };
          for(const cmd of this.commands.array().filter(val => typeof val === 'object')){
            commands.push({
              name: pushContent(cmd, 'name'),
              memberName: (cmd['memberName'] ? cmd['memberName']: (cmd['name'] ? cmd['name']: null)),
              description: pushContent(cmd, 'description'),
              examples: pushContent(cmd, 'examples'),
              group: pushContent(cmd, 'group'),
              theme: pushContent(cmd, 'theme'),
            });
          };

          let commandGroups = [];

          this.commands.forEach(command => {
            if(!commandGroups.includes(command.group))commandGroups.push({ name: command.group, commands: [] });
          });
          this.commands.forEach(command => {
            if(command.group){
              commandGroups.find(group => group.name === command.group).commands.push(command.name);
            }
          });
          if(commandGroups.find(group => group.name === 'other').commands.length < 1)commandGroups.shift();
          return commandGroups;
        }
      };

      const commands = this.commands;
      const custom = this.custom;

      this.registerHelpCommand = () => {
        this.commands.set('help', {
          name: "help",
          group: "other",
          description: "show what commands are on this bot",
          execute({ message } = req){
      let embed = new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setAuthor(message.author.username, message.author.avatarURL());
      const groups = custom.help();
      for(const group of groups){
        let groupCommands = [];
        for(const cmd of group.commands)groupCommands.push(cmd.name);
        let stringOfCommands = `\`${group.commands.join('\`, \`')}\``;
        embed.addField(`__**${group.name}**__`, stringOfCommands)
      };
      message.channel.send(embed);
        }
    })
  }

    };
   };


    this.createRegistry = (commandFolder) => new CommandRegistry(commandFolder);

  }
}
