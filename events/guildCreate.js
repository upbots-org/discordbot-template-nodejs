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

const { Guild, Client, EmbedBuilder, WebhookClient } = require('discord.js');

module.exports = {
    name: 'guildCreate',
    /**
     *
     * @param {Guild} guild
     * @param {Client} client
     */
    async execute(guild, client) {
        client.out.debug(`Joined a new guild [Members ${guild.memberCount} | Total Guilds ${client.guilds.cache.size}]`);

        const guildSettings = require('../models/guilds/GuildSettings');

        let dataGuildSettings = null;

        dataGuildSettings = await guildSettings.findOne({ id: guild.id });

        if (dataGuildSettings) {
            await guildSettings.findOneAndDelete({ id: guild.id });
        }

        await guildSettings.create({
            id: guild.id,
            announcementWebhookUrl: null,
            threadId: null,
            language: 'en_us'
        });

        dataGuildSettings = await guildSettings.findOne({ id: guild.id });

        const forum = client.channels.cache.get(client.configs.logs.guildsForumChannelId);

        if (!forum) client.out.alert(`Forum can't be found!`, this.name);

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

                x.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(`> Joined again **${guild.name}**`)
                            .setFooter({
                                text: client.configs.footer.defaultText,
                                iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : null
                            })
                            .setTimestamp()
                    ]
                });
            } else {
                thread = await forum.threads.create({
                    name: `${guild.id} - ${guild.name}`,
                    message: {
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.configs.colors.default)
                                .setDescription(`> Informations about **${guild.name}**`)
                                .setFooter({
                                    text: client.configs.footer.defaultText,
                                    iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : null
                                })
                                .setTimestamp()
                        ]
                    }
                });

                thread.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(`> Joined **${guild.name}**`)
                            .setFooter({
                                text: client.configs.footer.defaultText,
                                iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : null
                            })
                            .setTimestamp()
                    ]
                });
            }

            dataGuildSettings.threadId = thread.id;

            dataGuildSettings.save();
        }

        // LOG CHANNEL

        const webhook = new WebhookClient({ url: '' });

        webhook.send({ embeds: [], threadId: client.configs.logs.guildLogThreadId });
    }
};
