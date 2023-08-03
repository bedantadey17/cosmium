const { SlashCommandBuilder } = require('@discordjs/builders');
const math = require('mathjs');

let firstTimeUserSet = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calc')
    .setDescription('Perform calculations')
    .addStringOption(option =>
      option.setName('expression')
        .setDescription('Expression')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.channel.permissionsFor(interaction.client.user).has('SEND_MESSAGES')) {
      return;
    }

    const expression = interaction.options.getString('expression');
    let result;

    try {
      result = math.evaluate(expression);
    } catch (error) {
      await interaction.reply({
        content: 'Calculation error: Invalid expression.'
      });
      return;
    }

    // Check if the interaction has been replied to or deferred
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: `**Answer:** ${result}`
      });
    } else {
      await interaction.reply({
        content: `**Answer:** ${result}`
      });
    }

    // Display the additional message for the first-time user after the answer
    if (!firstTimeUserSet.has(interaction.user.id)) {
      await interaction.followUp({
        content: "This command uses the `mathjs` library. The library offers extensive documentation, so you can explore its capabilities further by visiting the `mathjs` website or checking out its documentation at https://mathjs.org/.\n**This message will no longer appear until a bot restart.**",
        ephemeral: true
      });
      firstTimeUserSet.add(interaction.user.id);
    }
  },
};
