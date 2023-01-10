const { Client, Events, GatewayIntentBits, Collection, Routes, REST } = require('discord.js');
const path = require("path");
const fs = require("fs");
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const client = new Client({
    intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
	],
});
const dotenv = require("dotenv");
dotenv.config();
const token = process.env.TOKEN;
const clientId = process.env.CLIENTID;
const guildId = process.env.GUILDID;
console.log(token, clientId, guildId);

client["commands"] = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commands = [];
const exCommands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    exCommands.push(command);
    
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
        );
        client.commands = await new Collection(Object.entries(commands).map((value,i)=>[value[1].name,exCommands[i]]));

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

const buttonInteraction = (interaction)=>{
    console.log(interaction);
    if(interaction.customId=="success"){

        const channel = interaction.guild.channels.cache.find(channel=>channel.id=="1062046923164504148"?channel:false)
        if(!channel) return
        const {content, embeds} = interaction.message
        channel.send({content, embeds})
    }

    if(interaction.customId=="danger"){
        interaction.message.delete();
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if(interaction.isButton()) return await buttonInteraction(interaction);
    if (!interaction.isChatInputCommand()) return;
    
    const command = interaction.client.commands.get(interaction.commandName);
        

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
    if(command.cooldown){
        if(!command.users){
            console.log("new collection");
            
            command.users = new Collection();
        }
    }
    
	try {
        const cooldown = command.users.has(interaction.user.id);
        if(!cooldown){
            await command.execute(interaction);
            command.users.set(interaction.user.id, true)
            setTimeout(()=>{
                command.users.delete(interaction.user.id)
            }, command.cooldown * 1000);
        }else{
    	    await interaction.reply({ content: 'You have to wait 30sec between every itteration of this command', ephemeral: true });
        }
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('guildMemberAdd', member=>{
    const role= member.guild.roles.cache.find(role => role.id === "553863312132014090");
    console.log(member);
    
    if(!role) return console.log("role not found");
    
    member.roles.add(role);
    console.log(`added role ${role.name} to ${member.username}`);
    
})

client.login(token);