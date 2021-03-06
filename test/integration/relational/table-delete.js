'use strict';

/* eslint-env node, mocha */

const expect = require('chai').expect;
const fixtures = require('test/integration/fixtures');

describe('@slow relational table delete', () => {
    let session, schema, table;

    beforeEach('set context', () => {
        return fixtures.setup().then(suite => {
            // TODO(rui.quelhas): use ES6 destructuring assignment for node >=6.0.0
            session = suite.session;
            schema = suite.schema;
        });
    });

    beforeEach('create table', () => {
        return schema
            .createTable('test')
            .addColumn(schema.columnDef('col1', schema.Type.Varchar, 255))
            .addColumn(schema.columnDef('col2', schema.Type.Int))
            .execute();
    });

    beforeEach('update context', () => {
        table = schema.getTable('test');
    });

    afterEach('clear context', () => {
        return fixtures.teardown(session);
    });

    context('with limit', () => {
        beforeEach('add fixtures', () => {
            return schema
                .getTable('test')
                .insert(['col1', 'col2'])
                .values(['foo', 42])
                .values(['bar', 23])
                .values(['baz', 42])
                .execute();
        });

        it('should delete a given number of rows', () => {
            const expected = [['baz', 42]];
            let actual = [];

            return table
                .delete()
                .limit(2)
                .execute()
                .then(() => table.select().execute(doc => actual.push(doc)))
                .then(() => expect(actual).to.deep.equal(expected));
        });
    });
});
