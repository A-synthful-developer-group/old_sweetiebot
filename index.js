const rootCas = require("ssl-root-cas/latest").create()
    .addFile();
require("https").globalAgent.options.ca = rootCas;

const Client = require("./client");
const authDetails = require("./auth.json");
const conf = require("./config.json");

const bot = new Client({
    clientOptions: {
        fetchAllMembers: conf.clientOptions.fetchAllMembers
    },
    prefix: conf.prefix,
    prefixCaseInsensitive: true,
    commandLogging: conf.commandLogging,
    commandEditing: conf.commandEditing,
    typing: conf.typing,
    schedule: {
        interval: 45000
    },
    providers: {
        default: "mongodb", 
        mongodb: {
            user: authDetails.mongodb.user,
            password: authDetails.mongodb.password
        }
    },
    pieceDefaults: {
        arguments: {
            enabled: true,
            aliases: []
        },
        commands: {
            aliases: [],
            autoAliases: true,
            bucket: 1,
            cooldown: 0,
            description: "",
            extendedHelp: language => language.get("COMMAND_HELP_NO_EXTENDED"),
            enabled: true,
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            promptLimit: 0,
            promptTime: 30000,
            requiredConfigs: [],
            requiredPermissions: 0,
            runIn: ["text", "dm"],
            subcommands: false,
            usage: "",
            quotedStringSupport: false,
            deletable: false
        },
        events: {
            enabled: true,
            once: false
        },
        extendables: {
            enabled: true,
            klasa: false,
            appliesTo: []
        },
        finalizers: { enabled: true },
        inhibitors: {
            enabled: true,
            spamProtection: false
        },
        languages: { enabled: true },
        monitors: {
            enabled: true,
            ignoreBots: true,
            ignoreSelf: true,
            ignoreOthers: true,
            ignoreWebhooks: true,
            ignoreEdits: true,
            ignoreBlacklistedUsers: true,
            ignoreBlacklistedGuilds: true
        },
        providers: { enabled: true },
        tasks: { enabled: true },
        musicalbox: { enabled: true },
        sentences: { enabled: true }
    }
});

if(!bot.gateways.textChannels)
    bot.gateways.register("textChannels");

for(const gateway of conf.gateways)
    for(const key of gateway.keys)
        if(!bot.gateways[gateway.name].schema.has(key.name))
            bot.gateways[gateway.name].schema.add(key.name, key.type, key);

bot.login(authDetails.token);
bot.console.log(conf.customStartingMsg[Math.floor(Math.random() * conf.customStartingMsg.length)]);
