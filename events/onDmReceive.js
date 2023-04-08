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
const { Client, Message, ChannelType, WebhookClient, EmbedBuilder } = require('discord.js');

// https://www.w3schools.com/js/js_strict.asp

/**********************************************************************/

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
     */
    async execute(message, client) {
        const logs = require('../configurations/logs');
        const color = require('../configurations/colors');
        const avatar = require('../configurations/avatars');

        if (message.channel.type == ChannelType.DM || message.channel.type == ChannelType.GroupDM) {
            const forumChannel = client.channels.cache.get(client.configs.logs.otherForumChannelId);

            if (!forumChannel) return client.out.alert('No forumChannel found', this.name);

            const webhooks = await forumChannel.fetchWebhooks();

            let webhook = null;

            if (webhooks.find((x) => x.name == 'DM')) {
                webhook = new WebhookClient({ url: webhooks.find((x) => x.name == 'DM').url });
            } else {
                webhook = await forumChannel.createWebhook({ name: 'DM', avatar: avatar.dm });
            }

            webhook.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color.default)
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                        .setDescription(`**Content:**\`\`\`${message.content.slice(0, 4000)}\`\`\``)
                        .setFooter({
                            text: client.configs.footer.defaultText,
                            iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : null
                        })
                        .setTimestamp()
                ],
                threadId: logs.dmLogThreadId
            });
        }
    }
};
