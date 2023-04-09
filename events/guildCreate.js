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

const {
    Guild,
    Client,
    EmbedBuilder,
    WebhookClient,
    AuditLogEvent,
    ActionRowBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder,
    ButtonStyle,
    AttachmentBuilder
} = require('discord.js');

const guildSettings = require('../models/guilds/GuildSettings');

const color = require('../configurations/colors');
const logsConfig = require('../configurations/logs');
const avatar = require('../configurations/avatars');

const { success, error, join, leave } = require('../configurations/colors');

const guildCountStats = require('../models/stats/GuildCountStats');

module.exports = {
    name: 'guildCreate',
    /**
     *
     * @param {Guild} guild
     * @param {Client} client
     */
    async execute(guild, client) {
        client.out.log(`Joined a new guild [Members ${guild.memberCount} | Total Guilds ${client.guilds.cache.size}]`);

        let dataGuildSettings = null;

        dataGuildSettings = await guildSettings.findOne({ id: guild.id });

        if (dataGuildSettings) {
            await guildSettings.findOneAndDelete({ id: guild.id });
        }

        await guildSettings.create({
            id: guild.id,
            announcementWebhookUrl: null,
            threadId: null,
            language: 'en_us',
            setupMessageId: null,
            addedById: null
        });

        dataGuildSettings = await guildSettings.findOne({ id: guild.id });

        // Fetching Audit-Logs and AddedByUser

        const fetchLogs = await guild?.fetchAuditLogs({ type: AuditLogEvent.BotAdd, limit: 1 });
        const logs = fetchLogs?.entries?.first();

        let messageId = null;

        if (logs) {
            try {
                messageId = await logs.executor.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.configs.colors.default)
                            .setTitle(`Hey ${logs.executor.tag}!`)
                            .setDescription(`> Thank you for adding me to your Server!\n\n> Choose your language below!`)
                            .setFooter({
                                text: client.configs.footer.defaultText,
                                iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : null
                            })
                            .setTimestamp()
                    ],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('language')
                                .setPlaceholder('Choose your langauge')
                                .setMaxValues(1)
                                .addOptions([
                                    { label: 'Deutsch', emoji: '🇩🇪', value: 'de_de' },
                                    { label: 'English (US)', emoji: '🇺🇸', value: 'en_us' }
                                ])
                        ),
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setURL(`${client.configs.general.supportServerInviteUrl}`)
                                .setStyle(ButtonStyle.Link)
                                .setLabel('Support Server')
                        )
                    ]
                });

                dataGuildSettings.addedById = logs.executor.id;
                dataGuildSettings.setupMessageId = messageId.id;

                await dataGuildSettings.save();
            } catch (err) {
                client.out.alert('Error while sending DM to user', this.name, err);
            }
        }

        // Creating Forum Post & Logs

        const forum = client.channels.cache.get(client.configs.logs.guildsForumChannelId);

        if (!forum) client.out.alert(`Forum can't be found!`, this.name);

        let webhookGuilds = null;

        const forumChannelGuilds = client.channels.cache.get(client.configs.logs.guildsForumChannelId);

        if (!forumChannelGuilds) return client.out.alert('No forumChannelGuilds found', this.name);

        const webhooksGuildss = await forumChannelGuilds.fetchWebhooks();

        if (webhooksGuildss.find((x) => x.name == 'Join')) {
            webhookGuilds = new WebhookClient({ url: webhooksGuildss.find((x) => x.name == 'Join').url });
        } else {
            webhookGuilds = await forumChannelGuilds.createWebhook({
                name: 'Join',
                avatar: avatar.join
            });
        }

        if (forum) {
            const category = client.channels.cache.get(client.configs.logs.categoryId);

            if (category) {
                category.edit({ name: `${client.user.username} [Bot - ${client.guilds.cache.size} Guilds]` });
            } else {
                client.out.alert(`Category can't be found!`, this.name);
            }

            let thread = null;

            if (forum.threads.cache.find((x) => x.name.includes(guild.id))) {
                const x = forum.threads.cache.find((x) => x.name.includes(guild.id));

                thread = x;

                webhookGuilds.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(join)
                            .setDescription(
                                `> Joined again **${guild.name}** (||${guild.id}||) [${guild.memberCount} - <t:${parseInt(
                                    guild.createdTimestamp
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

                thread.setAppliedTags([client.configs.logs.onGuildTagId]);
            } else {
                thread = await forum.threads.create({
                    name: `${guild.id} - ${guild.name}`,
                    message: {
                        embeds: [
                            new EmbedBuilder()
                                .setColor(join)
                                .setThumbnail(guild.iconURL())
                                .setDescription(
                                    `> Joined **${guild.name}**\n\n> __**Informations**__\n→ Name: **${guild.name}**\n→ Id: **${
                                        guild.id
                                    }**\n→ MemberCount: **${guild.memberCount}**\n→ Owner: **${
                                        client.users.cache.get(guild.ownerId).tag
                                    }** (||${client.users.cache.get(guild.ownerId).id}||)\n→ AddeyBy: **${
                                        logs?.executor?.tag || 'unknow'
                                    }** (||${logs?.executor?.id || 'unknow'}||)\n→ Permissions: \`\`\`${guild.members.me.permissions
                                        .toArray()
                                        .join(` `)}\`\`\``
                                )
                                .addFields({ name: 'Total Guilds', value: `${client.guilds.cache.size}`, inline: true })
                                .setFooter({
                                    text: client.configs.footer.defaultText,
                                    iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : null
                                })
                                .setTimestamp()
                        ],
                        files: [new AttachmentBuilder(guild.iconURL(), { name: 'guildicon.png' })]
                    },
                    appliedTags: [`${client.configs.logs.onGuildTagId}`]
                });

                webhookGuilds.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(join)
                            .setDescription(
                                `> Joined again **${guild.name}** (||${guild.id}||) [${guild.memberCount} - <t:${parseInt(
                                    guild.createdTimestamp
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

            dataGuildSettings.threadId = thread.id;

            dataGuildSettings.save();
        }

        // LOG CHANNEL

        const forumChannel = client.channels.cache.get(client.configs.logs.otherForumChannelId);

        if (!forumChannel) return client.out.alert('No forumChannel found', this.name);

        const webhooks = await forumChannel.fetchWebhooks();

        let webhook = null;

        if (webhooks.find((x) => x.name == 'Join')) {
            webhook = new WebhookClient({ url: webhooks.find((x) => x.name == 'Join').url });
        } else {
            webhook = await forumChannel.createWebhook({ name: 'Join', avatar: avatar.join });
        }

        webhook
            .send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(join)
                        .setThumbnail(guild.iconURL())
                        .setDescription(
                            `> Joined **${guild.name}**\n\n> __**Informations**__\n→ Name: **${guild.name}**\n→ Id: **${
                                guild.id
                            }**\n→ MemberCount: **${guild.memberCount}**\n→ Owner: **${client.users.cache.get(guild.ownerId).tag}** (||${
                                client.users.cache.get(guild.ownerId).id
                            }||)\n→ AddeyBy: **${logs?.executor?.tag || 'unknow'}** (||${
                                logs?.executor?.id || 'unknow'
                            }||)\n→ Permissions: \`\`\`${guild.members.me.permissions.toArray().join(` `)}\`\`\``
                        )
                        .addFields({ name: 'Total Guilds', value: `${client.guilds.cache.size}`, inline: true })
                        .setFooter({
                            text: client.configs.footer.defaultText,
                            iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : null
                        })
                        .setTimestamp()
                ],
                threadId: client.configs.logs.guildLogThreadId
            })
            .catch((err) => {
                client.out.alert('Failed sending guildJoin Log into log channel', this.name);
            });

        // STATS
        let d = new Date();
        d.setHours(0, 0, 0, 0);

        let dataGuildCountStats = null;

        dataGuildCountStats = await guildCountStats.findOne({ date: d });

        if (!dataGuildCountStats) {
            dataGuildCountStats = await guildCountStats.create({
                date: d,
                joined: [{ name: guild.name, id: guild.id, timestamp: Date.now() }],
                left: []
            });
        } else {
            await guildCountStats.findOneAndUpdate(
                { date: d },
                { $push: { joined: { name: guild.name, id: guild.id, timestamp: Date.now() } } }
            );
        }
    }
};
