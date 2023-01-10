namespace Command {
    const {
        SlashCommandBuilder,
        EmbedBuilder,
        PermissionFlagsBits,
        ButtonBuilder,
        ButtonStyle,
        ActionRowBuilder
    } = require('discord.js');

    module.exports = {
        data: new SlashCommandBuilder()
            .setName('annonce')
            .setDescription('Send an embeded announcement on the channel "Annonce" as the Lorem user')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addStringOption(option =>
                option
                .setName('title')
                .setDescription('What is the purpose of the announcement ?')
                .setRequired(true))
            .addStringOption(option =>
                option
                .setName('type')
                .setDescription('What is the purpose of the announcement ?')
                .setRequired(true)
                .addChoices({
                    name: 'discord',
                    value: 'Discord'
                }, {
                    name: 'jeux',
                    value: 'Jeux'
                }, {
                    name: 'technique',
                    value: 'Tecnique'
                }, {
                    name: 'autre',
                    value: 'Autre'
                }, ))
            .addStringOption(option =>
                option
                .setName('description')
                .setDescription('description of the announcement')
                .setRequired(true))
            .addStringOption(option =>
                option
                .setName('content')
                .setDescription('Message of the announcement (use ;; for line breaking)')
                .setRequired(true))

            .addStringOption(option =>
            option
            .setName('thread')
            .setDescription('Do you need a thread created for this announcement ?')
            .setRequired(true)
            .addChoices({
                name: 'No',
                value: '0'
            }, {
                name: 'Yes',
                value: '1'
            }))

            .addStringOption(option =>
                option
                .setName('tageveryone')
                .setDescription('Do you to tag everyone ?')
                .setRequired(true)
                .addChoices({
                    name: 'No',
                    value: '0'
                }, {
                    name: 'Yes',
                    value: '1'
                }))
            .addStringOption(option =>
                option
                .setName('anonymous')
                .setDescription('Is this an anonymous announcement')
                .setRequired(true)
                .addChoices({
                    name: 'No',
                    value: '0'
                }, {
                    name: 'Yes',
                    value: '1'
                }))

            .addStringOption(option =>
            option
            .setName('public')
            .setDescription('Is this a public or private announcement')
            .setRequired(true)
            .addChoices({
                name: 'private',
                value: '0'
            }, {
                name: 'public',
                value: '1'
            })),
        cooldown: 30,
        async execute(interaction) {
            const get = (name) => {
                return interaction.options.getString(name);
            }
            const channelid = get("public") == "1" ? "1062046923164504148" : "700046976879689739";
            const channel = interaction.guild.channels.cache.find(channel => channel.id == channelid ? channel : false)
            if (!channel) return
            const type = get("type");
            let author = interaction.user.username;
            let color = "0xCCCCCC"
            if (get("anonymous") == "1") {
                author = "Lorem"
            }
            switch (type) {
                case "Discord":
                    color = "0x6699ff"
                    break;

                case "Jeux":
                    color = "0xff6666"
                    break;

                case "Technique":
                    color = "0x669900"
                    break;
            }
            const message = new EmbedBuilder()
                .setColor(color)
                .setThumbnail(interaction.guild.iconURL())
                .setTitle(get("title"))
                .setDescription(`*${get("description")}*`)
                .addFields({
                    name: "||>||",
                    value: get("content").replaceAll(";;", "\n")
                })
                .addFields({
                    name: "||>||",
                    value: "*Vous pouvez réagir soit à l'aide des réaction en desssous, soit par message sur d'autres canaux de discussion ! 😊*"
                })
                .setTimestamp(Date.now())
                .setAuthor({
                    name: "Par " + author
                })
                .setFooter({
                    text: `Type ${type}`
                });

                const buttonSendToPublic = new ButtonBuilder()
                .setCustomId('success')
                .setLabel('Passer en public')
                .setStyle(ButtonStyle.Success);
                const buttonDelete = new ButtonBuilder()
                    .setCustomId('danger')
                    .setLabel('Supprimer')
                    .setStyle(ButtonStyle.Danger);
            let row;
            if(get("public") == "0"){
                row = new ActionRowBuilder()
                .addComponents(
                    buttonSendToPublic, buttonDelete
                )
            }
            channel.send({
                    content: `${get("tageveryone")=="1"?"@everyone":""}`,
                    embeds: [message],
                    components:[row]
                })
                .then(message => {
                    message.react('✅')
                    message.react('❌')
                    message.react('😐')
                })
            if (get("thread") == "1") {
                const thread = await channel.threads.create({
                    name: `React : ${get("title")}`,
                    autoArchiveDuration: 4320,
                    reason: `Vous pouvez réagir à l'annonce "${get("title")}"`,
                });
            }
            interaction.reply("☜(ﾟヮﾟ☜)")
        },
    };
}