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

const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const GuildCountStatsSchema = new Schema(
    {
        joined: {
            type: Object,
            name: { type: String, default: null },
            id: { type: String, default: null },
            membercount: { type: Number, default: null },
            timestamp: { type: String, default: null },
            default: null
        },
        left: {
            type: Object,
            name: { type: String, default: null },
            id: { type: String, default: null },
            membercount: { type: Number, default: null },
            timestamp: { type: String, default: null },
            default: null
        },
        date: { type: Date, required: true }
    },
    { timestamps: true, collection: 'guild_count_stats' }
);

module.exports = mongoose.models.GuildCountStats || model('GuildCountStats', GuildCountStatsSchema);
