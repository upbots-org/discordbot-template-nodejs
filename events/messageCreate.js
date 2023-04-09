/**
 * Copyright (c) 2023 - present | LuciferMorningstarDev <contact@lucifer-morningstar.xyz>
 * Copyright (c) 2023 - present | whackdevelopment.com <contact@whackdevelopment.com>
 * Copyright (c) 2023 - present | whackdevelopment.com team and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

'use strict'; // https://www.w3schools.com/js/js_strict.asp

/**********************************************************************/

/**
 * @author LuciferMorningstarDev
 * @since 1.0.0
 */

// Declares constants (destructured) to be used in this file.

const { Collection, ChannelType, EmbedBuilder, WebhookClient, Message } = require('discord.js');

const GuildSettings = require('../models/guilds/GuildSettings');

const color = require('../configurations/colors');
const logs = require('../configurations/logs');
const avatar = require('../configurations/avatars');

const ChannelCommandStats = require('../models/stats/ChannelCommandStats');
const DmCommandStats = require('../models/stats/DmCommandStats');
const GlobalCommandStats = require('../models/stats/GlobalCommandStats');
const GuildCommandStats = require('../models/stats/GuildCommandStats');
const GroupDmCommandStats = require('../models/stats/GroupDmCommandStats');

// Prefix regex, we will use to match in mention prefix.

const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

module.exports = {
    name: 'messageCreate',
    /**
     *
     * @param {Message} message
     * @param {Client} client
     * @returns
     */
    async execute(message, client) {
        // Declares const to be used.

        const { guild, channel, content, author } = message;
        const { prefix, owner } = client.configs.general;

        // Checks if the bot is mentioned in the message all alone and triggers onMention trigger.
        // You can change the behavior as per your liking at ./messages/onMention.js
        // TODO: add translation
        if (message.content == `<@${client.user.id}>` || message.content == `<@!${client.user.id}>`) {
            require('../messages/onMention').execute(message, client);
            return;
        }

        /**
         * @description Converts prefix to lowercase.
         */

        const checkPrefix = prefix.toLowerCase();

        /**
         * @description Regex expression for mention prefix
         */

        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(checkPrefix)})\\s*`);

        // Checks if message content in lower case starts with bot's mention.

        if (!prefixRegex.test(content.toLowerCase())) return;

        /**
         * @description Checks and returned matched prefix, either mention or prefix in config.
         */

        const [matchedPrefix] = content.toLowerCase().match(prefixRegex);

        /**
         * @description The Message Content of the received message seperated by spaces (' ') in an array, this excludes prefix and command/alias itself.
         */

        const args = content.slice(matchedPrefix.length).trim().split(/ +/);

        /**
         * @description Name of the command received from first argument of the args array.
         */

        const commandName = args.shift().toLowerCase();

        // Check if mesage does not starts with prefix, or message author is bot. If yes, return.

        if (!message.content.startsWith(matchedPrefix) || message.author.bot) return;

        const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

        // It it's not a command, return :)

        if (!command) return;

        // Owner Only Property, add in your command properties if true.

        if (command.ownerOnly && message.author.id !== owner) {
            // TODO: add translation
            return message.reply({ content: 'This is a owner only command!' });
        }

        // Guild Only Property, add in your command properties if true.

        if (command.guildOnly && message.channel.type === ChannelType.DM) {
            // TODO: add translation
            return message.reply({
                content: "I can't execute that command inside DMs!"
            });
        }

        // Author perms property
        // Will skip the permission check if command channel is a DM. Use guildOnly for possible error prone commands!

        if (command.permissions && message.channel.type !== ChannelType.DM) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                // TODO: add translation
                return message.reply({ content: 'You can not do this!' });
            }
        }

        // Args missing

        if (command.args && !args.length) {
            // TODO: add translation
            let reply = `You didn't provide any arguments, ${message.author}!`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send({ content: reply });
        }

        // Cooldowns

        const { cooldowns } = client;

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                // TODO: add translation and respond wait x seconds
                return;
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        // Rest your creativity is below.

        // execute the final command. Put everything above this.
        try {
            command.execute(message, args);
        } catch (error) {
            client.out.error(error);
        }

        /**********************************************************************/ /**********************************************************************/
        /**********************************************************************/ /**********************************************************************/
        /**********************************************************************/ /**********************************************************************/

        // COMMAND STATS

        let d = new Date();
        d.setHours(0, 0, 0, 0);

        // A try to executes the message.

        if (message?.channel?.type == ChannelType.DM) {
            const dataDmCommandStats = await DmCommandStats.findOne({
                date: d,
                userId: message.author.id,
                dmChannelId: message.channel.id
            });

            if (dataDmCommandStats) {
                if (dataDmCommandStats.commands.find((x) => x.id == commandName)) {
                    dataDmCommandStats.commands.map((x) => {
                        if (x.id == commandName) x.count += 1;
                        return x;
                    });
                } else {
                    dataDmCommandStats.commands.push({ id: commandName, count: 1 });
                }

                await dataDmCommandStats.save();
            } else {
                await DmCommandStats.create({
                    commands: [{ id: commandName, count: 1 }],
                    dmChannelId: message.channel.id,
                    userId: message.author.id,
                    date: d
                });
            }
        }

        // GroupDmCommandStats

        if (message?.channel?.type == ChannelType.GroupDM) {
            const dataGroupDmCommandStats = await GroupDmCommandStats.findOne({
                date: d,
                userId: message.author.id,
                dmChannelId: message.channel.id
            });

            if (dataGroupDmCommandStats) {
                if (dataGroupDmCommandStats.commands.find((x) => x.id == commandName)) {
                    dataGroupDmCommandStats.commands.map((x) => {
                        if (x.id == commandName) x.count += 1;
                        return x;
                    });
                } else {
                    dataGroupDmCommandStats.commands.push({ id: commandName, count: 1 });
                }

                await dataGroupDmCommandStats.save();
            } else {
                await GroupDmCommandStats.create({
                    commands: [{ id: commandName, count: 1 }],
                    dmChannelId: message.channel.id,
                    userId: message.author.id,
                    date: d
                });
            }
        }

        // ChannelCommandStats

        if (message?.channel?.type != ChannelType.DM && message?.channel?.type != ChannelType.GroupDM) {
            const dataChannelCommandStats = await ChannelCommandStats.findOne({
                date: d,
                userId: message.author.id,
                channelId: message.channel.id,
                guildId: message.guild.id
            });

            if (dataChannelCommandStats) {
                if (dataChannelCommandStats.commands.find((x) => x.id == commandName)) {
                    dataChannelCommandStats.commands.map((x) => {
                        if (x.id == commandName) x.count += 1;
                        return x;
                    });
                } else {
                    dataChannelCommandStats.commands.push({ id: commandName, count: 1 });
                }

                await dataChannelCommandStats.save();
            } else {
                await ChannelCommandStats.create({
                    commands: [{ id: commandName, count: 1 }],
                    channelId: message.channel.id,
                    guildId: message.guild.id,
                    userId: message.author.id,
                    date: d
                });
            }
        }

        // GuildCommandStats

        if (message?.guild) {
            const dataGuildCommandStats = await GuildCommandStats.findOne({
                date: d,
                userId: message.author.id,
                guildId: message.guild.id
            });

            if (dataGuildCommandStats) {
                if (dataGuildCommandStats.commands.find((x) => x.id == commandName)) {
                    dataGuildCommandStats.commands.map((x) => {
                        if (x.id == commandName) x.count += 1;
                        return x;
                    });
                } else {
                    dataGuildCommandStats.commands.push({ id: commandName, count: 1 });
                }

                await dataGuildCommandStats.save();
            } else {
                await GuildCommandStats.create({
                    commands: [{ id: commandName, count: 1 }],
                    guildId: message.guild.id,
                    userId: message.author.id,
                    date: d
                });
            }
        }

        // GlobalCommandStats

        const dataGlobalCommandStats = await GlobalCommandStats.findOne({
            date: d,
            userId: message.author.id
        });

        if (dataGlobalCommandStats) {
            if (dataGlobalCommandStats.commands.find((x) => x.id == commandName)) {
                dataGlobalCommandStats.commands.map((x) => {
                    if (x.id == commandName) x.count += 1;
                    return x;
                });
            } else {
                dataGlobalCommandStats.commands.push({ id: commandName, count: 1 });
            }

            await dataGlobalCommandStats.save();
        } else {
            await GlobalCommandStats.create({
                commands: [{ id: commandName, count: 1 }],
                userId: message.author.id,
                date: d
            });
        }

        // Logs

        const forumChannel = client.channels.cache.get(logs.interactionsForumChannelId);

        if (!forumChannel) return client.out.alert('No forumChannel found', this.name);

        const webhooks = await forumChannel.fetchWebhooks();

        let webhook = null;

        if (webhooks.find((x) => x.name == 'Command')) {
            webhook = new WebhookClient({ url: webhooks.find((x) => x.name == 'Command').url });
        } else {
            webhook = await forumChannel.createWebhook({ name: 'Command', avatar: avatar.command });
        }

        // This Command's stats in every guild (total time)

        const dataGlobalCommandCount = await GlobalCommandStats.find({});

        let a = 0;

        dataGlobalCommandCount.forEach((x) => {
            if (x.commands.find((x) => x.id === commandName)) {
                a += x.commands.find((x) => x.id === commandName).count;
            }
        });

        const dataGlobalCommandCountToday = await GlobalCommandStats.find({ date: d });

        let e = 0;

        dataGlobalCommandCountToday.forEach((x) => {
            if (x.commands.find((x) => x.id === commandName)) {
                e += x.commands.find((x) => x.id === commandName).count;
            }
        });

        let webhookGuilds = null;

        if (message.guild) {
            // This Command's stats in this guild (total time)

            const dataGuildCommandCount = await GuildCommandStats.find({ guildId: message.guild.id });

            let b = 0;

            dataGuildCommandCount.forEach((x) => {
                if (x.commands.find((x) => x.id === commandName)) {
                    b += x.commands.find((x) => x.id === commandName).count;
                }
            });

            const dataGuildCommandCountTodaay = await GuildCommandStats.find({ guildId: message.guild.id, date: d });

            let f = 0;

            dataGuildCommandCountTodaay.forEach((x) => {
                if (x.commands.find((x) => x.id === commandName)) {
                    f += x.commands.find((x) => x.id === commandName).count;
                }
            });

            // Fetching GuildSettings

            let dataGuildSettings = null;

            dataGuildSettings = await GuildSettings.findOne({ id: message.guild.id });

            if (!dataGuildSettings) {
                client.out.alert('No dataGuildSettings', this.name);
            }

            // Sending Logs

            webhook
                .send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(color.command)
                            .setFooter({
                                text: client.configs.footer.defaultText,
                                iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : ''
                            })
                            .setDescription(
                                `> __**Informations**__\n→ Guild: **${message.guild.name}** (||${message.guild.id}||) [${
                                    message.guild.memberCount
                                } Members - <t:${parseInt(message.guild.createdTimestamp / 1000)}:R>]\n→ Language: **${
                                    dataGuildSettings.language
                                }**\n→ Channel: **#${message.channel.name}** (||${message.channel.id}||) [<t:${parseInt(
                                    message.channel.createdTimestamp / 1000
                                )}:R>]\n→ User: **${message.author.tag}** (||${message.author.id}||) [<t:${parseInt(
                                    message.author.createdTimestamp / 1000
                                )}:R>]\n\n> __**Usage-data**__\n→ Command: **${commandName}** (||${commandName}||)\n→ Today [Guild / Global  / On this guild]: **${f} / ${e} (${parseInt(
                                    (f / e) * 100
                                )}%)**\n→ All-Time [Guild / Global / On this guild]: **${b} / ${a} (${parseInt((b / a) * 100)}%)**`
                            )
                            .setTimestamp()
                    ],
                    threadId: client.configs.logs.commandThreadId
                })
                .catch((err) => {
                    client.out.warn('Error with LogWebhookUrl (Sending) ' + this.name);

                    client.out.error(err);
                });

            const forumChannelGuilds = client.channels.cache.get(logs.guildsForumChannelId);

            if (!forumChannelGuilds) return client.out.alert('No forumChannelGuilds found', this.name);

            const webhooksGuildss = await forumChannelGuilds.fetchWebhooks();

            if (webhooksGuildss.find((x) => x.name == 'Command')) {
                webhookGuilds = new WebhookClient({ url: webhooksGuildss.find((x) => x.name == 'Command').url });
            } else {
                webhookGuilds = await forumChannelGuilds.createWebhook({ name: 'Command', avatar: avatar.command });
            }

            if (webhookGuilds) {
                webhookGuilds
                    .send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(color.command)
                                .setFooter({
                                    text: client.configs.footer.defaultText,
                                    iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : ''
                                })
                                .setDescription(
                                    `> __**Informations**__\n→ Guild: **${message.guild.name}** (||${message.guild.id}||) [${
                                        message.guild.memberCount
                                    } Members - <t:${parseInt(message.guild.createdTimestamp / 1000)}:R>]\n→ Language: **${
                                        dataGuildSettings.language
                                    }**\n→ Channel: **#${message.channel.name}** (||${message.channel.id}||) [<t:${parseInt(
                                        message.channel.createdTimestamp / 1000
                                    )}:R>]\n→ User: **${message.author.tag}** (||${message.author.id}||) [<t:${parseInt(
                                        message.author.createdTimestamp / 1000
                                    )}:R>]\n\n> __**Usage-data**__\n→ Command: **${commandName}** (||${commandName}||)\n→ Today [Guild / Global  / On this guild]: **${f} / ${e} (${parseInt(
                                        (f / e) * 100
                                    )}%)**\n→ All-Time [Guild / Global / On this guild]: **${b} / ${a} (${parseInt((b / a) * 100)}%)**`
                                )
                                .setTimestamp()
                        ],
                        threadId: dataGuildSettings.threadId
                    })
                    .catch((err) => {
                        client.out.warn('Error with LogWebhookUrlGuilds (Sending) ' + this.name);

                        client.out.error(err);
                    });
            } else client.out.alert('No webhookGuilds', this.name);
        } else {
            // This command's stats in this DM (total time)

            const dataDmCommandCount = await DmCommandStats.find({ dmChannelId: message.channel.id });

            let c = 0;

            dataDmCommandCount.forEach((x) => {
                if (x.commands.find((x) => x.id === commandName)) {
                    c += x.commands.find((x) => x.id === commandName).count;
                }
            });

            const dataDmCommandCountToday = await DmCommandStats.find({ dmChannelId: message.channel.id });

            let g = 0;

            dataDmCommandCountToday.forEach((x) => {
                if (x.commands.find((x) => x.id === commandName)) {
                    g += x.commands.find((x) => x.id === commandName).count;
                }
            });

            webhook
                .send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(color.command)
                            .setFooter({
                                text: client.configs.footer.defaultText,
                                iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : ''
                            })
                            .setDescription(
                                `> __**Informations**__\n→ Channel: **DM** (||${message.channel.id}||) [<t:${parseInt(
                                    message.channel.createdTimestamp / 1000
                                )}:R>]\n→ User: **${message.author.tag}** (||${message.author.id}||) [<t:${parseInt(
                                    message.author.createdTimestamp / 1000
                                )}:R>]\n\n> __**Usage-data**__\n→ Command: **${commandName}** (||${commandName}||)\n→ Today [This DM / Global  / On this DM]: **${g} / ${e} (${parseInt(
                                    (g / e) * 100
                                )}%)**\n→ All-Time [This DM / Global / On this DM]: **${c} / ${a} (${parseInt((c / a) * 100)}%)**`
                            )
                            .setTimestamp()
                    ],
                    threadId: client.configs.logs.commandThreadId
                })
                .catch((err) => {
                    client.out.warn('Error with LogWebhookUrl (Sending) ' + this.name);

                    client.out.error(err);
                });
        }
    }
};
