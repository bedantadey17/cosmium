const { SlashCommandBuilder } = require('@discordjs/builders');
const { Collection, Permissions } = require('discord.js');

const effectivenessMessages = [
  ":boom: It's super effective!",
  ":dash: It's not very effective...",
  ":exclamation: But it failed!",
  ":grey_exclamation: But it missed!",
  ":no_entry_sign: It didn't affect {target}...",
  ":x: It doesn't affect {target}..."
];

const cooldowns = new Collection();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('punch')
    .setDescription('Punch a target user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('User to punch')
        .setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getMember('target');

    await performAction(interaction, target, 'punched');
  },
};

async function performAction(interaction, target, action) {
  const user = interaction.user;

  if (cooldowns.has(user.id) && !interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
    await interaction.reply({ content: 'This command is on cooldown.', ephemeral: true });
    return;
  }

  const effectiveness = effectivenessMessages[Math.floor(Math.random() * effectivenessMessages.length)];
  const message = `**${user} ${action} ${target}!**\n${effectiveness.replace('{target}', target)}`;

  await interaction.reply(message);

  const isAdmin = interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
  const cooldownDuration = isAdmin ? 0 : 2000;
  cooldowns.set(user.id, true);
  setTimeout(() => cooldowns.delete(user.id), cooldownDuration);
}
