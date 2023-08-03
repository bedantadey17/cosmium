const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const translate = require('@iamtraction/google-translate');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translate text to the specified language')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Text to translate')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('language')
        .setDescription('Target language')
        .setRequired(true)),
  async execute(interaction) {
    const commandName = this.data.name;

    // Initialize the cooldowns property if it doesn't exist
    if (!interaction.client.cooldowns) {
      interaction.client.cooldowns = new Map();
    }

    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      const { cooldowns } = interaction.client;
      const userCooldowns = cooldowns.get(interaction.user.id) || new Map();

      if (userCooldowns.has(commandName)) {
        const expirationTime = userCooldowns.get(commandName) + 5000;

        if (Date.now() < expirationTime) {
          const timeLeft = (expirationTime - Date.now()) / 1000;
          return interaction.reply({
            content: `This command is on cooldown.`,
            ephemeral: true
          });
        }
      }

      userCooldowns.set(commandName, Date.now());
      cooldowns.set(interaction.user.id, userCooldowns);
    }

    const text = interaction.options.getString('text');
    const language = interaction.options.getString('language');

    try {
      const translatedText = await translate(text, { to: language });

      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Cosmium Translate')
        .addFields(
          { name: 'Original Text', value: text },
          { name: 'Translated Text', value: translatedText.text },
        );

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      return interaction.reply({ content: 'An error occurred while translating the text.', ephemeral: true });
    }
  },
};
