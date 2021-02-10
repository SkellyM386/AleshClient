module.exports = {
  name: "ping",
  aliases: ['pang', 'getping'],
  group: "basic",
  execute(req){
    const { client, message } = req, { ws } = client
    , ts = 'createdTimestamp';
    message.channel.send('pong')
    .then(m => m.edit(`Pong: \n\`\`\`Your Ping:${message[ts] - m[ts]}\nBot Ping: ${ws.ping}\`\`\``));
  }
}
