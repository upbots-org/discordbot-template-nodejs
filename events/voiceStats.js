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
const { VoiceState, Client, ChannelType } = require('discord.js');

const ChannelVoiceStats = require('../models/stats/ChannelVoiceStats');
const GlobalVoiceStats = require('../models/stats/GlobalVoiceStats');
const GuildVoiceStats = require('../models/stats/GuildVoiceStats');

// https://www.w3schools.com/js/js_strict.asp

/**********************************************************************/

/**
 * @author LuciferMorningstarDev
 * @since 1.0.0
 */

module.exports = {
    name: 'voiceStateUpdate',
    /**
     *
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     * @param {Client} client
     */
    async execute(oldState, newState, client) {
        if (oldState?.channel && !newState?.channel) {
            let d = new Date();
            d.setHours(0, 0, 0, 0);

            // UPDATE DB

            // ChannelVoiceStats

            let dataChannelVoiceStats;

            if (oldState?.channel?.type != ChannelType.DM && oldState?.channel?.type != ChannelType.GroupDM) {
                dataChannelVoiceStats = await ChannelVoiceStats.findOne({
                    date: d,
                    guildId: oldState.guild.id,
                    userId: oldState.member.id,
                    channelId: oldState.channel.id
                });

                if (dataChannelVoiceStats) {
                    dataChannelVoiceStats.time += client.voiceTimes.get(oldState.member.id) || 0;

                    dataChannelVoiceStats.save();
                } else {
                    dataChannelVoiceStats = await ChannelVoiceStats.create({
                        guildId: oldState.guild.id,
                        channelId: oldState.channel.id,
                        userId: oldState.member.id,
                        time: client.voiceTimes.get(oldState.member.id) || 0,
                        date: d
                    });
                }
            }

            // GlobalVoiceStats

            let dataGlobalVoiceStats;

            dataGlobalVoiceStats = await GlobalVoiceStats.findOne({
                date: d,
                userId: oldState.member.id
            });

            if (dataGlobalVoiceStats) {
                dataGlobalVoiceStats.time += client.voiceTimes.get(oldState.member.id) || 0;

                dataGlobalVoiceStats.save();
            } else {
                dataGlobalVoiceStats = await GlobalVoiceStats.create({
                    userId: oldState.member.id,
                    time: client.voiceTimes.get(oldState.member.id) || 0,
                    date: d
                });
            }

            // GuildVoiceStats

            let dataGuildVoiceStats = null;

            if (oldState?.guild) {
                dataGuildVoiceStats = await GuildVoiceStats.findOne({
                    date: d,
                    guildId: oldState.guild.id,
                    userId: oldState.member.id
                });

                if (dataGuildVoiceStats) {
                    dataGuildVoiceStats.time += client.voiceTimes.get(oldState.member.id) || 0;

                    dataGuildVoiceStats.save();
                } else {
                    dataGuildVoiceStats = await GuildVoiceStats.create({
                        guildId: oldState.guild.id,
                        userId: oldState.member.id,
                        time: client.voiceTimes.get(oldState.member.id) || 0,
                        date: d
                    });
                }
            }

            client.voiceTimes.delete(oldState.member.id);
        } else if (!oldState.channel && newState.channel) {
            client.voiceTimes.set(newState.member.id, 0);
        }
    }
};
