const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays available commands'),

  async execute(interaction) {
    const commands = interaction.client.commands;

    const helpEmbed = new MessageEmbed()
      .setColor('#00ff00')
      .setTitle('Command List')
      .setDescription('Here are the available commands:')
      .setFooter({ text: 'Version: 0.0.4 | Created by @thatcosmo | bedantadey17.github.io | discord.gg/wGC3nYP2F9' })

    commands.forEach((command) => {
      helpEmbed.addFields(
        { name: `/${command.data.name}`, value: command.data.description }
      );
    });

    await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
  },
};
