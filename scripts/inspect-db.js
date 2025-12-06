import db from '../lib/db.js';

function listTables() {
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
    return tables.map(t => t.name);
}

function dumpTable(name) {
    const rows = db.prepare(`SELECT * FROM ${name} LIMIT 20`).all();
    return rows;
}

function main() {
    const tables = listTables();
    console.log('Tables in database:');
    console.log(tables.join(', '));
    console.log('\n--- Sample data ---');
    tables.forEach(name => {
        console.log(`\n${name}:`);
        const rows = dumpTable(name);
        console.dir(rows, { depth: null });
    });
}

main();
