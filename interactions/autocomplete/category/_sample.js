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

// require packages

const { AutocompleteInteraction, Client } = require('discord.js');

// require configs

const color = require('../../../configurations/colors');
const icon = require('../../../configurations/icons');
const footer = require('../../../configurations/footer');

// require models

const guildSettings = require('../../../models/guilds/GuildSettings');

// https://www.w3schools.com/js/js_strict.asp

/**********************************************************************/

/**
 * @author LuciferMorningstarDev
 * @since 1.0.0
 */

module.exports = {
    id: 'sample',
    /**
     *
     * @param {AutocompleteInteraction} interaction
     * @param {Client} client
     * @returns
     */
    async execute(interaction, client) {
        return new Promise(async (resolve, reject) => {
            try {
                const dataGuildSettings = await guildSettings.findOne({ id: interaction.guild.id });
                if (!dataGuildSettings) {
                    return;
                }

                // Sample

                const focusedOption = interaction.options.getFocused(true);

                if (!focusedOption?.name) return resolve(true);

                let choices;

                if (focusedOption.name === 'sample') {
                    choices = [
                        'Popular Topics: Threads',
                        'Sharding: Getting started',
                        'Library: Voice Connections',
                        'Interactions: Replying to slash commands',
                        'Popular Topics: Embed preview'
                    ];
                }

                const filtered = choices.filter((choice) => choice.startsWith(focusedOption.value));
                await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));

                resolve(true);
            } catch (error) {
                client.out.error('&fError in &6' + __dirname + '&f/&9' + this.id + ' &fAutocompleteInteraction &c', error);
                reject(error);
            }
        });
    }
};
