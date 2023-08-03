const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say a message')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message to be sent')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
      return;
    }

    const message = interaction.options.getString('message');

    try {
      await interaction.deferReply({ ephemeral: true });

      await interaction.channel.send(message);

      await interaction.followUp({ content: 'Message sent!', ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.followUp({ content: 'Failed to send the message.', ephemeral: true });
    }
  },
};
