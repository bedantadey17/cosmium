const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
const express = require("express");
const app = express();


app.listen(3000, () => {
	console.log("Cosmium is up!");
});

app.get("/", (req, res) => {
	res.send("Hello, world!");
});

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
	client.user.setActivity('www.bedanta.tech', { type: 'WATCHING' });

	try {
		const commands = [];
		for (const file of commandFiles) {
			const command = require(`./commands/${file}`);
			commands.push(command.data.toJSON());
		}
		await client.application.commands.set(commands);
		console.log('Global slash commands registered.');
	} catch (error) {
		console.error('Failed to register global slash commands:', error);
	}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
	}
});

client.on('messageCreate', message => {
	if (message.author.bot) return;

	if (!message.channel.permissionsFor(client.user).has('SEND_MESSAGES')) {
		return;
	}

	// hello
	if (message.content.toLowerCase() === 'hello' || message.content.toLowerCase() === 'hi') {
		const reply = `Hello, ${message.author}!`;
		message.channel.send(reply);
	}

	// bye
	if (message.content.toLowerCase().includes('bye')) {
		const reply = `Bye-bye, ${message.author}!`;
		message.channel.send(reply);
	}
});

client.login(process.env.token);
