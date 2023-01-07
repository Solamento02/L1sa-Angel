const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./Client/client.js');
const {Player} = require('discord-player');
const config = require('./config.json');
const prefix = "*"

const client = new Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const clientId = "seu clientId";
const guildId = "seu guildId";

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

console.log(client.commands);

client.on('messageCreate', async (msg) => {
  if(msg.content === prefix + 'Hey'){
    await msg.channel.send("Hey ' + msg.author.username");
  }
})

client.on('messageCreate', async (msg) => {
  if(msg.content === prefix + 'ping'){
       await msg.channel.send(`Pong! 🏓 ${Math.round(client.ws.ping)} ms `)
  }
});

client.on('messageCreate', async (msg) => {
  if(msg.content === prefix + 'teste'){
    await msg.channel.send("teste")
  }
});

const player = new Player(client);

player.on('error', (queue, error) => {
  console.log(`[${queue.guild.name}] Erro na fila😳 ${error.message}`);
});

player.on('connectionError', (queue, error) => {
  console.log(`[${queue.guild.name}] Erro na conexão😳 ${error.message}`);
});

player.on('trackStart', (queue, track) => {
  queue.metadata.send(`▶ | Começou a tocar 😸 **${track.title}** 🎶 **${queue.connection.channel.name}**!`);
});

player.on('trackAdd', (queue, track) => {
  queue.metadata.send(`🎶 | Música **${track.title}** adicionada a fila!😸`);
});

player.on('botDisconnect', queue => {
  queue.metadata.send(' 😿 | Fui desconectada do chat de voz..');
});

player.on('channelEmpty', queue => {
  queue.metadata.send('😿 | Não tem ninguém aqui..');
});

player.on('queueEnd', queue => {
  queue.metadata.send('✅ | Sem mais músicas! Urf, urf🐈');
});

client.on("ready", () => {
  console.log(`Bot foi iniciado com sucesso, estou com ${client.users.cache.size} usuários online, em ${client.channels.cache.size} canais,  em ${client.guilds.cache.size} servidores`);
  client.user.setActivity(`Hey! Sou a Lisa e estou em ${client.guilds.cache.size} servidores! 😸`);
});

client.on("ready", () => {
  console.log(`Prontinho!!Meooow..Logado como ${client.user.tag}😸`);
});

client.once('reconnecting', () => {
  console.log('Reconnecting!');
});

client.once('disconnect', () => {
  console.log('Disconnect!');
});

client.on('messageCreate', async (msg) => {
  if (msg.content === '!deploy'){
    await msg.guild.commands
      .set(client.commands)
      .then(() => {
        msg.reply('Deployed!');
      })
      .catch(err => {
        msg.reply('Não deu o deploy😿');
        console.error(err);
      });
  }
});

client.on('interactionCreate', async interaction => {
  const command = client.commands.get(interaction.commandName.toLowerCase());

  try {
    if ( interaction.commandName == 'userinfo') {
      command.execute(interaction, client);
    } else {
      command.execute(interaction, player);
    }
  } catch (error) {
    console.error(error);
    interaction.followUp({
      content: 'Opa! Deu erro😳',
    });
  }
});

client.login(config.token);
