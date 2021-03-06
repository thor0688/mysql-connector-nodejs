/*
 * Copyright (c) 2015, 2016, Oracle and/or its affiliates. All rights reserved.
 *
 * MySQL Connector/Node.js is licensed under the terms of the GPLv2
 * <http://www.gnu.org/licenses/old-licenses/gpl-2.0.html>, like most
 * MySQL Connectors. There are special exceptions to the terms and
 * conditions of the GPLv2 as it is applied to this software, see the
 * FLOSS License Exception
 * <http://www.mysql.com/about/legal/licensing/foss-exception.html>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; version 2 of the
 * License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

'use strict';

const BaseQuery = require('./BaseQuery');
const Client = require('../Protocol/Client');
const Result = require('./Result');
const util = require('util');

/**
 *
 * @param {XSession} session
 * @param {Schema} schema
 * @param {Table} table
 * @param {String} expression
 * @constructor
 */
function TableDelete (session, schema, table, expr) {
    BaseQuery.call(this);

    this._session = session;
    this._schema = schema;
    this._table = table;
    this._expr = expr;
    this._bounds = {};
}

util.inherits(TableDelete, BaseQuery);

module.exports = TableDelete;

TableDelete.prototype.bind = function (bind) {
    Object.assign(this._bounds, bind);
    return this;
};

/**
 * Execute delete operation
 * @return {Promise.<Result>}
 */
TableDelete.prototype.execute = function () {
    return this
        ._session
        ._client
        .crudRemove(this._session, this._schema.getName(), this._table, Client.dataModel.TABLE, this._expr, this._limit).then(state => new Result(state), this._bounds);
};
