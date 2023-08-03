const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot\'s latency'),
  async execute(interaction) {
    const startTime = Date.now();
    await interaction.reply({ content: 'Pinging...', ephemeral: true });
    const endTime = Date.now();
    const latency = endTime - startTime;

    await interaction.editReply({ content: `:ping_pong: Pong! **Latency:** ${latency}ms`, ephemeral: true });
  },
};
