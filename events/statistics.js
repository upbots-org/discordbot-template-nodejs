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
const { Client, EmbedBuilder, WebhookClient } = require('discord.js');
const cron = require('node-cron');
const pms = require('pretty-ms');
// REQUIRE STATS

const mongoose = require('mongoose');

const {
    GlobalButtonStats,
    GlobalCommandStats,
    GlobalMessageContextStats,
    GlobalMessageStats,
    GlobalModalStats,
    GlobalSelectStats,
    GlobalSlashStats,
    GlobalTriggerStats,
    GlobalUserContextStats,
    GlobalVoiceStats,
    GuildCountStats
} = mongoose.models;

// https://www.w3schools.com/js/js_strict.asp

/**********************************************************************/

/**
 * @author LuciferMorningstarDev
 * @since 1.0.0
 */

module.exports = {
    name: 'ready',
    /**
     *
     * @param {Client} client
     */
    async execute(client) {
        client.out.debug('Started stats listener..');

        // 50 23 * * * => 23:50
        // * * * * * => every minute (testing)

        cron.schedule(
            '50 23 * * *',
            async () => {
                client.out.info(`Sending stats..`);

                const forumChannel = client.channels.cache.get(client.configs.logs.otherForumChannelId);

                if (!forumChannel) return client.out.alert('No forumChannel found', this.name);

                const webhooks = await forumChannel.fetchWebhooks();

                let webhook = null;

                if (webhooks.find((x) => x.name == 'Statistics')) {
                    webhook = new WebhookClient({ url: webhooks.find((x) => x.name == 'Statistics').url });
                } else {
                    webhook = await forumChannel.createWebhook({ name: 'Statistics' }).catch((err) => {
                        console.log(err);
                    });
                }

                let d = new Date();
                d.setHours(0, 0, 0, 0);

                // Buttons

                const dataGlobalButtonStats = await GlobalButtonStats.find({ date: d });

                const totalButtons = dataGlobalButtonStats.reduce((a, b) => {
                    const buttonsCount = b.buttons.reduce((a2, b2) => {
                        return a2 + b2.count;
                    }, 0);
                    return a + buttonsCount;
                }, 0);

                // Commands

                const dataGlobalCommandStats = await GlobalCommandStats.find({ date: d });

                const totalCommands = dataGlobalCommandStats.reduce((a, b) => {
                    const commandsCount = b.commands.reduce((a2, b2) => {
                        return a2 + b2.count;
                    }, 0);
                    return a + commandsCount;
                }, 0);

                // MessageContext

                const dataGlobalMessageContextStats = await GlobalMessageContextStats.find({ date: d });

                const totalMessageContexts = dataGlobalMessageContextStats.reduce((a, b) => {
                    const messagecontextsCount = b.messagecontexts.reduce((a2, b2) => {
                        return a2 + b2.count;
                    }, 0);
                    return a + messagecontextsCount;
                }, 0);

                // Message

                const dataGlobalMessageStats = await GlobalMessageStats.find({ date: d });

                const totalMessages = dataGlobalMessageStats.reduce((a, b) => {
                    const messagesCount = b.messages;
                    return a + messagesCount;
                }, 0);

                // Modal

                const dataGlobalModalStats = await GlobalModalStats.find({ date: d });

                const totalModals = dataGlobalModalStats.reduce((a, b) => {
                    const modalsCount = b.modals.reduce((a2, b2) => {
                        return a2 + b2.count;
                    }, 0);
                    return a + modalsCount;
                }, 0);

                // Select

                const dataGlobalSelectStats = await GlobalSelectStats.find({ date: d });

                const totalSelects = dataGlobalSelectStats.reduce((a, b) => {
                    const selectsCount = b.selects.reduce((a2, b2) => {
                        return a2 + b2.count;
                    }, 0);
                    return a + selectsCount;
                }, 0);

                // Slash

                const dataGlobalSlashStats = await GlobalSlashStats.find({ date: d });

                const totalSlash = dataGlobalSlashStats.reduce((a, b) => {
                    const slashCommandsCount = b.slashCommands.reduce((a2, b2) => {
                        return a2 + b2.count;
                    }, 0);
                    return a + slashCommandsCount;
                }, 0);

                // Trigger

                const dataGlobalTriggerStats = await GlobalTriggerStats.find({ date: d });

                const totalTriggers = dataGlobalTriggerStats.reduce((a, b) => {
                    const triggersCount = b.triggers.reduce((a2, b2) => {
                        return a2 + b2.count;
                    }, 0);
                    return a + triggersCount;
                }, 0);

                // UserContext

                const dataGlobalUserContextStats = await GlobalUserContextStats.find({ date: d });

                const totalUserContexts = dataGlobalUserContextStats.reduce((a, b) => {
                    const usercontextsCount = b.usercontexts.reduce((a2, b2) => {
                        return a2 + b2.count;
                    }, 0);
                    return a + usercontextsCount;
                }, 0);

                // Voice

                const dataVoiceStats = await GlobalVoiceStats.find({ date: d });

                const totalVoice = dataVoiceStats.reduce((a, b) => {
                    const voiceTime = b.time;
                    return a + voiceTime;
                }, 0);

                // Guilds

                const dataGuildsCountStats = await GuildCountStats.findOne({ date: d }).sort({ 'joined.membercount': 1 });

                let joins = 0;
                let leaves = 0;
                let joinMap = '-';
                let leftMap = '-';

                if (dataGuildsCountStats) {
                    joins = dataGuildsCountStats.joined.length;
                    leaves = dataGuildsCountStats.left.length;

                    if (joins != 0)
                        joinMap = dataGuildsCountStats.joined
                            .sort((a, b) => b.membercount - a.membercount)
                            .slice(0, 10)
                            .map((x) => {
                                return `${client.guilds.cache.get(x.id) ? client.guilds.cache.get(x.id).name : `${x.name} (✟)`} - ${
                                    x.id
                                } - ${client.guilds.cache.get(x.id) ? client.guilds.cache.get(x.id).memberCount : `${x.membercount}`}`;
                            })
                            .join('\n');

                    if (leaves != 0) {
                        leftMap = dataGuildsCountStats.left
                            .sort((a, b) => b.membercount - a.membercount)
                            .slice(0, 10)
                            .map((x) => {
                                return `${client.guilds.cache.get(x.id) ? client.guilds.cache.get(x.id).name : `${x.name} (✟)`} - ${
                                    x.id
                                } - ${client.guilds.cache.get(x.id) ? client.guilds.cache.get(x.id).memberCount : `${x.membercount}`}`;
                            })
                            .join('\n');
                    }
                }

                webhook.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.configs.colors.default)
                            .setTitle(`> **__Statistics [ ${d.toDateString()} ]__**`)
                            .setDescription(
                                `> __**Interactions**__\n→ Buttons: **${totalButtons}**\n→ MessageContexts: **${totalMessageContexts}**\n→ UserContexts: **${totalUserContexts}**\n→ Modals: **${totalModals}**\n→ Selects: **${totalSelects}**\n→ SlashCommands: **${totalSlash}**\n\n> **__Other__**\n→ Commands: **${totalCommands}**\n→ Triggers: **${totalTriggers}**\n→ Messages: **${totalMessages}**\n→ Voice: **${pms(
                                    totalVoice
                                )}**\n\n> __**Guilds**__\n→ Joined: **${joins}**\n→ Left: **${leaves}**\n→ Difference: **${
                                    joins - leaves
                                }**\n→ Total: **${
                                    client.guilds.cache.size
                                }**\n\n→ Joins: \`\`\`${joinMap}\`\`\`\n→ Leaves: \`\`\`${leftMap}\`\`\`\n\n*→ (✟) = can't get guild*`
                            )
                            .setThumbnail(client.user.displayAvatarURL())
                            .setFooter({
                                text: client.configs.footer.defaultText,
                                iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : ''
                            })
                            .setTimestamp()
                    ],
                    threadId: client.configs.logs.statsThreadId
                });
            },
            { scheduled: true, timezone: 'Europe/Berlin' }
        );
    }
};
