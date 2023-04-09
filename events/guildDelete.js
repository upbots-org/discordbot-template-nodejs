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
const { Guild, Client, WebhookClient, EmbedBuilder } = require('discord.js');

const GuildSettings = require('../models/guilds/GuildSettings');

const guildCountStats = require('../models/stats/GuildCountStats');

const color = require('../configurations/colors');
const logsConfig = require('../configurations/logs');
const avatar = require('../configurations/avatars');

// https://www.w3schools.com/js/js_strict.asp

/**********************************************************************/

/**
 * @author LuciferMorningstarDev
 * @since 1.0.0
 */

module.exports = {
    name: 'guildDelete',
    /**
     *
     * @param {Guild} guild
     * @param {Client} client
     */
    async execute(guild, client) {
        client.out.warn(`Left a guild [Members ${guild.memberCount} | Total Guilds ${client.guilds.cache.size}]`);

        let dataGuildSettings = null;

        dataGuildSettings = await GuildSettings.findOne({ id: guild.id });

        if (!dataGuildSettings) return client.out.alert(`No data found while leaving guild with id ${guild.id}`);
        // Send LeaveLog in guildpost

        const forum = client.channels.cache.get(client.configs.logs.guildsForumChannelId);

        const category = client.channels.cache.get(client.configs.logs.categoryId);

        if (category) {
            category.edit({ name: `${client.user.username} [Bot - ${client.guilds.cache.size} Guilds]` });
        } else {
            client.out.alert(`Category can't be found!`, this.name);
        }

        let thread = null;
        let webhookGuilds = null;

        if (forum) {
            if (forum.threads.cache.find((x) => x.id === dataGuildSettings.threadId)) {
                thread = forum.threads.cache.find((x) => x.id === dataGuildSettings.threadId);

                thread.setAppliedTags([client.configs.logs.offGuildTagId]);

                const forumChannelGuilds = client.channels.cache.get(client.configs.logs.guildsForumChannelId);

                if (!forumChannelGuilds) return client.out.alert('No forumChannelGuilds found', this.name);

                const webhooksGuildss = await forumChannelGuilds.fetchWebhooks();

                if (webhooksGuildss.find((x) => x.name == 'Leave')) {
                    webhookGuilds = new WebhookClient({ url: webhooksGuildss.find((x) => x.name == 'Leave').url });
                } else {
                    webhookGuilds = await forumChannelGuilds.createWebhook({
                        name: 'Leave',
                        avatar: avatar.leave
                    });
                }

                webhookGuilds.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.configs.colors.leave)
                            .setDescription(
                                `> Left **${guild.name}** (||${guild.id}||) [${guild.memberCount} - <t:${parseInt(
                                    guild.createdTimestamp / 1000
                                )}:R>]`
                            )
                            .addFields({ name: 'Total Guilds', value: `${client.guilds.cache.size}`, inline: true })
                            .setFooter({
                                text: client.configs.footer.defaultText,
                                iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : null
                            })
                            .setTimestamp()
                    ],
                    threadId: thread.id
                });
            }
        }

        // Send LeaveLog in other logs

        const forumChannel = client.channels.cache.get(client.configs.logs.otherForumChannelId);

        if (!forumChannel) return client.out.alert('No forumChannel found', this.name);

        const webhooks = await forumChannel.fetchWebhooks();

        let webhook = null;

        if (webhooks.find((x) => x.name == 'Leave')) {
            webhook = new WebhookClient({ url: webhooks.find((x) => x.name == 'Leave').url });
        } else {
            webhook = await forumChannel.createWebhook({ name: 'Leave', avatar: avatar.leave });
        }

        webhook.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.configs.colors.leave)
                    .setDescription(
                        `> Left **${guild.name}** (||${guild.id}||) [${guild.memberCount} - <t:${parseInt(
                            guild.createdTimestamp / 1000
                        )}:R>]`
                    )
                    .addFields({ name: 'Total Guilds', value: `${client.guilds.cache.size}`, inline: true })
                    .setThumbnail(guild.iconURL())
                    .setFooter({
                        text: client.configs.footer.defaultText,
                        iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : null
                    })
                    .setTimestamp()
            ],
            threadId: client.configs.logs.guildLogThreadId
        });

        // Deleting Data

        await GuildSettings.findOneAndDelete({ id: guild.id });

        // UPDATE STATS

        let d = new Date();
        d.setHours(0, 0, 0, 0);

        let dataGuildCountStats = null;

        dataGuildCountStats = await guildCountStats.findOne({ date: d });

        if (!dataGuildCountStats) {
            dataGuildCountStats = await guildCountStats.create({
                date: d,
                joined: [],
                left: [{ name: guild.name, id: guild.id, timestamp: Date.now(), membercount: guild.memberCount }]
            });
        } else {
            await guildCountStats.findOneAndUpdate(
                { date: d },
                { $push: { left: { name: guild.name, id: guild.id, timestamp: Date.now(), membercount: guild.memberCount } } }
            );
        }
    }
};
