const Discord = require('discord.js');

const fs = require('fs');

module.exports = class AleshClient extends Discord.Client {
  constructor(clientOptions) {
    super(clientOptions);

    class CommandRegistry {
      constructor(commandFolder) {
        this.commands = new Discord.Collection();

        const commandFiles = fs.readdirSync(`./${commandFolder}/`).filter(file => (file.endsWith('.js') || !file.includes('.') && file !== 'procfile'));

        for(const file of commandFiles){
          const command = require(`./${commandFolder}/${file}`);

          this.commands.set(command.name, command);
        };
      }
    };

    this.createRegistry = (commandFolder) => new CommandRegistry(commandFolder);

  }
}
