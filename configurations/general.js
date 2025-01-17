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

// This module exports a configuration object for a Discord bot
// messageCommandPrefix     - is the prefix used to indicate that a message is a command
// defaultLanguage          - is the default language used by the bot for translations
// testGuildId              - is the ID of the guild used for testing purposes
// clientId                 - is the ID of the bot client used for authentication and authorization
// owner                    - is the ID of the bot owner
module.exports = {
    prefix: '!',
    defaultLanguage: 'en_us',
    testGuildId: '930837601341022268',
    clientId: '1091664896749473903',
    owner: '801860642402467850',
    supportServerInviteUrl: 'https://discord.gg/WJjzEPXQTF',
    inviteUrl: 'https://discord.com/oauth2/authorize?client_id=1030248474937131018&permissions=805685441&scope=applications.commands%20bot'
};
