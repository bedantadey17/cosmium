const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remind')
    .setDescription('Set a reminder')
    .addIntegerOption(option =>
      option.setName('time')
        .setDescription('Time in seconds')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reminder')
        .setDescription('Reminder message')
        .setRequired(true)),
  async execute(interaction) {
    const time = interaction.options.getInteger('time');
    const reminder = interaction.options.getString('reminder');

    if (!interaction.deferred) {
      await interaction.reply({ content: `I will remind you in ${time} seconds.`, ephemeral: true });
    }

    setTimeout(() => {
      if (!interaction.deferred) {
        interaction.user.send({ content: `Here's your reminder: \`${reminder}\``, ephemeral: true });
        interaction.followUp({ content: `${interaction.user}, here's your reminder: \`${reminder}\``, ephemeral: true }).catch(console.error);
      }
    }, time * 1000);
  },
};
