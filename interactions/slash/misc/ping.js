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

const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/**
 * @author LuciferMorningstarDev
 * @since 1.0.0
 */
module.exports = {
    // The data needed to register slash commands to Discord.
    data: new SlashCommandBuilder().setName('sample').setDescription('Just a Sample Command.'),

    async execute(interaction, client) {
        return new Promise(async (resolve, reject) => {
            try {
                interaction.reply({
                    content: 'Hi!',
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId('hi').setLabel('Hey').setStyle(ButtonStyle.Primary)
                        )
                    ]
                });

                resolve(true);
            } catch (error) {
                client.out.error('&fError in &6' + __dirname + '&f/&9' + this.data.name + ' &fSlashCommand &c', error);
                reject(error);
            }
        });
    }
};