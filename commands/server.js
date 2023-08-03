const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

const serverCooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Get information about the server'),
  cooldown: 10,
  cooldownExclusions: new Permissions(['ADMINISTRATOR']),

  async execute(interaction) {
    const { user, guild } = interaction;

    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      const cooldown = this.cooldown * 1000;
      const userCooldown = serverCooldowns.get(user.id);

      if (userCooldown && Date.now() - userCooldown < cooldown) {
        const remainingCooldown = (cooldown - (Date.now() - userCooldown)) / 1000;
        await interaction.reply({
          content: `This command is on cooldown.`,
          ephemeral: true
        });
        return;
      }
    }

    const { name, ownerId, memberCount, createdAt } = guild;
    const owner = await interaction.client.users.fetch(ownerId);

    await interaction.reply({
      content: `**Server Name:** ${name}\n**Owner:** ${owner.tag}\n**Member Count:** ${memberCount}\n**Created On:** ${createdAt.toUTCString()}`
    });

    serverCooldowns.set(user.id, Date.now());
    setTimeout(() => {
      serverCooldowns.delete(user.id);
    }, this.cooldown * 1000);
  },
};

// cooldown: 10 sec