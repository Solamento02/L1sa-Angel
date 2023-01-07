const {GuildMember} = require('discord.js');

module.exports = {
  name: 'stop',
  description: 'Stop all songs in the queue!',
  async execute(interaction, player) {
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
      return void interaction.reply({
        content: 'Você não está em um canal de voz!!😼!',
        ephemeral: true,
      });
    }

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
    ) {
      return void interaction.reply({
        content: 'Você não está em um canal de voz!!😼!',
        ephemeral: true,
      });
    }

    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: '❌ | Sem músicas!',
      });
    queue.destroy();
    return void interaction.followUp({content: '🛑 | Ok!Okay parei de arranhar seu sofá!😾'});
  },
};
