const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Displays the avatar of a user')
    .addUserOption(option => option.setName('target').setDescription('The user to show the avatar for')),
  async execute(interaction) {
    const isAdministrator = interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
    
    if (!isAdministrator && cooldowns.has(interaction.user.id)) {
      await interaction.reply('This command is on cooldown.');
      return;
    }

    const user = interaction.options.getUser('target') || interaction.user;
    const avatarEmbed = new MessageEmbed()
      .setTitle(`Avatar of ${user.tag}`)
      .setImage(user.avatarURL({ format: 'png', dynamic: true, size: 4096 })) // Request the avatar in PNG format
      .setColor('#7289DA');

    // Add a link to download the avatar
    avatarEmbed.setDescription(`[Click here to download this avatar.](${user.avatarURL({ format: 'png', dynamic: true, size: 4096 })})`);


    await interaction.reply({ embeds: [avatarEmbed] });

    if (!isAdministrator) {
      cooldowns.set(interaction.user.id, Date.now());
      setTimeout(() => cooldowns.delete(interaction.user.id), 10000);
    }
  },
};

// cooldown: 10 seconds
