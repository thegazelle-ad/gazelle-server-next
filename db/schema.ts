import { mysqlTable, mysqlSchema, AnyMySqlColumn, index, uniqueIndex, varchar, longtext, datetime, tinyint, char, timestamp, text, int, bigint, date } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm/sql"

export const articleIllustrations = mysqlTable("article_illustrations", {
	id: int("id").autoincrement().primaryKey().notNull(),
	articleId: int("article_id").notNull(),
	staffId: int("staff_id").notNull(),
},
	(table) => {
		return {
			idxArticleId: index("idx_article_id").on(table.articleId),
			idxStaffId: index("idx_staff_id").on(table.staffId),
		}
});

export const articlesAudio = mysqlTable("articles_audio", {
	id: int("id").autoincrement().primaryKey().notNull(),
	articleId: int("article_id").notNull(),
	uri: varchar("uri", { length: 255 }).notNull(),
});

export const articles = mysqlTable("articles", {
	id: int("id").autoincrement().primaryKey().notNull(),
	slug: varchar("slug", { length: 255 }).notNull(),
	title: varchar("title", { length: 255 }).notNull(),
	markdown: longtext("markdown"),
	html: longtext("html"),
	imageUrl: varchar("image_url", { length: 255 }),
	teaser: varchar("teaser", { length: 255 }),
	views: int("views").default(0).notNull(),
	createdAt: datetime("created_at", { mode: 'string'}).notNull(),
	publishedAt: datetime("published_at", { mode: 'string'}),
	isInteractive: tinyint("is_interactive").default(0).notNull(),
	categoryId: int("category_id"),
},
(table) => {
	return {
		categoryIdForeign: index("articles_category_id_foreign").on(table.categoryId),
		slugUnique: uniqueIndex("articles_slug_unique").on(table.slug),
		markdown: index("markdown").on(table.markdown),
		title: index("title").on(table.title),
	}
});

export const articlesTags = mysqlTable("articles_tags", {
	id: int("id").autoincrement().primaryKey().notNull(),
	articleId: int("article_id").notNull(),
	tagId: int("tag_id").notNull(),
},
(table) => {
	return {
		postsTagsPostIdForeign: index("posts_tags_post_id_foreign").on(table.articleId),
		postsTagsTagIdForeign: index("posts_tags_tag_id_foreign").on(table.tagId),
	}
});

export const authorsArticles = mysqlTable("authors_articles", {
	id: int("id").autoincrement().primaryKey().notNull(),
	authorId: int("author_id").notNull(),
	articleId: int("article_id").notNull(),
},
(table) => {
	return {
		authorsPostsPostIdForeign: index("authors_posts_post_id_foreign").on(table.articleId),
		uniquenessIdx: index("uniqueness_index").on(table.authorId, table.articleId),
	}
});

export const categories = mysqlTable("categories", {
	id: int("id").autoincrement().primaryKey().notNull(),
	slug: varchar("slug", { length: 255 }).notNull(),
	name: varchar("name", { length: 255 }).notNull(),
},
(table) => {
	return {
		nameUnique: uniqueIndex("categories_name_unique").on(table.name),
		slugUnique: uniqueIndex("categories_slug_unique").on(table.slug),
	}
});

export const directusActivity = mysqlTable("directus_activity", {
	id: int("id").autoincrement().primaryKey().notNull(),
	action: varchar("action", { length: 45 }).notNull(),
	user: char("user", { length: 36 }),
	timestamp: timestamp("timestamp", { mode: 'string' }).defaultNow().notNull(),
	ip: varchar("ip", { length: 50 }),
	userAgent: varchar("user_agent", { length: 255 }),
	collection: varchar("collection", { length: 64 }).notNull(),
	item: varchar("item", { length: 255 }).notNull(),
	comment: text("comment"),
	origin: varchar("origin", { length: 255 }),
},
(table) => {
	return {
		collectionForeign: index("directus_activity_collection_foreign").on(table.collection),
	}
});

export const directusCollections = mysqlTable("directus_collections", {
	collection: varchar("collection", { length: 64 }).primaryKey().notNull(),
	icon: varchar("icon", { length: 30 }),
	note: text("note"),
	displayTemplate: varchar("display_template", { length: 255 }),
	hidden: tinyint("hidden").default(0).notNull(),
	singleton: tinyint("singleton").default(0).notNull(),
	translations: longtext("translations"),
	archiveField: varchar("archive_field", { length: 64 }),
	archiveAppFilter: tinyint("archive_app_filter").default(1).notNull(),
	archiveValue: varchar("archive_value", { length: 255 }),
	unarchiveValue: varchar("unarchive_value", { length: 255 }),
	sortField: varchar("sort_field", { length: 64 }),
	accountability: varchar("accountability", { length: 255 }).default('all'),
	color: varchar("color", { length: 255 }),
	itemDuplicationFields: longtext("item_duplication_fields"),
	sort: int("sort"),
	group: varchar("group", { length: 64 }),
	collapse: varchar("collapse", { length: 255 }).default('open').notNull(),
},
(table) => {
	return {
		groupForeign: index("directus_collections_group_foreign").on(table.group),
	}
});

export const directusDashboards = mysqlTable("directus_dashboards", {
	id: char("id", { length: 36 }).primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	icon: varchar("icon", { length: 30 }).default('dashboard').notNull(),
	note: text("note"),
	dateCreated: timestamp("date_created", { mode: 'string' }).defaultNow().notNull(),
	userCreated: char("user_created", { length: 36 }),
	color: varchar("color", { length: 255 }),
},
(table) => {
	return {
		userCreatedForeign: index("directus_dashboards_user_created_foreign").on(table.userCreated),
	}
});

export const directusFields = mysqlTable("directus_fields", {
	id: int("id").autoincrement().primaryKey().notNull(),
	collection: varchar("collection", { length: 64 }).notNull(),
	field: varchar("field", { length: 64 }).notNull(),
	special: varchar("special", { length: 64 }),
	interface: varchar("interface", { length: 64 }),
	options: longtext("options"),
	display: varchar("display", { length: 64 }),
	displayOptions: longtext("display_options"),
	readonly: tinyint("readonly").default(0).notNull(),
	hidden: tinyint("hidden").default(0).notNull(),
	sort: int("sort"),
	width: varchar("width", { length: 30 }).default('full'),
	translations: longtext("translations"),
	note: text("note"),
	conditions: longtext("conditions"),
	required: tinyint("required").default(0),
	group: varchar("group", { length: 64 }),
	validation: longtext("validation"),
	validationMessage: text("validation_message"),
},
(table) => {
	return {
		collectionForeign: index("directus_fields_collection_foreign").on(table.collection),
	}
});

export const directusFiles = mysqlTable("directus_files", {
	id: char("id", { length: 36 }).primaryKey().notNull(),
	storage: varchar("storage", { length: 255 }).notNull(),
	filenameDisk: varchar("filename_disk", { length: 255 }),
	filenameDownload: varchar("filename_download", { length: 255 }).notNull(),
	title: varchar("title", { length: 255 }),
	type: varchar("type", { length: 255 }),
	folder: char("folder", { length: 36 }),
	uploadedBy: char("uploaded_by", { length: 36 }),
	uploadedOn: timestamp("uploaded_on", { mode: 'string' }).defaultNow().notNull(),
	modifiedBy: char("modified_by", { length: 36 }),
	modifiedOn: timestamp("modified_on", { mode: 'string' }).defaultNow().notNull(),
	charset: varchar("charset", { length: 50 }),
	filesize: bigint("filesize", { mode: "number" }),
	width: int("width"),
	height: int("height"),
	duration: int("duration"),
	embed: varchar("embed", { length: 200 }),
	description: text("description"),
	location: text("location"),
	tags: text("tags"),
	metadata: longtext("metadata"),
},
(table) => {
	return {
		folderForeign: index("directus_files_folder_foreign").on(table.folder),
		modifiedByForeign: index("directus_files_modified_by_foreign").on(table.modifiedBy),
		uploadedByForeign: index("directus_files_uploaded_by_foreign").on(table.uploadedBy),
	}
});

export const directusFlows = mysqlTable("directus_flows", {
	id: char("id", { length: 36 }).primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	icon: varchar("icon", { length: 30 }),
	color: varchar("color", { length: 255 }),
	description: text("description"),
	status: varchar("status", { length: 255 }).default('active').notNull(),
	trigger: varchar("trigger", { length: 255 }),
	accountability: varchar("accountability", { length: 255 }).default('all'),
	options: longtext("options"),
	operation: char("operation", { length: 36 }),
	dateCreated: timestamp("date_created", { mode: 'string' }).defaultNow().notNull(),
	userCreated: char("user_created", { length: 36 }),
},
(table) => {
	return {
		operationUnique: uniqueIndex("directus_flows_operation_unique").on(table.operation),
		userCreatedForeign: index("directus_flows_user_created_foreign").on(table.userCreated),
	}
});

export const directusFolders = mysqlTable("directus_folders", {
	id: char("id", { length: 36 }).primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	parent: char("parent", { length: 36 }),
},
(table) => {
	return {
		parentForeign: index("directus_folders_parent_foreign").on(table.parent),
	}
});

export const directusMigrations = mysqlTable("directus_migrations", {
	version: varchar("version", { length: 255 }).primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	timestamp: timestamp("timestamp", { mode: 'string' }).defaultNow().notNull(),
});

export const directusNotifications = mysqlTable("directus_notifications", {
	id: int("id").autoincrement().primaryKey().notNull(),
	timestamp: timestamp("timestamp", { mode: 'string' }).defaultNow(),
	status: varchar("status", { length: 255 }).default('inbox'),
	recipient: char("recipient", { length: 36 }).notNull(),
	sender: char("sender", { length: 36 }),
	subject: varchar("subject", { length: 255 }).notNull(),
	message: text("message"),
	collection: varchar("collection", { length: 64 }),
	item: varchar("item", { length: 255 }),
},
(table) => {
	return {
		recipientForeign: index("directus_notifications_recipient_foreign").on(table.recipient),
		senderForeign: index("directus_notifications_sender_foreign").on(table.sender),
	}
});

export const directusOperations = mysqlTable("directus_operations", {
	id: char("id", { length: 36 }).primaryKey().notNull(),
	name: varchar("name", { length: 255 }),
	key: varchar("key", { length: 255 }).notNull(),
	type: varchar("type", { length: 255 }).notNull(),
	positionX: int("position_x").notNull(),
	positionY: int("position_y").notNull(),
	options: longtext("options"),
	resolve: char("resolve", { length: 36 }),
	reject: char("reject", { length: 36 }),
	flow: char("flow", { length: 36 }).notNull(),
	dateCreated: timestamp("date_created", { mode: 'string' }).defaultNow().notNull(),
	userCreated: char("user_created", { length: 36 }),
},
(table) => {
	return {
		flowForeign: index("directus_operations_flow_foreign").on(table.flow),
		rejectUnique: uniqueIndex("directus_operations_reject_unique").on(table.reject),
		resolveUnique: uniqueIndex("directus_operations_resolve_unique").on(table.resolve),
		userCreatedForeign: index("directus_operations_user_created_foreign").on(table.userCreated),
	}
});

export const directusPanels = mysqlTable("directus_panels", {
	id: char("id", { length: 36 }).primaryKey().notNull(),
	dashboard: char("dashboard", { length: 36 }).notNull(),
	name: varchar("name", { length: 255 }),
	icon: varchar("icon", { length: 30 }),
	color: varchar("color", { length: 10 }),
	showHeader: tinyint("show_header").default(0).notNull(),
	note: text("note"),
	type: varchar("type", { length: 255 }).notNull(),
	positionX: int("position_x").notNull(),
	positionY: int("position_y").notNull(),
	width: int("width").notNull(),
	height: int("height").notNull(),
	options: longtext("options"),
	dateCreated: timestamp("date_created", { mode: 'string' }).defaultNow().notNull(),
	userCreated: char("user_created", { length: 36 }),
},
(table) => {
	return {
		dashboardForeign: index("directus_panels_dashboard_foreign").on(table.dashboard),
		userCreatedForeign: index("directus_panels_user_created_foreign").on(table.userCreated),
	}
});

export const directusPermissions = mysqlTable("directus_permissions", {
	id: int("id").autoincrement().primaryKey().notNull(),
	role: char("role", { length: 36 }),
	collection: varchar("collection", { length: 64 }).notNull(),
	action: varchar("action", { length: 10 }).notNull(),
	permissions: longtext("permissions"),
	validation: longtext("validation"),
	presets: longtext("presets"),
	fields: text("fields"),
},
(table) => {
	return {
		collectionForeign: index("directus_permissions_collection_foreign").on(table.collection),
		roleForeign: index("directus_permissions_role_foreign").on(table.role),
	}
});

export const directusPresets = mysqlTable("directus_presets", {
	id: int("id").autoincrement().primaryKey().notNull(),
	bookmark: varchar("bookmark", { length: 255 }),
	user: char("user", { length: 36 }),
	role: char("role", { length: 36 }),
	collection: varchar("collection", { length: 64 }),
	search: varchar("search", { length: 100 }),
	layout: varchar("layout", { length: 100 }).default('tabular'),
	layoutQuery: longtext("layout_query"),
	layoutOptions: longtext("layout_options"),
	refreshInterval: int("refresh_interval"),
	filter: longtext("filter"),
	icon: varchar("icon", { length: 30 }).default('bookmark_outline').notNull(),
	color: varchar("color", { length: 255 }),
},
(table) => {
	return {
		collectionForeign: index("directus_presets_collection_foreign").on(table.collection),
		roleForeign: index("directus_presets_role_foreign").on(table.role),
		userForeign: index("directus_presets_user_foreign").on(table.user),
	}
});

export const directusRelations = mysqlTable("directus_relations", {
	id: int("id").autoincrement().primaryKey().notNull(),
	manyCollection: varchar("many_collection", { length: 64 }).notNull(),
	manyField: varchar("many_field", { length: 64 }).notNull(),
	oneCollection: varchar("one_collection", { length: 64 }),
	oneField: varchar("one_field", { length: 64 }),
	oneCollectionField: varchar("one_collection_field", { length: 64 }),
	oneAllowedCollections: text("one_allowed_collections"),
	junctionField: varchar("junction_field", { length: 64 }),
	sortField: varchar("sort_field", { length: 64 }),
	oneDeselectAction: varchar("one_deselect_action", { length: 255 }).default('nullify').notNull(),
},
(table) => {
	return {
		manyCollectionForeign: index("directus_relations_many_collection_foreign").on(table.manyCollection),
		oneCollectionForeign: index("directus_relations_one_collection_foreign").on(table.oneCollection),
	}
});

export const directusRevisions = mysqlTable("directus_revisions", {
	id: int("id").autoincrement().primaryKey().notNull(),
	activity: int("activity").notNull(),
	collection: varchar("collection", { length: 64 }).notNull(),
	item: varchar("item", { length: 255 }).notNull(),
	data: longtext("data"),
	delta: longtext("delta"),
	parent: int("parent"),
},
(table) => {
	return {
		activityForeign: index("directus_revisions_activity_foreign").on(table.activity),
		collectionForeign: index("directus_revisions_collection_foreign").on(table.collection),
		parentForeign: index("directus_revisions_parent_foreign").on(table.parent),
	}
});

export const directusRoles = mysqlTable("directus_roles", {
	id: char("id", { length: 36 }).primaryKey().notNull(),
	name: varchar("name", { length: 100 }).notNull(),
	icon: varchar("icon", { length: 30 }).default('supervised_user_circle').notNull(),
	description: text("description"),
	ipAccess: text("ip_access"),
	enforceTfa: tinyint("enforce_tfa").default(0).notNull(),
	adminAccess: tinyint("admin_access").default(0).notNull(),
	appAccess: tinyint("app_access").default(1).notNull(),
});

export const directusSessions = mysqlTable("directus_sessions", {
	token: varchar("token", { length: 64 }).primaryKey().notNull(),
	user: char("user", { length: 36 }),
	expires: timestamp("expires", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	ip: varchar("ip", { length: 255 }),
	userAgent: varchar("user_agent", { length: 255 }),
	share: char("share", { length: 36 }),
	origin: varchar("origin", { length: 255 }),
},
(table) => {
	return {
		shareForeign: index("directus_sessions_share_foreign").on(table.share),
		userForeign: index("directus_sessions_user_foreign").on(table.user),
	}
});

export const directusSettings = mysqlTable("directus_settings", {
	id: int("id").autoincrement().primaryKey().notNull(),
	projectName: varchar("project_name", { length: 100 }).default('Directus').notNull(),
	projectUrl: varchar("project_url", { length: 255 }),
	projectColor: varchar("project_color", { length: 50 }),
	projectLogo: char("project_logo", { length: 36 }),
	publicForeground: char("public_foreground", { length: 36 }),
	publicBackground: char("public_background", { length: 36 }),
	publicNote: text("public_note"),
	authLoginAttempts: int("auth_login_attempts").default(25),
	authPasswordPolicy: varchar("auth_password_policy", { length: 100 }),
	storageAssetTransform: varchar("storage_asset_transform", { length: 7 }).default('all'),
	storageAssetPresets: longtext("storage_asset_presets"),
	customCss: text("custom_css"),
	storageDefaultFolder: char("storage_default_folder", { length: 36 }),
	basemaps: longtext("basemaps"),
	mapboxKey: varchar("mapbox_key", { length: 255 }),
	moduleBar: longtext("module_bar"),
	projectDescriptor: varchar("project_descriptor", { length: 100 }),
	translationStrings: longtext("translation_strings"),
	defaultLanguage: varchar("default_language", { length: 255 }).default('en-US').notNull(),
	customAspectRatios: longtext("custom_aspect_ratios"),
},
(table) => {
	return {
		projectLogoForeign: index("directus_settings_project_logo_foreign").on(table.projectLogo),
		publicBackgroundForeign: index("directus_settings_public_background_foreign").on(table.publicBackground),
		publicForegroundForeign: index("directus_settings_public_foreground_foreign").on(table.publicForeground),
		storageDefaultFolderForeign: index("directus_settings_storage_default_folder_foreign").on(table.storageDefaultFolder),
	}
});

export const directusShares = mysqlTable("directus_shares", {
	id: char("id", { length: 36 }).primaryKey().notNull(),
	name: varchar("name", { length: 255 }),
	collection: varchar("collection", { length: 64 }),
	item: varchar("item", { length: 255 }),
	role: char("role", { length: 36 }),
	password: varchar("password", { length: 255 }),
	userCreated: char("user_created", { length: 36 }),
	dateCreated: timestamp("date_created", { mode: 'string' }).defaultNow().notNull(),
	dateStart: timestamp("date_start", { mode: 'string' }),
	dateEnd: timestamp("date_end", { mode: 'string' }),
	timesUsed: int("times_used").default(0),
	maxUses: int("max_uses"),
},
(table) => {
	return {
		collectionForeign: index("directus_shares_collection_foreign").on(table.collection),
		roleForeign: index("directus_shares_role_foreign").on(table.role),
		userCreatedForeign: index("directus_shares_user_created_foreign").on(table.userCreated),
	}
});

export const directusUsers = mysqlTable("directus_users", {
	id: char("id", { length: 36 }).primaryKey().notNull(),
	firstName: varchar("first_name", { length: 50 }),
	lastName: varchar("last_name", { length: 50 }),
	email: varchar("email", { length: 128 }),
	password: varchar("password", { length: 255 }),
	location: varchar("location", { length: 255 }),
	title: varchar("title", { length: 50 }),
	description: text("description"),
	tags: longtext("tags"),
	avatar: char("avatar", { length: 36 }),
	language: varchar("language", { length: 255 }),
	theme: varchar("theme", { length: 20 }).default('auto'),
	tfaSecret: varchar("tfa_secret", { length: 255 }),
	status: varchar("status", { length: 16 }).default('active').notNull(),
	role: char("role", { length: 36 }),
	token: varchar("token", { length: 255 }),
	lastAccess: timestamp("last_access", { mode: 'string' }).default('CURRENT_TIMESTAMP').notNull(),
	lastPage: varchar("last_page", { length: 255 }),
	provider: varchar("provider", { length: 128 }).default('default').notNull(),
	externalIdentifier: varchar("external_identifier", { length: 255 }),
	authData: longtext("auth_data"),
	emailNotifications: tinyint("email_notifications").default(1),
},
(table) => {
	return {
		emailUnique: uniqueIndex("directus_users_email_unique").on(table.email),
		externalIdentifierUnique: uniqueIndex("directus_users_external_identifier_unique").on(table.externalIdentifier),
		roleForeign: index("directus_users_role_foreign").on(table.role),
		tokenUnique: uniqueIndex("directus_users_token_unique").on(table.token),
	}
});

export const directusWebhooks = mysqlTable("directus_webhooks", {
	id: int("id").autoincrement().primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	method: varchar("method", { length: 10 }).default('POST').notNull(),
	url: varchar("url", { length: 255 }).notNull(),
	status: varchar("status", { length: 10 }).default('active').notNull(),
	data: tinyint("data").default(1).notNull(),
	actions: varchar("actions", { length: 100 }).notNull(),
	collections: varchar("collections", { length: 255 }).notNull(),
	headers: longtext("headers"),
});

export const infoPages = mysqlTable("info_pages", {
	id: int("id").autoincrement().primaryKey().notNull(),
	slug: varchar("slug", { length: 255 }).notNull(),
	title: varchar("title", { length: 255 }).notNull(),
	html: longtext("html").notNull(),
},
(table) => {
	return {
		slugUnique: uniqueIndex("info_pages_slug_unique").on(table.slug),
	}
});

export const interactiveMeta = mysqlTable("interactive_meta", {
	id: int("id").primaryKey().notNull(),
	html: longtext("html").notNull(),
	js: longtext("js"),
	css: longtext("css"),
});

export const issues = mysqlTable("issues", {
	id: int("id").autoincrement().primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	published_at: date("published_at", { mode: 'string' }),
	issueNumber: int("issue_number").notNull(),
},
(table) => {
	return {
		issueOrderUnique: uniqueIndex("issues_issue_order_unique").on(table.issueNumber),
	}
});

export const issuesArticlesOrder = mysqlTable("issues_articles_order", {
	id: int("id").autoincrement().primaryKey().notNull(),
	issueId: int("issue_id").notNull(),
	type: int("type").notNull(),
	articleId: int("article_id").notNull(),
	articleOrder: int("article_order").default(0).notNull(),
},
(table) => {
	return {
		issuesPostsOrderIssueIdForeign: index("issues_posts_order_issue_id_foreign").on(table.issueId),
		issuesPostsOrderPostIdForeign: index("issues_posts_order_post_id_foreign").on(table.articleId),
	}
});

export const issuesCategoriesOrder = mysqlTable("issues_categories_order", {
	id: int("id").autoincrement().primaryKey().notNull(),
	issueId: int("issue_id").notNull(),
	categoryId: int("category_id").notNull(),
	categoriesOrder: int("categories_order").default(0).notNull(),
},
(table) => {
	return {
		categoryIdForeign: index("issues_categories_order_category_id_foreign").on(table.categoryId),
		uniquenessIdx: index("uniqueness_index").on(table.issueId, table.categoryId, table.categoriesOrder),
	}
});

export const semesters = mysqlTable("semesters", {
	id: int("id").autoincrement().primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	date: date("date", { mode: 'string' }).notNull(),
},
(table) => {
	return {
		dateUnique: uniqueIndex("semesters_date_unique").on(table.date),
		nameUnique: uniqueIndex("semesters_name_unique").on(table.name),
	}
});

export const staff = mysqlTable("staff", {
	id: int("id").autoincrement().primaryKey().notNull(),
	slug: varchar("slug", { length: 255 }).notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	jobTitle: varchar("job_title", { length: 255 }),
	biography: varchar("biography", { length: 1000 }),
	imageUrl: varchar("image_url", { length: 255 }),
},
(table) => {
	return {
		authorsSlugUnique: uniqueIndex("authors_slug_unique").on(table.slug),
	}
});

export const tags = mysqlTable("tags", {
	id: int("id").autoincrement().primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	slug: varchar("slug", { length: 255 }).notNull(),
},
(table) => {
	return {
		slugUnique: uniqueIndex("tags_slug_unique").on(table.slug),
	}
});

export const teams = mysqlTable("teams", {
	id: int("id").autoincrement().primaryKey().notNull(),
	slug: varchar("slug", { length: 255 }).notNull(),
	name: varchar("name", { length: 255 }).notNull(),
},
(table) => {
	return {
		nameUnique: uniqueIndex("teams_name_unique").on(table.name),
		slugUnique: uniqueIndex("teams_slug_unique").on(table.slug),
	}
});

export const teamsStaff = mysqlTable("teams_staff", {
	id: int("id").autoincrement().primaryKey().notNull(),
	teamId: int("team_id").notNull(),
	staffId: int("staff_id").notNull(),
	teamOrder: int("team_order").default(0).notNull(),
	staffOrder: int("staff_order").default(0).notNull(),
	semesterId: int("semester_id"),
},
(table) => {
	return {
		teamsAuthorsAuthorIdForeign: index("teams_authors_author_id_foreign").on(table.staffId),
		teamsAuthorsSemesterIdForeign: index("teams_authors_semester_id_foreign").on(table.semesterId),
		uniquenessIdx: index("uniqueness_index").on(table.teamId, table.staffId),
	}
});