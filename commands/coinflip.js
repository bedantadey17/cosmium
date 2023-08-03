const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('Flip a coin'),
	async execute(interaction) {
		const sides = ['Heads', 'Tails'];
		const result = sides[Math.floor(Math.random() * sides.length)];

		const embed = {
			color: 0x00ff00,
			description: `:coin: The coin landed on: **${result}**!`
		};

		await interaction.reply({ embeds: [embed] });
	},
};
