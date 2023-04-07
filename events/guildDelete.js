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
        const GuildSettings = require('../models/guilds/GuildSettings');

        let dataGuildSettings = null;

        dataGuildSettings = await GuildSettings.findOne({ id: guild.id });

        if (!dataGuildSettings) return client.out.alert(`No data found while leaving guild with id ${guild.id}`);
        // Send LeaveLog in guildpost

        const forum = client.channels.cache.get(client.configs.logs.guildsForumChannelId);

        let thread = null;

        if (forum) {
            if (forum.threads.cache.find((x) => x.id === dataGuildSettings.threadId)) {
                thread = forum.threads.cache.find((x) => x.id === dataGuildSettings.threadId);

                thread.setAppliedTags([client.configs.logs.offGuildTagId]);

                thread.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.configs.colors.leave)
                            .setDescription(`> Left **${guild.name}**`)
                            .setFooter({
                                text: client.configs.footer.defaultText,
                                iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : null
                            })
                            .setTimestamp()
                    ]
                });
            }
        }

        // Send LeaveLog in other logs

        const webhook = new WebhookClient({ url: client.configs.logs.otherWebhookUrl });

        await webhook.edit({ name: 'LEAVE', avatar: client.configs.avatars.leave });

        webhook.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.configs.colors.leave)
                    .setDescription(`> Left **${guild.name}** (||${guild.id}||)`)
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
    }
};
