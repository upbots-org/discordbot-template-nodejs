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
const { ChatInputCommandInteraction, Client, ChannelType, WebhookClient, EmbedBuilder } = require('discord.js');

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
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     * @returns
     */
    async execute(interaction, client) {
        // Checks if the interaction is a command (to prevent weird bugs)

        if (!interaction.isChatInputCommand()) return;

        const command = client.slashCommands.get(interaction.commandName);

        // If the interaction is not a command in cache.

        if (!command) return;

        let d = new Date();
        d.setHours(0, 0, 0, 0);

        // A try to executes the interaction.

        const ChannelSlashStats = require('../models/stats/ChannelSlashStats');
        const DmSlashStats = require('../models/stats/DmSlashStats');
        const GlobalSlashStats = require('../models/stats/GlobalSlashStats');
        const GuildSlashStats = require('../models/stats/GuildSlashStats');
        const GroupDmSlashStats = require('../models/stats/GroupDmSlashStats');

        if (interaction?.channel?.type == ChannelType.DM) {
            const dataDmSlashStats = await DmSlashStats.findOne({
                date: d,
                userId: interaction.user.id,
                dmChannelId: interaction.channel.id
            });

            if (dataDmSlashStats) {
                if (dataDmSlashStats.slashCommands.find((x) => x.id == interaction.commandId)) {
                    dataDmSlashStats.slashCommands.map((x) => {
                        if (x.id == interaction.commandId) x.count += 1;
                        return x;
                    });
                } else {
                    dataDmSlashStats.slashCommands.push({ id: interaction.commandId, count: 1 });
                }

                await dataDmSlashStats.save();
            } else {
                await DmSlashStats.create({
                    slashCommands: [{ id: interaction.commandId, count: 1 }],
                    dmChannelId: interaction.channel.id,
                    userId: interaction.user.id,
                    date: d
                });
            }
        }

        // GroupDmSlashStats

        if (interaction?.channel?.type == ChannelType.GroupDM) {
            const dataGroupDmSlashStats = await GroupDmSlashStats.findOne({
                date: d,
                userId: interaction.user.id,
                dmChannelId: interaction.channel.id
            });

            if (dataGroupDmSlashStats) {
                if (dataGroupDmSlashStats.slashCommands.find((x) => x.id == interaction.commandId)) {
                    dataGroupDmSlashStats.slashCommands.map((x) => {
                        if (x.id == interaction.commandId) x.count += 1;
                        return x;
                    });
                } else {
                    dataGroupDmSlashStats.slashCommands.push({ id: interaction.commandId, count: 1 });
                }

                await dataGroupDmSlashStats.save();
            } else {
                await GroupDmSlashStats.create({
                    slashCommands: [{ id: interaction.commandId, count: 1 }],
                    dmChannelId: interaction.channel.id,
                    userId: interaction.user.id,
                    date: d
                });
            }
        }

        // ChannelSlashStats

        if (interaction?.channel?.type != ChannelType.DM && interaction?.channel?.type != ChannelType.GroupDM) {
            const dataChannelSlashStats = await ChannelSlashStats.findOne({
                date: d,
                userId: interaction.user.id,
                channelId: interaction.channel.id,
                guildId: interaction.guild.id
            });

            if (dataChannelSlashStats) {
                if (dataChannelSlashStats.slashCommands.find((x) => x.id == interaction.commandId)) {
                    dataChannelSlashStats.slashCommands.map((x) => {
                        if (x.id == interaction.commandId) x.count += 1;
                        return x;
                    });
                } else {
                    dataChannelSlashStats.slashCommands.push({ id: interaction.commandId, count: 1 });
                }

                await dataChannelSlashStats.save();
            } else {
                await ChannelSlashStats.create({
                    slashCommands: [{ id: interaction.commandId, count: 1 }],
                    channelId: interaction.channel.id,
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                    date: d
                });
            }
        }

        // GuildSlashStats

        if (interaction?.guild) {
            const dataGuildSlashStats = await GuildSlashStats.findOne({
                date: d,
                userId: interaction.user.id,
                guildId: interaction.guild.id
            });

            if (dataGuildSlashStats) {
                if (dataGuildSlashStats.slashCommands.find((x) => x.id == interaction.commandId)) {
                    dataGuildSlashStats.slashCommands.map((x) => {
                        if (x.id == interaction.commandId) x.count += 1;
                        return x;
                    });
                } else {
                    dataGuildSlashStats.slashCommands.push({ id: interaction.commandId, count: 1 });
                }

                await dataGuildSlashStats.save();
            } else {
                await GuildSlashStats.create({
                    slashCommands: [{ id: interaction.commandId, count: 1 }],
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                    date: d
                });
            }
        }

        // GlobalSlashStats

        const dataGlobalSlashStats = await GlobalSlashStats.findOne({
            date: d,
            userId: interaction.user.id
        });

        if (dataGlobalSlashStats) {
            if (dataGlobalSlashStats.slashCommands.find((x) => x.id == interaction.commandId)) {
                dataGlobalSlashStats.slashCommands.map((x) => {
                    if (x.id == interaction.commandId) x.count += 1;
                    return x;
                });
            } else {
                dataGlobalSlashStats.slashCommands.push({ id: interaction.commandId, count: 1 });
            }

            await dataGlobalSlashStats.save();
        } else {
            await GlobalSlashStats.create({
                slashCommands: [{ id: interaction.commandId, count: 1 }],
                userId: interaction.user.id,
                date: d
            });
        }

        // Logs

        const webhook = new WebhookClient({ url: client.configs.logs.webhookUrl });

        // This command's stats in every guild (total time)

        const dataGlobalSlashCount = await GlobalSlashStats.find({});

        let a = 0;

        dataGlobalSlashCount.forEach((x) => {
            if (x.slashCommands.find((x) => x.id === interaction.commandId)) {
                a += x.slashCommands.find((x) => x.id === interaction.commandId).count;
            }
        });

        const dataGlobalSlashCountToday = await GlobalSlashStats.find({ date: d });

        let e = 0;

        dataGlobalSlashCountToday.forEach((x) => {
            if (x.slashCommands.find((x) => x.id === interaction.commandId)) {
                e += x.slashCommands.find((x) => x.id === interaction.commandId).count;
            }
        });

        if (interaction.guild) {
            // This command's stats in this guild (total time)

            const dataGuildSlashCount = await GuildSlashStats.find({ guildId: interaction.guild.id });

            let b = 0;

            dataGuildSlashCount.forEach((x) => {
                if (x.slashCommands.find((x) => x.id === interaction.commandId)) {
                    b += x.slashCommands.find((x) => x.id === interaction.commandId).count;
                }
            });

            const dataGuildSlashCountTodaay = await GuildSlashStats.find({ guildId: interaction.guild.id, date: d });

            let f = 0;

            dataGuildSlashCountTodaay.forEach((x) => {
                if (x.slashCommands.find((x) => x.id === interaction.commandId)) {
                    f += x.slashCommands.find((x) => x.id === interaction.commandId).count;
                }
            });

            webhook
                .send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.configs.colors.default)
                            .setFooter({
                                text: client.configs.footer.defaultText,
                                iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : ''
                            })
                            .setDescription(
                                `> __**Informations**__\n→ Guild: **${interaction.guild.name}** (||${interaction.guild.id}||) [${
                                    interaction.guild.memberCount
                                } Members - <t:${parseInt(interaction.guild.createdTimestamp / 1000)}:R>]\n→ Channel: **#${
                                    interaction.channel.name
                                }** (||${interaction.channel.id}||) [<t:${parseInt(
                                    interaction.channel.createdTimestamp / 1000
                                )}:R>]\n→ User: **${interaction.user.tag}** (||${interaction.user.id}||) [<t:${parseInt(
                                    interaction.user.createdTimestamp / 1000
                                )}:R>]\n\n> __**Usage-data**__\n→ Command: </${interaction.commandName}:${interaction.commandId}> (||${
                                    interaction.commandId
                                }||)\n→ Today [Guild / Global  / On this guild]: **${b} / ${a} (${parseInt(
                                    (b / a) * 100
                                )}%)**\n→ All-Time [Guild / Global / On this guild]: **${f} / ${e} (${parseInt((f / e) * 100)}%)**`
                            )
                            .setTimestamp()
                    ],
                    threadId: client.configs.logs.slashThreadId
                })
                .catch((err) => {
                    client.out.warn('Error with LogWebhookUrl (Sending) ' + this.name);

                    client.out.error(err);
                });
        } else {
            // This command's stats in this DM (total time)

            const dataDmSlashCount = await DmSlashStats.find({ dmChannelId: interaction.channel.id });

            let c = 0;

            dataDmSlashCount.forEach((x) => {
                if (x.slashCommands.find((x) => x.id === interaction.commandId)) {
                    c += x.slashCommands.find((x) => x.id === interaction.commandId).count;
                }
            });

            const dataDmSlashCountToday = await DmSlashStats.find({ dmChannelId: interaction.channel.id });

            let g = 0;

            dataDmSlashCountToday.forEach((x) => {
                if (x.slashCommands.find((x) => x.id === interaction.commandId)) {
                    g += x.slashCommands.find((x) => x.id === interaction.commandId).count;
                }
            });

            webhook
                .send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.configs.colors.default)
                            .setFooter({
                                text: client.configs.footer.defaultText,
                                iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : ''
                            })
                            .setDescription(
                                `> __**Informations**__\n→ Channel: **DM** (||${interaction.channel.id}||) [<t:${parseInt(
                                    interaction.channel.createdTimestamp / 1000
                                )}:R>]\n→ User: **${interaction.user.tag}** (||${interaction.user.id}||) [<t:${parseInt(
                                    interaction.user.createdTimestamp / 1000
                                )}:R>]\n\n> __**Usage-data**__\n→ Command: </${interaction.commandName}:${interaction.commandId}> (||${
                                    interaction.commandId
                                }||)\n→ Today [This DM / Global  / On this guild]: **${g} / ${e} (${parseInt(
                                    (g / e) * 100
                                )}%)**\n→ All-Time [This DM / Global / On this guild]: **${c} / ${a} (${parseInt((c / a) * 100)}%)**`
                            )
                            .setTimestamp()
                    ],
                    threadId: client.configs.logs.slashThreadId
                })
                .catch((err) => {
                    client.out.warn('Error with LogWebhookUrl (Sending) ' + this.name);

                    client.out.error(err);
                });
        }
    }
};
