const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const axios = require('axios');

const cooldowns = new Map();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('urban')
		.setDescription('Searches Urban Dictionary for a term')
		.addStringOption(option =>
			option.setName('term')
				.setDescription('The term to search for')
				.setRequired(true)),

	async execute(interaction) {
		const term = interaction.options.getString('term');

		if (cooldowns.has(interaction.user.id) && !interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
			return interaction.reply({
				content: `This command is on cooldown.`,
				ephemeral: true
			});
		}

		try {
			const response = await axios.get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`);
			const data = response.data;

			if (data.list.length > 0) {
				const [definition] = data.list;

				const embed = new MessageEmbed()
					.setColor('#00ff00')
					.setTitle(term)
					.setDescription(definition.definition)
					.addFields(
						{ name: 'Example', value: definition.example },
						{ name: 'Author', value: definition.author }
					)
					.setFooter({ text: 'Powered by Urban Dictionary' });

				await interaction.reply({ embeds: [embed] });

				cooldowns.set(interaction.user.id, Date.now() + 5000); // 5 seconds cooldown
				setTimeout(() => {
					cooldowns.delete(interaction.user.id);
				}, 5000);
			} else {
				await interaction.reply({
					content: `No results found for **${term}**.`,
					ephemeral: true
				});
			}
		} catch (error) {
			await interaction.reply({
				content: 'An error occurred while searching for the term.',
				ephemeral: true
			});
		}
	},
};

// cooldown: 5 seconds
