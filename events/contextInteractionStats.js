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

'use strict';
const { ChannelType, EmbedBuilder, WebhookClient } = require('discord.js');

// https://www.w3schools.com/js/js_strict.asp

/**********************************************************************/

/**
 * @author LuciferMorningstarDev
 * @since 1.0.0
 */

module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client) {
        // Checks if the interaction is a context interaction (to prevent weird bugs)

        if (!interaction.isContextMenuCommand()) return;

        /**********************************************************************/

        // Checks if the interaction target was a user

        if (interaction.isUserContextMenuCommand()) {
            const command = client.contextCommands.get('USER ' + interaction.commandName);

            // A try to execute the interaction.

            if (!command) return;

            const color = require('../configurations/colors');
            const logs = require('../configurations/logs');
            const avatar = require('../configurations/avatars');

            let d = new Date();
            d.setHours(0, 0, 0, 0);

            // A try to executes the interaction.

            const ChannelUserContextStats = require('../models/stats/ChannelUserContextStats');
            const DmUserContextStats = require('../models/stats/DmUserContextStats');
            const GlobalUserContextStats = require('../models/stats/GlobalUserContextStats');
            const GuildUserContextStats = require('../models/stats/GuildUserContextStats');
            const GroupDmUserContextStats = require('../models/stats/GroupDmUserContextStats');

            if (interaction?.channel?.type == ChannelType.DM) {
                const dataDmUserContextStats = await DmUserContextStats.findOne({
                    date: d,
                    userId: interaction.user.id,
                    dmChannelId: interaction.channel.id
                });

                if (dataDmUserContextStats) {
                    if (dataDmUserContextStats.usercontexts.find((x) => x.id == interaction.commandName)) {
                        dataDmUserContextStats.usercontexts.map((x) => {
                            if (x.id == interaction.commandName) x.count += 1;
                            return x;
                        });
                    } else {
                        dataDmUserContextStats.usercontexts.push({ id: interaction.commandName, count: 1 });
                    }

                    await dataDmUserContextStats.save();
                } else {
                    await DmUserContextStats.create({
                        usercontexts: [{ id: interaction.commandName, count: 1 }],
                        dmChannelId: interaction.channel.id,
                        userId: interaction.user.id,
                        date: d
                    });
                }
            }

            // GroupDmUserContextStats

            if (interaction?.channel?.type == ChannelType.GroupDM) {
                const dataGroupDmUserContextStats = await GroupDmUserContextStats.findOne({
                    date: d,
                    userId: interaction.user.id,
                    dmChannelId: interaction.channel.id
                });

                if (dataGroupDmUserContextStats) {
                    if (dataGroupDmUserContextStats.usercontexts.find((x) => x.id == interaction.commandName)) {
                        dataGroupDmUserContextStats.usercontexts.map((x) => {
                            if (x.id == interaction.commandName) x.count += 1;
                            return x;
                        });
                    } else {
                        dataGroupDmUserContextStats.usercontexts.push({ id: interaction.commandName, count: 1 });
                    }

                    await dataGroupDmUserContextStats.save();
                } else {
                    await GroupDmUserContextStats.create({
                        usercontexts: [{ id: interaction.commandName, count: 1 }],
                        dmChannelId: interaction.channel.id,
                        userId: interaction.user.id,
                        date: d
                    });
                }
            }

            // ChannelUserContextStats

            if (interaction?.channel?.type != ChannelType.DM && interaction?.channel?.type != ChannelType.GroupDM) {
                const dataChannelUserContextStats = await ChannelUserContextStats.findOne({
                    date: d,
                    userId: interaction.user.id,
                    channelId: interaction.channel.id,
                    guildId: interaction.guild.id
                });

                if (dataChannelUserContextStats) {
                    if (dataChannelUserContextStats.usercontexts.find((x) => x.id == interaction.commandName)) {
                        dataChannelUserContextStats.usercontexts.map((x) => {
                            if (x.id == interaction.commandName) x.count += 1;
                            return x;
                        });
                    } else {
                        dataChannelUserContextStats.usercontexts.push({ id: interaction.commandName, count: 1 });
                    }

                    await dataChannelUserContextStats.save();
                } else {
                    await ChannelUserContextStats.create({
                        usercontexts: [{ id: interaction.commandName, count: 1 }],
                        channelId: interaction.channel.id,
                        guildId: interaction.guild.id,
                        userId: interaction.user.id,
                        date: d
                    });
                }
            }

            // GuildUserContextStats

            if (interaction?.guild) {
                const dataGuildUserContextStats = await GuildUserContextStats.findOne({
                    date: d,
                    userId: interaction.user.id,
                    guildId: interaction.guild.id
                });

                if (dataGuildUserContextStats) {
                    if (dataGuildUserContextStats.usercontexts.find((x) => x.id == interaction.commandName)) {
                        dataGuildUserContextStats.usercontexts.map((x) => {
                            if (x.id == interaction.commandName) x.count += 1;
                            return x;
                        });
                    } else {
                        dataGuildUserContextStats.usercontexts.push({ id: interaction.commandName, count: 1 });
                    }

                    await dataGuildUserContextStats.save();
                } else {
                    await GuildUserContextStats.create({
                        usercontexts: [{ id: interaction.commandName, count: 1 }],
                        guildId: interaction.guild.id,
                        userId: interaction.user.id,
                        date: d
                    });
                }
            }

            // GlobalUserContextStats

            const dataGlobalUserContextStats = await GlobalUserContextStats.findOne({
                date: d,
                userId: interaction.user.id
            });

            if (dataGlobalUserContextStats) {
                if (dataGlobalUserContextStats.usercontexts.find((x) => x.id == interaction.commandName)) {
                    dataGlobalUserContextStats.usercontexts.map((x) => {
                        if (x.id == interaction.commandName) x.count += 1;
                        return x;
                    });
                } else {
                    dataGlobalUserContextStats.usercontexts.push({ id: interaction.commandName, count: 1 });
                }

                await dataGlobalUserContextStats.save();
            } else {
                await GlobalUserContextStats.create({
                    usercontexts: [{ id: interaction.commandName, count: 1 }],
                    userId: interaction.user.id,
                    date: d
                });
            }

            // Logs

            const forumChannel = client.channels.cache.get(logs.interactionsForumChannelId);

            if (!forumChannel) return client.out.alert('No forumChannel found', this.name);

            const webhooks = await forumChannel.fetchWebhooks();

            let webhook = null;

            if (webhooks.find((x) => x.name == 'UserContext')) {
                webhook = new WebhookClient({ url: webhooks.find((x) => x.name == 'UserContext').url });
            } else {
                webhook = await forumChannel.createWebhook({ name: 'UserContext', avatar: avatar.usercontext });
            }

            // This UserContext's stats in every guild (total time)

            const dataGlobalUserContextCount = await GlobalUserContextStats.find({});

            let a = 0;

            dataGlobalUserContextCount.forEach((x) => {
                if (x.usercontexts.find((x) => x.id === interaction.commandName)) {
                    a += x.usercontexts.find((x) => x.id === interaction.commandName).count;
                }
            });

            const dataGlobalUserContextCountToday = await GlobalUserContextStats.find({ date: d });

            let e = 0;

            dataGlobalUserContextCountToday.forEach((x) => {
                if (x.usercontexts.find((x) => x.id === interaction.commandName)) {
                    e += x.usercontexts.find((x) => x.id === interaction.commandName).count;
                }
            });

            let webhookGuilds = null;

            if (interaction.guild) {
                // This UserContext's stats in this guild (total time)

                const dataGuildUserContextCount = await GuildUserContextStats.find({ guildId: interaction.guild.id });

                let b = 0;

                dataGuildUserContextCount.forEach((x) => {
                    if (x.usercontexts.find((x) => x.id === interaction.commandName)) {
                        b += x.usercontexts.find((x) => x.id === interaction.commandName).count;
                    }
                });

                const dataGuildUserContextCountTodaay = await GuildUserContextStats.find({ guildId: interaction.guild.id, date: d });

                let f = 0;

                dataGuildUserContextCountTodaay.forEach((x) => {
                    if (x.usercontexts.find((x) => x.id === interaction.commandName)) {
                        f += x.usercontexts.find((x) => x.id === interaction.commandName).count;
                    }
                });

                // Fetching GuildSettings

                const GuildSettings = require('../models/guilds/GuildSettings');

                let dataGuildSettings = null;

                dataGuildSettings = await GuildSettings.findOne({ id: interaction.guild.id });

                if (!dataGuildSettings) {
                    client.out.alert('No dataGuildSettings', this.name);
                }

                // Sending Logs

                webhook
                    .send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(color.usercontext)
                                .setFooter({
                                    text: client.configs.footer.defaultText,
                                    iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : ''
                                })
                                .setDescription(
                                    `> __**Informations**__\n→ Guild: **${interaction.guild.name}** (||${interaction.guild.id}||) [${
                                        interaction.guild.memberCount
                                    } Members - <t:${parseInt(interaction.guild.createdTimestamp / 1000)}:R>]\n→ Language: **${
                                        dataGuildSettings.language
                                    }**\n→ Channel: **#${interaction.channel.name}** (||${interaction.channel.id}||) [<t:${parseInt(
                                        interaction.channel.createdTimestamp / 1000
                                    )}:R>]\n→ User: **${interaction.user.tag}** (||${interaction.user.id}||) [<t:${parseInt(
                                        interaction.user.createdTimestamp / 1000
                                    )}:R>]\n→ Target-User: **${client.users.cache.get(interaction.targetId).tag}** (||${
                                        interaction.targetId
                                    }||) [<t:${parseInt(
                                        client.users.cache.get(interaction.targetId).createdAt / 1000
                                    )}:R>]\n\n> __**Usage-data**__\n→ UserContext: **${interaction.commandName}** (||${
                                        interaction.commandName
                                    }||)\n→ Today [Guild / Global  / On this guild]: **${f} / ${e} (${parseInt(
                                        (f / e) * 100
                                    )}%)**\n→ All-Time [Guild / Global / On this guild]: **${b} / ${a} (${parseInt((b / a) * 100)}%)**`
                                )
                                .setTimestamp()
                        ],
                        threadId: client.configs.logs.usercontextThreadId
                    })
                    .catch((err) => {
                        client.out.warn('Error with LogWebhookUrl (Sending) ' + this.name);

                        client.out.error(err);
                    });

                const forumChannelGuilds = client.channels.cache.get(logs.guildsForumChannelId);

                if (!forumChannelGuilds) return client.out.alert('No forumChannelGuilds found', this.name);

                const webhooksGuildss = await forumChannelGuilds.fetchWebhooks();

                if (webhooksGuildss.find((x) => x.name == 'UserContext')) {
                    webhookGuilds = new WebhookClient({ url: webhooksGuildss.find((x) => x.name == 'UserContext').url });
                } else {
                    webhookGuilds = await forumChannelGuilds.createWebhook({ name: 'UserContext', avatar: avatar.usercontext });
                }

                if (webhookGuilds) {
                    webhookGuilds
                        .send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(color.usercontext)
                                    .setFooter({
                                        text: client.configs.footer.defaultText,
                                        iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : ''
                                    })
                                    .setDescription(
                                        `> __**Informations**__\n→ Guild: **${interaction.guild.name}** (||${interaction.guild.id}||) [${
                                            interaction.guild.memberCount
                                        } Members - <t:${parseInt(interaction.guild.createdTimestamp / 1000)}:R>]\n→ Language: **${
                                            dataGuildSettings.language
                                        }**\n→ Channel: **#${interaction.channel.name}** (||${interaction.channel.id}||) [<t:${parseInt(
                                            interaction.channel.createdTimestamp / 1000
                                        )}:R>]\n→ User: **${interaction.user.tag}** (||${interaction.user.id}||) [<t:${parseInt(
                                            interaction.user.createdTimestamp / 1000
                                        )}:R>]\n→ Target-User: **${client.users.cache.get(interaction.targetId).tag}** (||${
                                            interaction.targetId
                                        }||) [<t:${parseInt(
                                            client.users.cache.get(interaction.targetId).createdAt / 1000
                                        )}:R>]\n\n> __**Usage-data**__\n→ UserContext: **${interaction.commandName}** (||${
                                            interaction.commandName
                                        }||)\n→ Today [Guild / Global  / On this guild]: **${f} / ${e} (${parseInt(
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
                // This usercontext's stats in this DM (total time)

                const dataDmUserContextCount = await DmUserContextStats.find({ dmChannelId: interaction.channel.id });

                let c = 0;

                dataDmUserContextCount.forEach((x) => {
                    if (x.usercontexts.find((x) => x.id === interaction.commandName)) {
                        c += x.usercontexts.find((x) => x.id === interaction.commandName).count;
                    }
                });

                const dataDmUserContextCountToday = await DmUserContextStats.find({ dmChannelId: interaction.channel.id });

                let g = 0;

                dataDmUserContextCountToday.forEach((x) => {
                    if (x.usercontexts.find((x) => x.id === interaction.commandName)) {
                        g += x.usercontexts.find((x) => x.id === interaction.commandName).count;
                    }
                });

                webhook
                    .send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(color.usercontext)
                                .setFooter({
                                    text: client.configs.footer.defaultText,
                                    iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : ''
                                })
                                .setDescription(
                                    `> __**Informations**__\n→ Channel: **DM** (||${interaction.channel.id}||) [<t:${parseInt(
                                        interaction.channel.createdTimestamp / 1000
                                    )}:R>]\n→ User: **${interaction.user.tag}** (||${interaction.user.id}||) [<t:${parseInt(
                                        interaction.user.createdTimestamp / 1000
                                    )}:R>]\n→ Target-User: **${client.users.cache.get(interaction.targetId).tag}** (||${
                                        interaction.targetId
                                    }||) [<t:${parseInt(
                                        client.users.cache.get(interaction.targetId).createdAt / 1000
                                    )}:R>]\n\n> __**Usage-data**__\n→ UserContext: **${interaction.commandName}** (||${
                                        interaction.commandName
                                    }||)\n→ Today [This DM / Global  / On this DM]: **${g} / ${e} (${parseInt(
                                        (g / e) * 100
                                    )}%)**\n→ All-Time [This DM / Global / On this DM]: **${c} / ${a} (${parseInt((c / a) * 100)}%)**`
                                )
                                .setTimestamp()
                        ],
                        threadId: client.configs.logs.usercontextThreadId
                    })
                    .catch((err) => {
                        client.out.warn('Error with LogWebhookUrl (Sending) ' + this.name);

                        client.out.error(err);
                    });
            }
        }
        // Checks if the interaction target was a user
        else if (interaction.isMessageContextMenuCommand()) {
            const command = client.contextCommands.get('MESSAGE ' + interaction.commandName);

            // A try to execute the interaction.

            if (!command) return;

            const color = require('../configurations/colors');
            const logs = require('../configurations/logs');
            const avatar = require('../configurations/avatars');

            let d = new Date();
            d.setHours(0, 0, 0, 0);

            // A try to executes the interaction.

            const ChannelMessageContextStats = require('../models/stats/ChannelMessageContextStats');
            const DmMessageContextStats = require('../models/stats/DmMessageContextStats');
            const GlobalMessageContextStats = require('../models/stats/GlobalMessageContextStats');
            const GuildMessageContextStats = require('../models/stats/GuildMessageContextStats');
            const GroupDmMessageContextStats = require('../models/stats/GroupDmMessageContextStats');

            if (interaction?.channel?.type == ChannelType.DM) {
                const dataDmMessageContextStats = await DmMessageContextStats.findOne({
                    date: d,
                    userId: interaction.user.id,
                    dmChannelId: interaction.channel.id
                });

                if (dataDmMessageContextStats) {
                    if (dataDmMessageContextStats.messagecontexts.find((x) => x.id == interaction.commandName)) {
                        dataDmMessageContextStats.messagecontexts.map((x) => {
                            if (x.id == interaction.commandName) x.count += 1;
                            return x;
                        });
                    } else {
                        dataDmMessageContextStats.messagecontexts.push({ id: interaction.commandName, count: 1 });
                    }

                    await dataDmMessageContextStats.save();
                } else {
                    await DmMessageContextStats.create({
                        messagecontexts: [{ id: interaction.commandName, count: 1 }],
                        dmChannelId: interaction.channel.id,
                        userId: interaction.user.id,
                        date: d
                    });
                }
            }

            // GroupDmMessageContextStats

            if (interaction?.channel?.type == ChannelType.GroupDM) {
                const dataGroupDmMessageContextStats = await GroupDmMessageContextStats.findOne({
                    date: d,
                    userId: interaction.user.id,
                    dmChannelId: interaction.channel.id
                });

                if (dataGroupDmMessageContextStats) {
                    if (dataGroupDmMessageContextStats.messagecontexts.find((x) => x.id == interaction.commandName)) {
                        dataGroupDmMessageContextStats.messagecontexts.map((x) => {
                            if (x.id == interaction.commandName) x.count += 1;
                            return x;
                        });
                    } else {
                        dataGroupDmMessageContextStats.messagecontexts.push({ id: interaction.commandName, count: 1 });
                    }

                    await dataGroupDmMessageContextStats.save();
                } else {
                    await GroupDmMessageContextStats.create({
                        messagecontexts: [{ id: interaction.commandName, count: 1 }],
                        dmChannelId: interaction.channel.id,
                        userId: interaction.user.id,
                        date: d
                    });
                }
            }

            // ChannelMessageContextStats

            if (interaction?.channel?.type != ChannelType.DM && interaction?.channel?.type != ChannelType.GroupDM) {
                const dataChannelMessageContextStats = await ChannelMessageContextStats.findOne({
                    date: d,
                    userId: interaction.user.id,
                    channelId: interaction.channel.id,
                    guildId: interaction.guild.id
                });

                if (dataChannelMessageContextStats) {
                    if (dataChannelMessageContextStats.messagecontexts.find((x) => x.id == interaction.commandName)) {
                        dataChannelMessageContextStats.messagecontexts.map((x) => {
                            if (x.id == interaction.commandName) x.count += 1;
                            return x;
                        });
                    } else {
                        dataChannelMessageContextStats.messagecontexts.push({ id: interaction.commandName, count: 1 });
                    }

                    await dataChannelMessageContextStats.save();
                } else {
                    await ChannelMessageContextStats.create({
                        messagecontexts: [{ id: interaction.commandName, count: 1 }],
                        channelId: interaction.channel.id,
                        guildId: interaction.guild.id,
                        userId: interaction.user.id,
                        date: d
                    });
                }
            }

            // GuildMessageContextStats

            if (interaction?.guild) {
                const dataGuildMessageContextStats = await GuildMessageContextStats.findOne({
                    date: d,
                    userId: interaction.user.id,
                    guildId: interaction.guild.id
                });

                if (dataGuildMessageContextStats) {
                    if (dataGuildMessageContextStats.messagecontexts.find((x) => x.id == interaction.commandName)) {
                        dataGuildMessageContextStats.messagecontexts.map((x) => {
                            if (x.id == interaction.commandName) x.count += 1;
                            return x;
                        });
                    } else {
                        dataGuildMessageContextStats.messagecontexts.push({ id: interaction.commandName, count: 1 });
                    }

                    await dataGuildMessageContextStats.save();
                } else {
                    await GuildMessageContextStats.create({
                        messagecontexts: [{ id: interaction.commandName, count: 1 }],
                        guildId: interaction.guild.id,
                        userId: interaction.user.id,
                        date: d
                    });
                }
            }

            // GlobalMessageContextStats

            const dataGlobalMessageContextStats = await GlobalMessageContextStats.findOne({
                date: d,
                userId: interaction.user.id
            });

            if (dataGlobalMessageContextStats) {
                if (dataGlobalMessageContextStats.messagecontexts.find((x) => x.id == interaction.commandName)) {
                    dataGlobalMessageContextStats.messagecontexts.map((x) => {
                        if (x.id == interaction.commandName) x.count += 1;
                        return x;
                    });
                } else {
                    dataGlobalMessageContextStats.messagecontexts.push({ id: interaction.commandName, count: 1 });
                }

                await dataGlobalMessageContextStats.save();
            } else {
                await GlobalMessageContextStats.create({
                    messagecontexts: [{ id: interaction.commandName, count: 1 }],
                    userId: interaction.user.id,
                    date: d
                });
            }

            // Logs

            const forumChannel = client.channels.cache.get(logs.interactionsForumChannelId);

            if (!forumChannel) return client.out.alert('No forumChannel found', this.name);

            const webhooks = await forumChannel.fetchWebhooks();

            let webhook = null;

            if (webhooks.find((x) => x.name == 'MessageContext')) {
                webhook = new WebhookClient({ url: webhooks.find((x) => x.name == 'MessageContext').url });
            } else {
                webhook = await forumChannel.createWebhook({ name: 'MessageContext', avatar: avatar.messagecontext });
            }

            // This MessageContext's stats in every guild (total time)

            const dataGlobalMessageContextCount = await GlobalMessageContextStats.find({});

            let a = 0;

            dataGlobalMessageContextCount.forEach((x) => {
                if (x.messagecontexts.find((x) => x.id === interaction.commandName)) {
                    a += x.messagecontexts.find((x) => x.id === interaction.commandName).count;
                }
            });

            const dataGlobalMessageContextCountToday = await GlobalMessageContextStats.find({ date: d });

            let e = 0;

            dataGlobalMessageContextCountToday.forEach((x) => {
                if (x.messagecontexts.find((x) => x.id === interaction.commandName)) {
                    e += x.messagecontexts.find((x) => x.id === interaction.commandName).count;
                }
            });

            let webhookGuilds = null;

            if (interaction.guild) {
                // This MessageContext's stats in this guild (total time)

                const dataGuildMessageContextCount = await GuildMessageContextStats.find({ guildId: interaction.guild.id });

                let b = 0;

                dataGuildMessageContextCount.forEach((x) => {
                    if (x.messagecontexts.find((x) => x.id === interaction.commandName)) {
                        b += x.messagecontexts.find((x) => x.id === interaction.commandName).count;
                    }
                });

                const dataGuildMessageContextCountTodaay = await GuildMessageContextStats.find({
                    guildId: interaction.guild.id,
                    date: d
                });

                let f = 0;

                dataGuildMessageContextCountTodaay.forEach((x) => {
                    if (x.messagecontexts.find((x) => x.id === interaction.commandName)) {
                        f += x.messagecontexts.find((x) => x.id === interaction.commandName).count;
                    }
                });

                // Fetching GuildSettings

                const GuildSettings = require('../models/guilds/GuildSettings');

                let dataGuildSettings = null;

                dataGuildSettings = await GuildSettings.findOne({ id: interaction.guild.id });

                if (!dataGuildSettings) {
                    client.out.alert('No dataGuildSettings', this.name);
                }

                // Sending Logs

                webhook
                    .send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(color.messagecontext)
                                .setFooter({
                                    text: client.configs.footer.defaultText,
                                    iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : ''
                                })
                                .setDescription(
                                    `> __**Informations**__\n→ Guild: **${interaction.guild.name}** (||${interaction.guild.id}||) [${
                                        interaction.guild.memberCount
                                    } Members - <t:${parseInt(interaction.guild.createdTimestamp / 1000)}:R>]\n→ Language: **${
                                        dataGuildSettings.language
                                    }**\n→ Channel: **#${interaction.channel.name}** (||${interaction.channel.id}||) [<t:${parseInt(
                                        interaction.channel.createdTimestamp / 1000
                                    )}:R>]\n→ User: **${interaction.user.tag}** (||${interaction.user.id}||) [<t:${parseInt(
                                        interaction.user.createdTimestamp / 1000
                                    )}:R>]\n→ MessageId: **${interaction.targetId}**\n\n> __**Usage-data**__\n→ MessageContext: **${
                                        interaction.commandName
                                    }** (||${
                                        interaction.commandName
                                    }||)\n→ Today [Guild / Global  / On this guild]: **${f} / ${e} (${parseInt(
                                        (f / e) * 100
                                    )}%)**\n→ All-Time [Guild / Global / On this guild]: **${b} / ${a} (${parseInt((b / a) * 100)}%)**`
                                )
                                .setTimestamp()
                        ],
                        threadId: client.configs.logs.messagecontextThreadId
                    })
                    .catch((err) => {
                        client.out.warn('Error with LogWebhookUrl (Sending) ' + this.name);

                        client.out.error(err);
                    });

                const forumChannelGuilds = client.channels.cache.get(logs.guildsForumChannelId);

                if (!forumChannelGuilds) return client.out.alert('No forumChannelGuilds found', this.name);

                const webhooksGuildss = await forumChannelGuilds.fetchWebhooks();

                if (webhooksGuildss.find((x) => x.name == 'MessageContext')) {
                    webhookGuilds = new WebhookClient({ url: webhooksGuildss.find((x) => x.name == 'MessageContext').url });
                } else {
                    webhookGuilds = await forumChannelGuilds.createWebhook({
                        name: 'MessageContext',
                        avatar: avatar.messagecontext
                    });
                }

                if (webhookGuilds) {
                    webhookGuilds
                        .send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(color.messagecontext)
                                    .setFooter({
                                        text: client.configs.footer.defaultText,
                                        iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : ''
                                    })
                                    .setDescription(
                                        `> __**Informations**__\n→ Guild: **${interaction.guild.name}** (||${interaction.guild.id}||) [${
                                            interaction.guild.memberCount
                                        } Members - <t:${parseInt(interaction.guild.createdTimestamp / 1000)}:R>]\n→ Language: **${
                                            dataGuildSettings.language
                                        }**\n→ Channel: **#${interaction.channel.name}** (||${interaction.channel.id}||) [<t:${parseInt(
                                            interaction.channel.createdTimestamp / 1000
                                        )}:R>]\n→ User: **${interaction.user.tag}** (||${interaction.user.id}||) [<t:${parseInt(
                                            interaction.user.createdTimestamp / 1000
                                        )}:R>]\n→ MessageId: **${interaction.targetId}**\n\n> __**Usage-data**__\n→ MessageContext: **${
                                            interaction.commandName
                                        }** (||${
                                            interaction.commandName
                                        }||)\n→ Today [Guild / Global  / On this guild]: **${f} / ${e} (${parseInt(
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
                // This messagecontext's stats in this DM (total time)

                const dataDmMessageContextCount = await DmMessageContextStats.find({ dmChannelId: interaction.channel.id });

                let c = 0;

                dataDmMessageContextCount.forEach((x) => {
                    if (x.messagecontexts.find((x) => x.id === interaction.commandName)) {
                        c += x.messagecontexts.find((x) => x.id === interaction.commandName).count;
                    }
                });

                const dataDmMessageContextCountToday = await DmMessageContextStats.find({ dmChannelId: interaction.channel.id });

                let g = 0;

                dataDmMessageContextCountToday.forEach((x) => {
                    if (x.messagecontexts.find((x) => x.id === interaction.commandName)) {
                        g += x.messagecontexts.find((x) => x.id === interaction.commandName).count;
                    }
                });

                webhook
                    .send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(color.messagecontext)
                                .setFooter({
                                    text: client.configs.footer.defaultText,
                                    iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : ''
                                })
                                .setDescription(
                                    `> __**Informations**__\n→ Channel: **DM** (||${interaction.channel.id}||) [<t:${parseInt(
                                        interaction.channel.createdTimestamp / 1000
                                    )}:R>]\n→ User: **${interaction.user.tag}** (||${interaction.user.id}||) [<t:${parseInt(
                                        interaction.user.createdTimestamp / 1000
                                    )}:R>]\n→ MessageId: **${interaction.targetId}**\n\n> __**Usage-data**__\n→ MessageContext: **${
                                        interaction.commandName
                                    }** (||${
                                        interaction.commandName
                                    }||)\n→ Today [This DM / Global  / On this DM]: **${g} / ${e} (${parseInt(
                                        (g / e) * 100
                                    )}%)**\n→ All-Time [This DM / Global / On this DM]: **${c} / ${a} (${parseInt((c / a) * 100)}%)**`
                                )
                                .setTimestamp()
                        ],
                        threadId: client.configs.logs.messagecontextThreadId
                    })
                    .catch((err) => {
                        client.out.warn('Error with LogWebhookUrl (Sending) ' + this.name);

                        client.out.error(err);
                    });
            }
        }

        // Practically not possible, but we are still caching the bug.
        // Possible Fix is a restart!
        else {
            return client.out.log('Something weird happening in context menu. Received a context menu of unknown type.');
        }
    }
};
