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

const {
    ContextMenuCommandBuilder,
    UserContextMenuCommandInteraction,
    Client,
    ButtonBuilder,
    EmbedBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ApplicationCommandType
} = require('discord.js');

// require configs

const color = require('../../../configurations/colors');
const icon = require('../../../configurations/icons');
const general = require('../../../configurations/general');

// require models

const guildSettings = require('../../../models/guilds/GuildSettings');

// https://www.w3schools.com/js/js_strict.asp

/**********************************************************************/

/**
 * @author LuciferMorningstarDev
 * @since 1.0.0
 */

module.exports = {
    data: new ContextMenuCommandBuilder().setName('sample').setType(ApplicationCommandType.User),
    /**
     *
     * @param {UserContextMenuCommandInteraction} interaction
     * @param {Client} client
     * @returns
     */
    async execute(interaction, client) {
        return new Promise(async (resolve, reject) => {
            try {
                // defering interaction

                await interaction.deferReply({ ephemeral: true });

                // default embed

                const embed = new EmbedBuilder()
                    .setFooter({
                        text: client.configs.footer.defaultText,
                        iconURL: client.configs.footer.displayIcon ? client.configs.footer.defaultIcon : null
                    })
                    .setTimestamp();

                // check guildsettings

                const dataGuildSettings = await guildSettings.findOne({ id: interaction.guild.id });
                if (!dataGuildSettings) {
                    return interaction.editReply({
                        embeds: [
                            embed
                                .setColor(color.error)
                                .setDescription(
                                    `${client.translations[client.configs.general.defaultLanguage].default.no_guild_settings_description}`
                                )
                        ],
                        components: [
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setURL(general.supportServerInviteUrl)
                                    .setLabel(
                                        client.translations[client.configs.general.defaultLanguage].default.no_guild_settings_button_label
                                    )
                                    .setStyle(ButtonStyle.Link)
                            )
                        ]
                    });
                }

                const translate = client.translations[dataGuildSettings.language];

                // start coding

                resolve(true);
            } catch (error) {
                client.out.error('&fError in &6' + __dirname + '&f/&9' + this.data.id + ' &fMESSAGE ContextInteraction &c', error);
                reject(error);
            }
        });
    }
};
