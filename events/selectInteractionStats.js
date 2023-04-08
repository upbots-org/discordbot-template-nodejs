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
const { Client, ChannelType, WebhookClient, EmbedBuilder } = require('discord.js');

// https://www.w3schools.com/js/js_strict.asp

/**********************************************************************/

/**
 * @author LuciferMorningstarDev
 * @since 1.0.0
 */

module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client) {
        if (!interaction.isAnySelectMenu()) return;

        const command = client.selectCommands.get(interaction.customId);

        // If the interaction is not a command in cache, return error message.
        // You can modify the error message at ./messages/defaultSelectError.js file!

        if (!command) return;
        // If the interaction is not a command in cache.

        const color = require('../configurations/colors');
        const logs = require('../configurations/logs');
        const avatar = require('../configurations/avatars');

        let d = new Date();
        d.setHours(0, 0, 0, 0);

        // A try to executes the interaction.

        const ChannelSelectStats = require('../models/stats/ChannelSelectStats');
        const DmSelectStats = require('../models/stats/DmSelectStats');
        const GlobalSelectStats = require('../models/stats/GlobalSelectStats');
        const GuildSelectStats = require('../models/stats/GuildSelectStats');
        const GroupDmSelectStats = require('../models/stats/GroupDmSelectStats');

        if (interaction?.channel?.type == ChannelType.DM) {
            const dataDmSelectStats = await DmSelectStats.findOne({
                date: d,
                userId: interaction.user.id,
                dmChannelId: interaction.channel.id
            });

            if (dataDmSelectStats) {
                if (dataDmSelectStats.selects.find((x) => x.id == interaction.customId)) {
                    dataDmSelectStats.selects.map((x) => {
                        if (x.id == interaction.customId) x.count += 1;
                        return x;
                    });
                } else {
                    dataDmSelectStats.selects.push({ id: interaction.customId, count: 1 });
                }

                await dataDmSelectStats.save();
            } else {
                await DmSelectStats.create({
                    selects: [{ id: interaction.customId, count: 1 }],
                    dmChannelId: interaction.channel.id,
                    userId: interaction.user.id,
                    date: d
                });
            }
        }

        // GroupDmSelectStats

        if (interaction?.channel?.type == ChannelType.GroupDM) {
            const dataGroupDmSelectStats = await GroupDmSelectStats.findOne({
                date: d,
                userId: interaction.user.id,
                dmChannelId: interaction.channel.id
            });

            if (dataGroupDmSelectStats) {
                if (dataGroupDmSelectStats.selects.find((x) => x.id == interaction.customId)) {
                    dataGroupDmSelectStats.selects.map((x) => {
                        if (x.id == interaction.customId) x.count += 1;
                        return x;
                    });
                } else {
                    dataGroupDmSelectStats.selects.push({ id: interaction.customId, count: 1 });
                }

                await dataGroupDmSelectStats.save();
            } else {
                await GroupDmSelectStats.create({
                    selects: [{ id: interaction.customId, count: 1 }],
                    dmChannelId: interaction.channel.id,
                    userId: interaction.user.id,
                    date: d
                });
            }
        }

        // ChannelSelectStats

        if (interaction?.channel?.type != ChannelType.DM && interaction?.channel?.type != ChannelType.GroupDM) {
            const dataChannelSelectStats = await ChannelSelectStats.findOne({
                date: d,
                userId: interaction.user.id,
                channelId: interaction.channel.id,
                guildId: interaction.guild.id
            });

            if (dataChannelSelectStats) {
                if (dataChannelSelectStats.selects.find((x) => x.id == interaction.customId)) {
                    dataChannelSelectStats.selects.map((x) => {
                        if (x.id == interaction.customId) x.count += 1;
                        return x;
                    });
                } else {
                    dataChannelSelectStats.selects.push({ id: interaction.customId, count: 1 });
                }

                await dataChannelSelectStats.save();
            } else {
                await ChannelSelectStats.create({
                    selects: [{ id: interaction.customId, count: 1 }],
                    channelId: interaction.channel.id,
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                    date: d
                });
            }
        }

        // GuildSelectStats

        if (interaction?.guild) {
            const dataGuildSelectStats = await GuildSelectStats.findOne({
                date: d,
                userId: interaction.user.id,
                guildId: interaction.guild.id
            });

            if (dataGuildSelectStats) {
                if (dataGuildSelectStats.selects.find((x) => x.id == interaction.customId)) {
                    dataGuildSelectStats.selects.map((x) => {
                        if (x.id == interaction.customId) x.count += 1;
                        return x;
                    });
                } else {
                    dataGuildSelectStats.selects.push({ id: interaction.customId, count: 1 });
                }

                await dataGuildSelectStats.save();
            } else {
                await GuildSelectStats.create({
                    selects: [{ id: interaction.customId, count: 1 }],
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                    date: d
                });
            }
        }

        // GlobalSelectStats

        const dataGlobalSelectStats = await GlobalSelectStats.findOne({
            date: d,
            userId: interaction.user.id
        });

        if (dataGlobalSelectStats) {
            if (dataGlobalSelectStats.selects.find((x) => x.id == interaction.customId)) {
                dataGlobalSelectStats.selects.map((x) => {
                    if (x.id == interaction.customId) x.count += 1;
                    return x;
                });
            } else {
                dataGlobalSelectStats.selects.push({ id: interaction.customId, count: 1 });
            }

            await dataGlobalSelectStats.save();
        } else {
            await GlobalSelectStats.create({
                selects: [{ id: interaction.customId, count: 1 }],
                userId: interaction.user.id,
                date: d
            });
        }

        // Logs

        const forumChannel = client.channels.cache.get(logs.interactionsForumChannelId);

        if (!forumChannel) return client.out.alert('No forumChannel found', this.name);

        const webhooks = await forumChannel.fetchWebhooks();

        let webhook = null;

        if (webhooks.find((x) => x.name == 'Select')) {
            webhook = new WebhookClient({ url: webhooks.find((x) => x.name == 'Select').url });
        } else {
            webhook = await forumChannel.createWebhook({ name: 'Select', avatar: avatar.select });
        }

        // This Select's stats in every guild (total time)

        const dataGlobalSelectCount = await GlobalSelectStats.find({});

        let a = 0;

        dataGlobalSelectCount.forEach((x) => {
            if (x.selects.find((x) => x.id === interaction.customId)) {
                a += x.selects.find((x) => x.id === interaction.customId).count;
            }
        });

        const dataGlobalSelectCountToday = await GlobalSelectStats.find({ date: d });

        let e = 0;

        dataGlobalSelectCountToday.forEach((x) => {
            if (x.selects.find((x) => x.id === interaction.customId)) {
                e += x.selects.find((x) => x.id === interaction.customId).count;
            }
        });

        let webhookGuilds = null;

        if (interaction.guild) {
            // This Select's stats in this guild (total time)

            const dataGuildSelectCount = await GuildSelectStats.find({ guildId: interaction.guild.id });

            let b = 0;

            dataGuildSelectCount.forEach((x) => {
                if (x.selects.find((x) => x.id === interaction.customId)) {
                    b += x.selects.find((x) => x.id === interaction.customId).count;
                }
            });

            const dataGuildSelectCountTodaay = await GuildSelectStats.find({ guildId: interaction.guild.id, date: d });

            let f = 0;

            dataGuildSelectCountTodaay.forEach((x) => {
                if (x.selects.find((x) => x.id === interaction.customId)) {
                    f += x.selects.find((x) => x.id === interaction.customId).count;
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
                            .setColor(color.select)
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
                                )}:R>]\n\n> __**Usage-data**__\n→ Select: **${interaction.customId}** (||${
                                    interaction.customId
                                }||)\n→ Today [Guild / Global  / On this guild]: **${f} / ${e} (${parseInt(
                                    (f / e) * 100
                                )}%)**\n→ All-Time [Guild / Global / On this guild]: **${b} / ${a} (${parseInt((b / a) * 100)}%)**`
                            )
                            .setTimestamp()
                    ],
                    threadId: client.configs.logs.selectThreadId
                })
                .catch((err) => {
                    client.out.warn('Error with LogWebhookUrl (Sending) ' + this.name);

                    client.out.error(err);
                });

            const forumChannelGuilds = client.channels.cache.get(logs.guildsForumChannelId);

            if (!forumChannelGuilds) return client.out.alert('No forumChannelGuilds found', this.name);

            const webhooksGuildss = await forumChannelGuilds.fetchWebhooks();

            if (webhooksGuildss.find((x) => x.name == 'Select')) {
                webhookGuilds = new WebhookClient({ url: webhooksGuildss.find((x) => x.name == 'Select').url });
            } else {
                webhookGuilds = await forumChannelGuilds.createWebhook({ name: 'Select', avatar: avatar.select });
            }

            if (webhookGuilds) {
                webhookGuilds
                    .send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(color.select)
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
                                    )}:R>]\n\n> __**Usage-data**__\n→ Select: **${interaction.customId}** (||${
                                        interaction.customId
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
            // This select's stats in this DM (total time)

            const dataDmSelectCount = await DmSelectStats.find({ dmChannelId: interaction.channel.id });

            let c = 0;

            dataDmSelectCount.forEach((x) => {
                if (x.selects.find((x) => x.id === interaction.customId)) {
                    c += x.selects.find((x) => x.id === interaction.customId).count;
                }
            });

            const dataDmSelectCountToday = await DmSelectStats.find({ dmChannelId: interaction.channel.id });

            let g = 0;

            dataDmSelectCountToday.forEach((x) => {
                if (x.selects.find((x) => x.id === interaction.customId)) {
                    g += x.selects.find((x) => x.id === interaction.customId).count;
                }
            });

            webhook
                .send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(color.select)
                            .setFooter({
                                text: client.configs.footer.defaultText,
                                iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : ''
                            })
                            .setDescription(
                                `> __**Informations**__\n→ Channel: **DM** (||${interaction.channel.id}||) [<t:${parseInt(
                                    interaction.channel.createdTimestamp / 1000
                                )}:R>]\n→ User: **${interaction.user.tag}** (||${interaction.user.id}||) [<t:${parseInt(
                                    interaction.user.createdTimestamp / 1000
                                )}:R>]\n\n> __**Usage-data**__\n→ Select: **${interaction.customId}** (||${
                                    interaction.customId
                                }||)\n→ Today [This DM / Global  / On this DM]: **${g} / ${e} (${parseInt(
                                    (g / e) * 100
                                )}%)**\n→ All-Time [This DM / Global / On this DM]: **${c} / ${a} (${parseInt((c / a) * 100)}%)**`
                            )
                            .setTimestamp()
                    ],
                    threadId: client.configs.logs.selectThreadId
                })
                .catch((err) => {
                    client.out.warn('Error with LogWebhookUrl (Sending) ' + this.name);

                    client.out.error(err);
                });
        }
    }
};
