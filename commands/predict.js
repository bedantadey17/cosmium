const { SlashCommandBuilder } = require('@discordjs/builders');
const { Collection, Permissions } = require('discord.js');

const cooldowns = new Collection();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('predict')
    .setDescription('Contact Cosmium Predictors™ to get your prediction')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('Your question')
        .setRequired(true)),
  async execute(interaction) {

    const user = interaction.user;
    if (cooldowns.has(user.id)) {
      await interaction.reply({ content: 'This command is on cooldown.', ephemeral: true });
      return;
    }

    const isAdmin = interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);

    const cooldownDuration = isAdmin ? 0 : 10000;
    cooldowns.set(user.id, true);
    setTimeout(() => cooldowns.delete(user.id), cooldownDuration);

    const responses = [
      "Yes, of course!",
      "Maybe...",
      "Not a chance.",
      "I have no idea about this.",
			"Highly likely!",
			"Possibly...",
			"Unlikely.",
			"Try your luck.",
    ];

    const question = interaction.options.getString('question');
    const response = responses[Math.floor(Math.random() * responses.length)];

    await interaction.reply(`**Question:** ${question}\n**Answer:** ${response}`);
  },
};

// cooldown: 10 seconds