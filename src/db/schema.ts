import { mysqlTable, index, primaryKey, int, float, datetime, varchar, tinyint } from "drizzle-orm/mysql-core"

export const tBin = mysqlTable("t_bin", {
	id: int("ID").notNull(),
	locationX: float("Location_X").notNull(),
	locationY: float("Location_Y").notNull(),
	status: int("Status").notNull(),
	lastServiceTime: datetime("LastServiceTime", { mode: 'string'}).notNull(),
	lastFullTime: datetime("LastFullTime", { mode: 'string'}).notNull(),
	category: int("Category").notNull(),
	description: varchar("Description", { length: 128 }),
	lastDisconnectedTime: datetime("LastDisconnectedTime", { mode: 'string'}).notNull(),
	active: tinyint("Active").notNull(),
},
(table) => [
	index("IX_STATUS").on(table.status),
	index("IX_Category").on(table.category),
	primaryKey({ columns: [table.id], name: "t_bin_ID"}),
]);
