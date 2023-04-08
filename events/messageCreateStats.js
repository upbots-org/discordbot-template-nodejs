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

// Declares constants (destructured) to be used in this file.

const { Client, Message, ChannelType } = require('discord.js');

const ChannelMessageStats = require('../models/stats/ChannelMessageStats');
const GlobalMessageStats = require('../models/stats/GlobalMessageStats');
const GuildMessageStats = require('../models/stats/GuildMessageStats');
const DmMessageStats = require('../models/stats/DmMessageStats');
const GroupDmMessageStats = require('../models/stats/GroupDmMessageStats');
// Prefix regex, we will use to match in mention prefix.

module.exports = {
    name: 'messageCreate',
    /**
     *
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {
        // Stats

        let d = new Date();
        d.setHours(0, 0, 0, 0);

        // DmMessageStats

        let dataDmMessageStats;

        if (message?.channel?.type == ChannelType.DM) {
            dataDmMessageStats = await DmMessageStats.findOne({
                date: d,
                userId: message.author.id,
                dmChannelId: message.channel.id
            });

            if (dataDmMessageStats) {
                dataDmMessageStats.messages += 1;

                dataDmMessageStats.save();
            } else {
                dataDmMessageStats = await DmMessageStats.create({
                    dmChannelId: message.channel.id,
                    userId: message.author.id,
                    messages: 1,
                    date: d
                });
            }
        }

        // GroupDmMessageStats

        let dataGroupDmMessageStats;

        if (message?.channel?.type == ChannelType.GroupDM) {
            dataGroupDmMessageStats = await GroupDmMessageStats.findOne({
                date: d,
                userId: message.author.id,
                groupDmChannelId: message.channel.id
            });

            if (dataGroupDmMessageStats) {
                dataGroupDmMessageStats.messages += 1;

                dataGroupDmMessageStats.save();
            } else {
                dataGroupDmMessageStats = await GroupDmMessageStats.create({
                    groupDmChannelId: message.channel.id,
                    userId: message.author.id,
                    messages: 1,
                    date: d
                });
            }
        }

        // ChannelMessageStats

        let dataChannelMessageStats;

        if (message?.channel?.type != ChannelType.DM && message?.channel?.type != ChannelType.GroupDM) {
            dataChannelMessageStats = await ChannelMessageStats.findOne({
                date: d,
                guildId: message.guild.id,
                userId: message.author.id,
                channelId: message.channel.id
            });

            if (dataChannelMessageStats) {
                dataChannelMessageStats.messages += 1;

                dataChannelMessageStats.save();
            } else {
                dataChannelMessageStats = await ChannelMessageStats.create({
                    guildId: message.guild.id,
                    channelId: message.channel.id,
                    userId: message.author.id,
                    messages: 1,
                    date: d
                });
            }
        }

        // GlobalMessageStats

        let dataGlobalMessageStats;

        dataGlobalMessageStats = await GlobalMessageStats.findOne({
            date: d,
            userId: message.author.id
        });

        if (dataGlobalMessageStats) {
            dataGlobalMessageStats.messages += 1;

            dataGlobalMessageStats.save();
        } else {
            dataGlobalMessageStats = await GlobalMessageStats.create({
                userId: message.author.id,
                messages: 1,
                date: d
            });
        }

        // GuildMessageStats

        let dataGuildMessageStats = null;

        if (message?.guild) {
            dataGuildMessageStats = await GuildMessageStats.findOne({
                date: d,
                guildId: message.guild.id,
                userId: message.author.id
            });

            if (dataGuildMessageStats) {
                dataGuildMessageStats.messages += 1;

                dataGuildMessageStats.save();
            } else {
                dataGuildMessageStats = await GuildMessageStats.create({
                    guildId: message.guild.id,
                    userId: message.author.id,
                    messages: 1,
                    date: d
                });
            }
        }
    }
};
