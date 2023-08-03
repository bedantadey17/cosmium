const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Deletes a specified number of recent messages')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of recent messages to delete')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
      return;
    }

    const amount = interaction.options.getInteger('amount');

    if (isNaN(amount) || amount <= 0) {
      await interaction.reply({ content: 'Please provide a valid positive number.', ephemeral: true });
      return;
    }

    const channel = interaction.channel;

    await interaction.deferReply({ ephemeral: true });

    try {
      const messagesToDelete = await channel.messages.fetch({ limit: amount });
      const filteredMessages = messagesToDelete.filter(m => !m.pinned);

      await channel.bulkDelete(filteredMessages, true);

      await interaction.editReply({ content: `Deleted ${filteredMessages.size} messages.` });
    } catch (error) {
      console.error('Error deleting messages:', error);

      await interaction.editReply({ content: 'An error occurred while deleting messages.', ephemeral: true });
    }
  },
};
