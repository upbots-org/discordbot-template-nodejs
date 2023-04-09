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
const { Message, Client, ChannelType, WebhookClient, EmbedBuilder } = require('discord.js');

const GuildSettings = require('../models/guilds/GuildSettings');

const color = require('../configurations/colors');
const logs = require('../configurations/logs');
const avatar = require('../configurations/avatars');

const ChannelTriggerStats = require('../models/stats/ChannelTriggerStats');
const DmTriggerStats = require('../models/stats/DmTriggerStats');
const GlobalTriggerStats = require('../models/stats/GlobalTriggerStats');
const GuildTriggerStats = require('../models/stats/GuildTriggerStats');
const GroupDmTriggerStats = require('../models/stats/GroupDmTriggerStats');

/**
 * @author LuciferMorningstarDev
 * @since 1.0.0
 */

module.exports = {
    name: 'messageCreate',
    /**
     *
     * @param {Message} message
     * @param {Client} client
     * @returns
     */
    async execute(message, client) {
        /**
         * @description The Message Content of the received message seperated by spaces (' ') in an array, this excludes prefix and command/alias itself.
         */

        const args = message.content.split(/ +/);

        // Checks if the trigger author is a bot. Comment this line if you want to reply to bots as well.

        if (message.author.bot) return;

        // Checking ALL triggers using every function and breaking out if a trigger was found.

        /**
         * Checks if the message has a trigger.
         * */

        let triggered = false;

        message.client.triggers.every((trigger) => {
            if (triggered) return false;

            trigger.name.every(async (name) => {
                if (triggered) return false;

                // If validated, it will try to execute the trigger.

                if (message.content.includes(name)) {
                    try {
                        trigger.execute(message, args);
                    } catch (error) {
                        client.out.error(error);
                    }

                    // Stats

                    let d = new Date();
                    d.setHours(0, 0, 0, 0);

                    // A try to executes the message.

                    if (message?.channel?.type == ChannelType.DM) {
                        const dataDmTriggerStats = await DmTriggerStats.findOne({
                            date: d,
                            userId: message.author.id,
                            dmChannelId: message.channel.id
                        });

                        if (dataDmTriggerStats) {
                            if (dataDmTriggerStats.triggers.find((x) => x.id == name)) {
                                dataDmTriggerStats.triggers.map((x) => {
                                    if (x.id == name) x.count += 1;
                                    return x;
                                });
                            } else {
                                dataDmTriggerStats.triggers.push({ id: name, count: 1 });
                            }

                            await dataDmTriggerStats.save();
                        } else {
                            await DmTriggerStats.create({
                                triggers: [{ id: name, count: 1 }],
                                dmChannelId: message.channel.id,
                                userId: message.author.id,
                                date: d
                            });
                        }
                    }

                    // GroupDmTriggerStats

                    if (message?.channel?.type == ChannelType.GroupDM) {
                        const dataGroupDmTriggerStats = await GroupDmTriggerStats.findOne({
                            date: d,
                            userId: message.author.id,
                            dmChannelId: message.channel.id
                        });

                        if (dataGroupDmTriggerStats) {
                            if (dataGroupDmTriggerStats.triggers.find((x) => x.id == name)) {
                                dataGroupDmTriggerStats.triggers.map((x) => {
                                    if (x.id == name) x.count += 1;
                                    return x;
                                });
                            } else {
                                dataGroupDmTriggerStats.triggers.push({ id: name, count: 1 });
                            }

                            await dataGroupDmTriggerStats.save();
                        } else {
                            await GroupDmTriggerStats.create({
                                triggers: [{ id: name, count: 1 }],
                                dmChannelId: message.channel.id,
                                userId: message.author.id,
                                date: d
                            });
                        }
                    }

                    // ChannelTriggerStats

                    if (message?.channel?.type != ChannelType.DM && message?.channel?.type != ChannelType.GroupDM) {
                        const dataChannelTriggerStats = await ChannelTriggerStats.findOne({
                            date: d,
                            userId: message.author.id,
                            channelId: message.channel.id,
                            guildId: message.guild.id
                        });

                        if (dataChannelTriggerStats) {
                            if (dataChannelTriggerStats.triggers.find((x) => x.id == name)) {
                                dataChannelTriggerStats.triggers.map((x) => {
                                    if (x.id == name) x.count += 1;
                                    return x;
                                });
                            } else {
                                dataChannelTriggerStats.triggers.push({ id: name, count: 1 });
                            }

                            await dataChannelTriggerStats.save();
                        } else {
                            await ChannelTriggerStats.create({
                                triggers: [{ id: name, count: 1 }],
                                channelId: message.channel.id,
                                guildId: message.guild.id,
                                userId: message.author.id,
                                date: d
                            });
                        }
                    }

                    // GuildTriggerStats

                    if (message?.guild) {
                        const dataGuildTriggerStats = await GuildTriggerStats.findOne({
                            date: d,
                            userId: message.author.id,
                            guildId: message.guild.id
                        });

                        if (dataGuildTriggerStats) {
                            if (dataGuildTriggerStats.triggers.find((x) => x.id == name)) {
                                dataGuildTriggerStats.triggers.map((x) => {
                                    if (x.id == name) x.count += 1;
                                    return x;
                                });
                            } else {
                                dataGuildTriggerStats.triggers.push({ id: name, count: 1 });
                            }

                            await dataGuildTriggerStats.save();
                        } else {
                            await GuildTriggerStats.create({
                                triggers: [{ id: name, count: 1 }],
                                guildId: message.guild.id,
                                userId: message.author.id,
                                date: d
                            });
                        }
                    }

                    // GlobalTriggerStats

                    const dataGlobalTriggerStats = await GlobalTriggerStats.findOne({
                        date: d,
                        userId: message.author.id
                    });

                    if (dataGlobalTriggerStats) {
                        if (dataGlobalTriggerStats.triggers.find((x) => x.id == name)) {
                            dataGlobalTriggerStats.triggers.map((x) => {
                                if (x.id == name) x.count += 1;
                                return x;
                            });
                        } else {
                            dataGlobalTriggerStats.triggers.push({ id: name, count: 1 });
                        }

                        await dataGlobalTriggerStats.save();
                    } else {
                        await GlobalTriggerStats.create({
                            triggers: [{ id: name, count: 1 }],
                            userId: message.author.id,
                            date: d
                        });
                    }

                    // Logs

                    const forumChannel = client.channels.cache.get(logs.interactionsForumChannelId);

                    if (!forumChannel) return client.out.alert('No forumChannel found', this.name);

                    const webhooks = await forumChannel.fetchWebhooks();

                    let webhook = null;

                    if (webhooks.find((x) => x.name == 'Trigger')) {
                        webhook = new WebhookClient({ url: webhooks.find((x) => x.name == 'Trigger').url });
                    } else {
                        webhook = await forumChannel.createWebhook({ name: 'Trigger', avatar: avatar.trigger });
                    }

                    // This Trigger's stats in every guild (total time)

                    const dataGlobalTriggerCount = await GlobalTriggerStats.find({});

                    let a = 0;

                    dataGlobalTriggerCount.forEach((x) => {
                        if (x.triggers.find((x) => x.id === name)) {
                            a += x.triggers.find((x) => x.id === name).count;
                        }
                    });

                    const dataGlobalTriggerCountToday = await GlobalTriggerStats.find({ date: d });

                    let e = 0;

                    dataGlobalTriggerCountToday.forEach((x) => {
                        if (x.triggers.find((x) => x.id === name)) {
                            e += x.triggers.find((x) => x.id === name).count;
                        }
                    });

                    let webhookGuilds = null;

                    if (message.guild) {
                        // This Trigger's stats in this guild (total time)

                        const dataGuildTriggerCount = await GuildTriggerStats.find({ guildId: message.guild.id });

                        let b = 0;

                        dataGuildTriggerCount.forEach((x) => {
                            if (x.triggers.find((x) => x.id === name)) {
                                b += x.triggers.find((x) => x.id === name).count;
                            }
                        });

                        const dataGuildTriggerCountTodaay = await GuildTriggerStats.find({ guildId: message.guild.id, date: d });

                        let f = 0;

                        dataGuildTriggerCountTodaay.forEach((x) => {
                            if (x.triggers.find((x) => x.id === name)) {
                                f += x.triggers.find((x) => x.id === name).count;
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
                                        .setColor(color.trigger)
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
                                            )}:R>]\n\n> __**Usage-data**__\n→ Trigger: **${name}** (||${name}||)\n→ Today [Guild / Global  / On this guild]: **${f} / ${e} (${parseInt(
                                                (f / e) * 100
                                            )}%)**\n→ All-Time [Guild / Global / On this guild]: **${b} / ${a} (${parseInt(
                                                (b / a) * 100
                                            )}%)**`
                                        )
                                        .setTimestamp()
                                ],
                                threadId: client.configs.logs.triggerThreadId
                            })
                            .catch((err) => {
                                client.out.warn('Error with LogWebhookUrl (Sending) ' + this.name);

                                client.out.error(err);
                            });

                        const forumChannelGuilds = client.channels.cache.get(logs.guildsForumChannelId);

                        if (!forumChannelGuilds) return client.out.alert('No forumChannelGuilds found', this.name);

                        const webhooksGuildss = await forumChannelGuilds.fetchWebhooks();

                        if (webhooksGuildss.find((x) => x.name == 'Trigger')) {
                            webhookGuilds = new WebhookClient({ url: webhooksGuildss.find((x) => x.name == 'Trigger').url });
                        } else {
                            webhookGuilds = await forumChannelGuilds.createWebhook({ name: 'Trigger', avatar: avatar.trigger });
                        }

                        if (webhookGuilds) {
                            webhookGuilds
                                .send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(color.trigger)
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
                                                )}:R>]\n\n> __**Usage-data**__\n→ Trigger: **${name}** (||${name}||)\n→ Today [Guild / Global  / On this guild]: **${f} / ${e} (${parseInt(
                                                    (f / e) * 100
                                                )}%)**\n→ All-Time [Guild / Global / On this guild]: **${b} / ${a} (${parseInt(
                                                    (b / a) * 100
                                                )}%)**`
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
                        // This trigger's stats in this DM (total time)

                        const dataDmTriggerCount = await DmTriggerStats.find({ dmChannelId: message.channel.id });

                        let c = 0;

                        dataDmTriggerCount.forEach((x) => {
                            if (x.triggers.find((x) => x.id === name)) {
                                c += x.triggers.find((x) => x.id === name).count;
                            }
                        });

                        const dataDmTriggerCountToday = await DmTriggerStats.find({ dmChannelId: message.channel.id });

                        let g = 0;

                        dataDmTriggerCountToday.forEach((x) => {
                            if (x.triggers.find((x) => x.id === name)) {
                                g += x.triggers.find((x) => x.id === name).count;
                            }
                        });

                        webhook
                            .send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(color.trigger)
                                        .setFooter({
                                            text: client.configs.footer.defaultText,
                                            iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : ''
                                        })
                                        .setDescription(
                                            `> __**Informations**__\n→ Channel: **DM** (||${message.channel.id}||) [<t:${parseInt(
                                                message.channel.createdTimestamp / 1000
                                            )}:R>]\n→ User: **${message.author.tag}** (||${message.author.id}||) [<t:${parseInt(
                                                message.author.createdTimestamp / 1000
                                            )}:R>]\n\n> __**Usage-data**__\n→ Trigger: **${name}** (||${name}||)\n→ Today [This DM / Global  / On this DM]: **${g} / ${e} (${parseInt(
                                                (g / e) * 100
                                            )}%)**\n→ All-Time [This DM / Global / On this DM]: **${c} / ${a} (${parseInt(
                                                (c / a) * 100
                                            )}%)**`
                                        )
                                        .setTimestamp()
                                ],
                                threadId: client.configs.logs.triggerThreadId
                            })
                            .catch((err) => {
                                client.out.warn('Error with LogWebhookUrl (Sending) ' + this.name);

                                client.out.error(err);
                            });
                    }

                    // Set the trigger to be true & return.

                    triggered = true;
                    return false;
                }
            });
        });
    }
};
