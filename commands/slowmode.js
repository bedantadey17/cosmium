const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set the slowmode of the channel')
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Duration in seconds (Enter 0 to turn off slowmode)')
    ),
  async execute(interaction) {
    const isAdmin = interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);

    if (!isAdmin) {
      await interaction.reply({ content: 'You are not allowed to use this command.', ephemeral: true });
      return;
    }

    const duration = interaction.options.getInteger('duration');
    const channel = interaction.channel;

    try {
      await channel.setRateLimitPerUser(duration);
      if (duration === 0) {
        await interaction.reply('Slowmode has been cleared in this channel.');
      } else {
        await interaction.reply(`Slowmode has been set to ${duration} seconds in this channel.`);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply('An error occurred while setting or clearing slowmode.');
    }
  },
};
