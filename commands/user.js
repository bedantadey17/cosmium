const { SlashCommandBuilder } = require('@discordjs/builders');
const { Collection, Permissions } = require('discord.js');

const cooldowns = new Collection();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Displays information about a user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('User to get information about')),
  async execute(interaction) {
    const user = interaction.options.getUser('target') || interaction.user;

    if (cooldowns.has(user.id)) {
      await interaction.reply({ content: 'This command is on cooldown.', ephemeral: true });
      return;
    }

    const isAdmin = interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);

    const cooldownDuration = isAdmin ? 0 : 10000;
    cooldowns.set(user.id, true);
    setTimeout(() => cooldowns.delete(user.id), cooldownDuration);

    const createdAt = user.createdAt;
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = createdAt.toLocaleString('en-US', options);

    await interaction.reply({
      content: `**Username:** ${user.tag}\n**Member Since:** ${formattedDate}`,
      ephemeral: false,
    });
  },
};

// cooldown: 10 seconds
