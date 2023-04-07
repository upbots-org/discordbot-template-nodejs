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
const { ButtonInteraction, Client, ChannelType, WebhookClient, EmbedBuilder } = require('discord.js');

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
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     * @returns
     */
    async execute(interaction, client) {
        // Checks if the interaction is a command (to prevent weird bugs)

        if (!interaction.isButton()) return;

        const command = client.buttonCommands.get(interaction.customId);

        // If the interaction is not a command in cache, return error message.
        // You can modify the error message at ./messages/defaultButtonError.js file!

        if (!command) return;
        // If the interaction is not a command in cache.

        const color = require('../configurations/colors');
        const logs = require('../configurations/logs');
        const avatar = require('../configurations/avatars');

        let d = new Date();
        d.setHours(0, 0, 0, 0);

        // A try to executes the interaction.

        const ChannelButtonStats = require('../models/stats/ChannelButtonStats');
        const DmButtonStats = require('../models/stats/DmButtonStats');
        const GlobalButtonStats = require('../models/stats/GlobalButtonStats');
        const GuildButtonStats = require('../models/stats/GuildButtonStats');
        const GroupDmButtonStats = require('../models/stats/GroupDmButtonStats');

        if (interaction?.channel?.type == ChannelType.DM) {
            const dataDmButtonStats = await DmButtonStats.findOne({
                date: d,
                userId: interaction.user.id,
                dmChannelId: interaction.channel.id
            });

            if (dataDmButtonStats) {
                if (dataDmButtonStats.buttons.find((x) => x.id == interaction.customId)) {
                    dataDmButtonStats.buttons.map((x) => {
                        if (x.id == interaction.customId) x.count += 1;
                        return x;
                    });
                } else {
                    dataDmButtonStats.buttons.push({ id: interaction.customId, count: 1 });
                }

                await dataDmButtonStats.save();
            } else {
                await DmButtonStats.create({
                    buttons: [{ id: interaction.customId, count: 1 }],
                    dmChannelId: interaction.channel.id,
                    userId: interaction.user.id,
                    date: d
                });
            }
        }

        // GroupDmButtonStats

        if (interaction?.channel?.type == ChannelType.GroupDM) {
            const dataGroupDmButtonStats = await GroupDmButtonStats.findOne({
                date: d,
                userId: interaction.user.id,
                dmChannelId: interaction.channel.id
            });

            if (dataGroupDmButtonStats) {
                if (dataGroupDmButtonStats.buttons.find((x) => x.id == interaction.customId)) {
                    dataGroupDmButtonStats.buttons.map((x) => {
                        if (x.id == interaction.customId) x.count += 1;
                        return x;
                    });
                } else {
                    dataGroupDmButtonStats.buttons.push({ id: interaction.customId, count: 1 });
                }

                await dataGroupDmButtonStats.save();
            } else {
                await GroupDmButtonStats.create({
                    buttons: [{ id: interaction.customId, count: 1 }],
                    dmChannelId: interaction.channel.id,
                    userId: interaction.user.id,
                    date: d
                });
            }
        }

        // ChannelButtonStats

        if (interaction?.channel?.type != ChannelType.DM && interaction?.channel?.type != ChannelType.GroupDM) {
            const dataChannelButtonStats = await ChannelButtonStats.findOne({
                date: d,
                userId: interaction.user.id,
                channelId: interaction.channel.id,
                guildId: interaction.guild.id
            });

            if (dataChannelButtonStats) {
                if (dataChannelButtonStats.buttons.find((x) => x.id == interaction.customId)) {
                    dataChannelButtonStats.buttons.map((x) => {
                        if (x.id == interaction.customId) x.count += 1;
                        return x;
                    });
                } else {
                    dataChannelButtonStats.buttons.push({ id: interaction.customId, count: 1 });
                }

                await dataChannelButtonStats.save();
            } else {
                await ChannelButtonStats.create({
                    buttons: [{ id: interaction.customId, count: 1 }],
                    channelId: interaction.channel.id,
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                    date: d
                });
            }
        }

        // GuildButtonStats

        if (interaction?.guild) {
            const dataGuildButtonStats = await GuildButtonStats.findOne({
                date: d,
                userId: interaction.user.id,
                guildId: interaction.guild.id
            });

            if (dataGuildButtonStats) {
                if (dataGuildButtonStats.buttons.find((x) => x.id == interaction.customId)) {
                    dataGuildButtonStats.buttons.map((x) => {
                        if (x.id == interaction.customId) x.count += 1;
                        return x;
                    });
                } else {
                    dataGuildButtonStats.buttons.push({ id: interaction.customId, count: 1 });
                }

                await dataGuildButtonStats.save();
            } else {
                await GuildButtonStats.create({
                    buttons: [{ id: interaction.customId, count: 1 }],
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                    date: d
                });
            }
        }

        // GlobalButtonStats

        const dataGlobalButtonStats = await GlobalButtonStats.findOne({
            date: d,
            userId: interaction.user.id
        });

        if (dataGlobalButtonStats) {
            if (dataGlobalButtonStats.buttons.find((x) => x.id == interaction.customId)) {
                dataGlobalButtonStats.buttons.map((x) => {
                    if (x.id == interaction.customId) x.count += 1;
                    return x;
                });
            } else {
                dataGlobalButtonStats.buttons.push({ id: interaction.customId, count: 1 });
            }

            await dataGlobalButtonStats.save();
        } else {
            await GlobalButtonStats.create({
                buttons: [{ id: interaction.customId, count: 1 }],
                userId: interaction.user.id,
                date: d
            });
        }

        // Logs

        const forumChannel = client.channels.cache.get(logs.interactionsForumChannelId);

        if (!forumChannel) return client.out.alert('No forumChannel found', this.name);

        const webhooks = await forumChannel.fetchWebhooks();

        let webhook = null;

        if (webhooks.find((x) => x.name == logs.webhookName)) {
            webhook = new WebhookClient({ url: webhooks.find((x) => x.name == logs.webhookName).url });
        } else {
            webhook = await forumChannel.createWebhook({ name: logs.webhookName, avatar: client.user.displayAvatarURL() });
        }

        await webhook.edit({ name: 'Button', avatar: avatar.button });

        // This Button's stats in every guild (total time)

        const dataGlobalSlashCount = await GlobalButtonStats.find({});

        let a = 0;

        dataGlobalSlashCount.forEach((x) => {
            if (x.buttons.find((x) => x.id === interaction.customId)) {
                a += x.buttons.find((x) => x.id === interaction.customId).count;
            }
        });

        const dataGlobalSlashCountToday = await GlobalButtonStats.find({ date: d });

        let e = 0;

        dataGlobalSlashCountToday.forEach((x) => {
            if (x.buttons.find((x) => x.id === interaction.customId)) {
                e += x.buttons.find((x) => x.id === interaction.customId).count;
            }
        });

        let webhookGuilds = null;

        if (interaction.guild) {
            // This Button's stats in this guild (total time)

            const dataGuildSlashCount = await GuildButtonStats.find({ guildId: interaction.guild.id });

            let b = 0;

            dataGuildSlashCount.forEach((x) => {
                if (x.buttons.find((x) => x.id === interaction.customId)) {
                    b += x.buttons.find((x) => x.id === interaction.customId).count;
                }
            });

            const dataGuildSlashCountTodaay = await GuildButtonStats.find({ guildId: interaction.guild.id, date: d });

            let f = 0;

            dataGuildSlashCountTodaay.forEach((x) => {
                if (x.buttons.find((x) => x.id === interaction.customId)) {
                    f += x.buttons.find((x) => x.id === interaction.customId).count;
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
                            .setColor(color.button)
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
                                )}:R>]\n\n> __**Usage-data**__\n→ Button: **${interaction.customId}** (||${
                                    interaction.customId
                                }||)\n→ Today [Guild / Global  / On this guild]: **${b} / ${a} (${parseInt(
                                    (b / a) * 100
                                )}%)**\n→ All-Time [Guild / Global / On this guild]: **${f} / ${e} (${parseInt((f / e) * 100)}%)**`
                            )
                            .setTimestamp()
                    ],
                    threadId: client.configs.logs.buttonThreadId
                })
                .catch((err) => {
                    client.out.warn('Error with LogWebhookUrl (Sending) ' + this.name);

                    client.out.error(err);
                });

            const forumChannelGuilds = client.channels.cache.get(logs.guildsForumChannelId);

            if (!forumChannelGuilds) return client.out.alert('No forumChannelGuilds found', this.name);

            const webhooksGuildss = await forumChannelGuilds.fetchWebhooks();

            if (webhooksGuildss.find((x) => x.name == logs.webhookName)) {
                webhookGuilds = new WebhookClient({ url: webhooksGuildss.find((x) => x.name == logs.webhookName).url });
            } else {
                webhookGuilds = await forumChannelGuilds.createWebhook({ name: logs.webhookName, avatar: client.user.displayAvatarURL() });
            }

            await webhookGuilds.edit({ name: 'Button', avatar: avatar.button });

            if (webhookGuilds) {
                webhookGuilds
                    .send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(color.button)
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
                                    )}:R>]\n\n> __**Usage-data**__\n→ Button: **${interaction.customId}** (||${
                                        interaction.customId
                                    }||)\n→ Today [Guild / Global  / On this guild]: **${b} / ${a} (${parseInt(
                                        (b / a) * 100
                                    )}%)**\n→ All-Time [Guild / Global / On this guild]: **${f} / ${e} (${parseInt((f / e) * 100)}%)**`
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
            // This button's stats in this DM (total time)

            const dataDmSlashCount = await DmButtonStats.find({ dmChannelId: interaction.channel.id });

            let c = 0;

            dataDmSlashCount.forEach((x) => {
                if (x.buttons.find((x) => x.id === interaction.customId)) {
                    c += x.buttons.find((x) => x.id === interaction.customId).count;
                }
            });

            const dataDmSlashCountToday = await DmButtonStats.find({ dmChannelId: interaction.channel.id });

            let g = 0;

            dataDmSlashCountToday.forEach((x) => {
                if (x.buttons.find((x) => x.id === interaction.customId)) {
                    g += x.buttons.find((x) => x.id === interaction.customId).count;
                }
            });

            webhook
                .send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(color.button)
                            .setFooter({
                                text: client.configs.footer.defaultText,
                                iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : ''
                            })
                            .setDescription(
                                `> __**Informations**__\n→ Channel: **DM** (||${interaction.channel.id}||) [<t:${parseInt(
                                    interaction.channel.createdTimestamp / 1000
                                )}:R>]\n→ User: **${interaction.user.tag}** (||${interaction.user.id}||) [<t:${parseInt(
                                    interaction.user.createdTimestamp / 1000
                                )}:R>]\n\n> __**Usage-data**__\n→ Button: **${interaction.customId}** (||${
                                    interaction.customId
                                }||)\n→ Today [This DM / Global  / On this DM]: **${g} / ${e} (${parseInt(
                                    (g / e) * 100
                                )}%)**\n→ All-Time [This DM / Global / On this DM]: **${c} / ${a} (${parseInt((c / a) * 100)}%)**`
                            )
                            .setTimestamp()
                    ],
                    threadId: client.configs.logs.buttonThreadId
                })
                .catch((err) => {
                    client.out.warn('Error with LogWebhookUrl (Sending) ' + this.name);

                    client.out.error(err);
                });
        }

        await webhook.edit({ name: logs.webhookName, avatar: client.user.displayAvatarURL() });
        await webhookGuilds.edit({ name: logs.webhookName, avatar: client.user.displayAvatarURL() });
    }
};
