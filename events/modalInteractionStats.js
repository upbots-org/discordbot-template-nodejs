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
const { ModalSubmitInteraction, Client, ChannelType, WebhookClient, EmbedBuilder } = require('discord.js');

// https://www.w3schools.com/js/js_strict.asp

/**********************************************************************/

/**
 * @author LuciferMorningstarDev
 * @since 1.0.0
 */

module.exports = {
    name: 'interactionCreate',
    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {Client} client
     * @returns
     */
    async execute(interaction, client) {
        if (!interaction.isModalSubmit()) return;

        const command = client.modalCommands.get(interaction.customId);

        // If the interaction is not a command in cache, return error message.
        // You can modify the error message at ./messages/defaultModalError.js file!

        if (!command) return;
        // If the interaction is not a command in cache.

        const color = require('../configurations/colors');
        const logs = require('../configurations/logs');
        const avatar = require('../configurations/avatars');

        let d = new Date();
        d.setHours(0, 0, 0, 0);

        // A try to executes the interaction.

        const ChannelModalStats = require('../models/stats/ChannelModalStats');
        const DmModalStats = require('../models/stats/DmModalStats');
        const GlobalModalStats = require('../models/stats/GlobalModalStats');
        const GuildModalStats = require('../models/stats/GuildModalStats');
        const GroupDmModalStats = require('../models/stats/GroupDmModalStats');

        if (interaction?.channel?.type == ChannelType.DM) {
            const dataDmModalStats = await DmModalStats.findOne({
                date: d,
                userId: interaction.user.id,
                dmChannelId: interaction.channel.id
            });

            if (dataDmModalStats) {
                if (dataDmModalStats.modals.find((x) => x.id == interaction.customId)) {
                    dataDmModalStats.modals.map((x) => {
                        if (x.id == interaction.customId) x.count += 1;
                        return x;
                    });
                } else {
                    dataDmModalStats.modals.push({ id: interaction.customId, count: 1 });
                }

                await dataDmModalStats.save();
            } else {
                await DmModalStats.create({
                    modals: [{ id: interaction.customId, count: 1 }],
                    dmChannelId: interaction.channel.id,
                    userId: interaction.user.id,
                    date: d
                });
            }
        }

        // GroupDmModalStats

        if (interaction?.channel?.type == ChannelType.GroupDM) {
            const dataGroupDmModalStats = await GroupDmModalStats.findOne({
                date: d,
                userId: interaction.user.id,
                dmChannelId: interaction.channel.id
            });

            if (dataGroupDmModalStats) {
                if (dataGroupDmModalStats.modals.find((x) => x.id == interaction.customId)) {
                    dataGroupDmModalStats.modals.map((x) => {
                        if (x.id == interaction.customId) x.count += 1;
                        return x;
                    });
                } else {
                    dataGroupDmModalStats.modals.push({ id: interaction.customId, count: 1 });
                }

                await dataGroupDmModalStats.save();
            } else {
                await GroupDmModalStats.create({
                    modals: [{ id: interaction.customId, count: 1 }],
                    dmChannelId: interaction.channel.id,
                    userId: interaction.user.id,
                    date: d
                });
            }
        }

        // ChannelModalStats

        if (interaction?.channel?.type != ChannelType.DM && interaction?.channel?.type != ChannelType.GroupDM) {
            const dataChannelModalStats = await ChannelModalStats.findOne({
                date: d,
                userId: interaction.user.id,
                channelId: interaction.channel.id,
                guildId: interaction.guild.id
            });

            if (dataChannelModalStats) {
                if (dataChannelModalStats.modals.find((x) => x.id == interaction.customId)) {
                    dataChannelModalStats.modals.map((x) => {
                        if (x.id == interaction.customId) x.count += 1;
                        return x;
                    });
                } else {
                    dataChannelModalStats.modals.push({ id: interaction.customId, count: 1 });
                }

                await dataChannelModalStats.save();
            } else {
                await ChannelModalStats.create({
                    modals: [{ id: interaction.customId, count: 1 }],
                    channelId: interaction.channel.id,
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                    date: d
                });
            }
        }

        // GuildModalStats

        if (interaction?.guild) {
            const dataGuildModalStats = await GuildModalStats.findOne({
                date: d,
                userId: interaction.user.id,
                guildId: interaction.guild.id
            });

            if (dataGuildModalStats) {
                if (dataGuildModalStats.modals.find((x) => x.id == interaction.customId)) {
                    dataGuildModalStats.modals.map((x) => {
                        if (x.id == interaction.customId) x.count += 1;
                        return x;
                    });
                } else {
                    dataGuildModalStats.modals.push({ id: interaction.customId, count: 1 });
                }

                await dataGuildModalStats.save();
            } else {
                await GuildModalStats.create({
                    modals: [{ id: interaction.customId, count: 1 }],
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                    date: d
                });
            }
        }

        // GlobalModalStats

        const dataGlobalModalStats = await GlobalModalStats.findOne({
            date: d,
            userId: interaction.user.id
        });

        if (dataGlobalModalStats) {
            if (dataGlobalModalStats.modals.find((x) => x.id == interaction.customId)) {
                dataGlobalModalStats.modals.map((x) => {
                    if (x.id == interaction.customId) x.count += 1;
                    return x;
                });
            } else {
                dataGlobalModalStats.modals.push({ id: interaction.customId, count: 1 });
            }

            await dataGlobalModalStats.save();
        } else {
            await GlobalModalStats.create({
                modals: [{ id: interaction.customId, count: 1 }],
                userId: interaction.user.id,
                date: d
            });
        }

        // Logs

        const forumChannel = client.channels.cache.get(logs.interactionsForumChannelId);

        if (!forumChannel) return client.out.alert('No forumChannel found', this.name);

        const webhooks = await forumChannel.fetchWebhooks();

        let webhook = null;

        if (webhooks.find((x) => x.name == 'Modal')) {
            webhook = new WebhookClient({ url: webhooks.find((x) => x.name == 'Modal').url });
        } else {
            webhook = await forumChannel.createWebhook({ name: 'Modal', avatar: avatar.modal });
        }

        // This Modal's stats in every guild (total time)

        const dataGlobalModalCount = await GlobalModalStats.find({});

        let a = 0;

        dataGlobalModalCount.forEach((x) => {
            if (x.modals.find((x) => x.id === interaction.customId)) {
                a += x.modals.find((x) => x.id === interaction.customId).count;
            }
        });

        const dataGlobalModalCountToday = await GlobalModalStats.find({ date: d });

        let e = 0;

        dataGlobalModalCountToday.forEach((x) => {
            if (x.modals.find((x) => x.id === interaction.customId)) {
                e += x.modals.find((x) => x.id === interaction.customId).count;
            }
        });

        let webhookGuilds = null;

        if (interaction.guild) {
            // This Modal's stats in this guild (total time)

            const dataGuildModalCount = await GuildModalStats.find({ guildId: interaction.guild.id });

            let b = 0;

            dataGuildModalCount.forEach((x) => {
                if (x.modals.find((x) => x.id === interaction.customId)) {
                    b += x.modals.find((x) => x.id === interaction.customId).count;
                }
            });

            const dataGuildModalCountTodaay = await GuildModalStats.find({ guildId: interaction.guild.id, date: d });

            let f = 0;

            dataGuildModalCountTodaay.forEach((x) => {
                if (x.modals.find((x) => x.id === interaction.customId)) {
                    f += x.modals.find((x) => x.id === interaction.customId).count;
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
                            .setColor(color.modal)
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
                                )}:R>]\n\n> __**Usage-data**__\n→ Modal: **${interaction.customId}** (||${
                                    interaction.customId
                                }||)\n→ Today [Guild / Global  / On this guild]: **${f} / ${e} (${parseInt(
                                    (f / e) * 100
                                )}%)**\n→ All-Time [Guild / Global / On this guild]: **${b} / ${a} (${parseInt((b / a) * 100)}%)**`
                            )
                            .setTimestamp()
                    ],
                    threadId: client.configs.logs.modalThreadId
                })
                .catch((err) => {
                    client.out.warn('Error with LogWebhookUrl (Sending) ' + this.name);

                    client.out.error(err);
                });

            const forumChannelGuilds = client.channels.cache.get(logs.guildsForumChannelId);

            if (!forumChannelGuilds) return client.out.alert('No forumChannelGuilds found', this.name);

            const webhooksGuildss = await forumChannelGuilds.fetchWebhooks();

            if (webhooksGuildss.find((x) => x.name == 'Modal')) {
                webhookGuilds = new WebhookClient({ url: webhooksGuildss.find((x) => x.name == 'Modal').url });
            } else {
                webhookGuilds = await forumChannelGuilds.createWebhook({ name: 'Modal', avatar: avatar.modal });
            }

            if (webhookGuilds) {
                webhookGuilds
                    .send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(color.modal)
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
                                    )}:R>]\n\n> __**Usage-data**__\n→ Modal: **${interaction.customId}** (||${
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
            // This modal's stats in this DM (total time)

            const dataDmModalCount = await DmModalStats.find({ dmChannelId: interaction.channel.id });

            let c = 0;

            dataDmModalCount.forEach((x) => {
                if (x.modals.find((x) => x.id === interaction.customId)) {
                    c += x.modals.find((x) => x.id === interaction.customId).count;
                }
            });

            const dataDmModalCountToday = await DmModalStats.find({ dmChannelId: interaction.channel.id });

            let g = 0;

            dataDmModalCountToday.forEach((x) => {
                if (x.modals.find((x) => x.id === interaction.customId)) {
                    g += x.modals.find((x) => x.id === interaction.customId).count;
                }
            });

            webhook
                .send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(color.modal)
                            .setFooter({
                                text: client.configs.footer.defaultText,
                                iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : ''
                            })
                            .setDescription(
                                `> __**Informations**__\n→ Channel: **DM** (||${interaction.channel.id}||) [<t:${parseInt(
                                    interaction.channel.createdTimestamp / 1000
                                )}:R>]\n→ User: **${interaction.user.tag}** (||${interaction.user.id}||) [<t:${parseInt(
                                    interaction.user.createdTimestamp / 1000
                                )}:R>]\n\n> __**Usage-data**__\n→ Modal: **${interaction.customId}** (||${
                                    interaction.customId
                                }||)\n→ Today [This DM / Global  / On this DM]: **${g} / ${e} (${parseInt(
                                    (g / e) * 100
                                )}%)**\n→ All-Time [This DM / Global / On this DM]: **${c} / ${a} (${parseInt((c / a) * 100)}%)**`
                            )
                            .setTimestamp()
                    ],
                    threadId: client.configs.logs.modalThreadId
                })
                .catch((err) => {
                    client.out.warn('Error with LogWebhookUrl (Sending) ' + this.name);

                    client.out.error(err);
                });
        }
    }
};
