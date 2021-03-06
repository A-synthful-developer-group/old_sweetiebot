const { Language, util } = require("klasa");

module.exports = class extends Language {

    constructor(...args) {
        super(...args, { enabled: false });
        this.language = {
            DEFAULT: (key) => `${key} δεν έχει μεταγραστεί στα el-GR ακόμα.`,
            DEFAULT_LANGUAGE: "Προκαθορισμένη Γλώσσα",
            SETTING_GATEWAY_EXPECTS_GUILD: "Η παράμετρος <Guild> αναμένει είτε μία συντεχνία ή ένα αντικείμενο συντεχνίας.",
            SETTING_GATEWAY_VALUE_FOR_KEY_NOEXT: (data, key) => `Η τιμή ${data} για το κλειδί ${key} δεν υπάρχει.`,
            SETTING_GATEWAY_VALUE_FOR_KEY_ALREXT: (data, key) => `Η τιμή ${data} για το κλειδί ${key} υπάρχει ήδη.`,
            SETTING_GATEWAY_SPECIFY_VALUE: "Πρέπει να προσδιορίσετε την τιμή για πρόσθεση ή φιλτράρισμα.",
            SETTING_GATEWAY_KEY_NOT_ARRAY: (key) => `Το κλειδί ${key} δεν είναι πίνακας.`,
            SETTING_GATEWAY_KEY_NOEXT: (key) => `Το κλειδί ${key}δεν υπάρχει στο συγκεκριμένο σχήμα δεδομένων.`,
            SETTING_GATEWAY_INVALID_TYPE: "Η παράμετρος 'Τύπος' πρέπει να είναι είτε 'add' ή 'remove'.",
            RESOLVER_INVALID_CUSTOM: (name, type) => `${name} πρέπει να είναι ένα έγκυρο ${type}.`,
            RESOLVER_INVALID_PIECE: (name, piece) => `${name} πρέπει να είναι ένα έγκυρο ${piece} όνομα.`,
            RESOLVER_INVALID_MSG: (name) => `${name} πρέπει να είναι μια έγκυρη ταυτότητα μηνύματος.`,
            RESOLVER_INVALID_USER: (name) => `${name} πρέπει να είναι μια έγκυρη αναφορά χρήστη ή ταυτότητα χρήστη.`,
            RESOLVER_INVALID_MEMBER: (name) => `${name} πρέπει να είναι μια έγκυρη αναφορά χρήστη ή ταυτότητα χρήστη.`,
            RESOLVER_INVALID_CHANNEL: (name) => `${name} πρέπει να είναι μια έγκυρη ετικέτα καναλιού ή ταυτότητα καναλιού.`,
            RESOLVER_INVALID_EMOJI: (name) => `${name} πρέπει να είναι μια έγκυρη ετικέτα emoji ή ταυτότητα emoji.`,
            RESOLVER_INVALID_GUILD: (name) => `${name} πρέπει να είναι μια έγκυρη ταυτότητα συντεχνίας.`,
            RESOLVER_INVALID_ROLE: (name) => `${name} πρέπει να είναι μια αναφορά ρόλου ή μια ταυτότητα ρόλου.`,
            RESOLVER_INVALID_LITERAL: (name) => `Your option did not match the only possibility: ${name}`,
            RESOLVER_INVALID_BOOL: (name) => `${name} πρέπει να είναι 'σωστό' ή 'λάθος'.`,
            RESOLVER_INVALID_INT: (name) => `${name} πρέπει να είναι ακέραιος.`,
            RESOLVER_INVALID_FLOAT: (name) => `${name} πρέπει να είναι έγκυρος αριθμός.`,
            RESOLVER_INVALID_REGEX_MATCH: (name, pattern) => `${name} πρέπει να ακολουθεί το εξής σχέδιο regex \`${pattern}\`.`,
            RESOLVER_INVALID_URL: (name) => `${name} πρέπει να είναι έγκυρο url.`,
            RESOLVER_INVALID_DATE: (name) => `${name} πρέπει να είναι έγκυρη ημερομηνία.`,
            RESOLVER_INVALID_DURATION: (name) => `${name} πρέπει να είναι έγκυρη διάρκεια.`,
            RESOLVER_INVALID_TIME: (name) => `${name} πρέπει να είναι έγκυρη διάρκεια ή ημερομηνία.`,
            RESOLVER_STRING_SUFFIX: " χαρακτήρες",
            RESOLVER_MINMAX_EXACTLY: (name, min, suffix) => `${name} πρέπει να είναι ακριβώς ${min}${suffix}.`,
            RESOLVER_MINMAX_BOTH: (name, min, max, suffix) => `${name} πρέπει να είναι μεταξύ ${min} και ${max}${suffix}.`,
            RESOLVER_MINMAX_MIN: (name, min, suffix) => `${name} πρέπει να είναι μεγαλύτερο από ${min}${suffix}.`,
            RESOLVER_MINMAX_MAX: (name, max, suffix) => `${name} πρέπει να είναι μικρότερο από ${max}${suffix}.`,
            REACTIONHANDLER_PROMPT: "Σε ποια σελίδα θέλετε να μεταφερθείτε?",
            COMMANDMESSAGE_MISSING: "Λοίπουν μια ή περισσότερες επιλογές μετά το τέλος εισόδου.",
            COMMANDMESSAGE_MISSING_REQUIRED: (name) => `${name} είναι απαραίτητο .`,/////////////////////
            COMMANDMESSAGE_MISSING_OPTIONALS: (possibles) => `Λείπει η απαραίτητη επιλογή: (${possibles})`,
            COMMANDMESSAGE_NOMATCH: (possibles) => `Η επιλογή σας δεν αντιστοιχεί σε καμία από τις πιθανότητες: (${possibles})`,
            MONITOR_COMMAND_HANDLER_REPROMPT: (tag, error, time) => `${tag} | **${error}** | Έχετε **${time}** δευτερόλεπτα για να απαντήσετε σε αυτό το μήνυμα . Πληκτρολογίστε **"ABORT"** για ακύρωση.`, // eslint-disable-line max-len
            MONITOR_COMMAND_HANDLER_REPEATING_REPROMPT: (tag, name, time) => `${tag} | **${name}** is a repeating argument | Έχετε **${time}** δευτερόλεπτα για να απαντήσετε σε αυτό το μήνυμα με επιπλέον επιχειρήματα. Πληκτρολογίστε **"CANCEL"** για ακύρωση.`, // eslint-disable-line max-len
            MONITOR_COMMAND_HANDLER_ABORTED: "Ακυρώθηκε",
            INHIBITOR_COOLDOWN: (remaining) => `Μόλις χρησιμοποιήσατε αυτή την εντολή. Μπορείτε να την ξαναχρησιμοποιήσετε σε ${remaining} δευτερόλεπτα.`,
            INHIBITOR_DISABLED: "Αυτή η εντολή είναι απενεργοποιημένη.",
            INHIBITOR_MISSING_BOT_PERMS: (missing) => `Ανεπαρκή προνόμοια, λείπουν τα: **${missing}**`,
            INHIBITOR_NSFW: "Δεν μπορείτε να χρησιμοποιήσετε 'μη ασφαλής' εντολές σε αυτό το κανάλι.",
            INHIBITOR_PERMISSIONS: "Δεν έχετε δικαιώματα για να χρησιμοποιήσετε αυτή την εντολή.",
            INHIBITOR_REQUIRED_CONFIGS: (configs) => `The guild is missing the **${configs.join(", ")}** guild setting${configs.length !== 1 ? "s" : ""} and thus the command cannot run.`,
            INHIBITOR_RUNIN: (types) => `This command is only available in ${types} channels`,
            INHIBITOR_RUNIN_NONE: (name) => `The ${name} command is not configured to run in any channel.`,
            COMMAND_BLACKLIST_DESCRIPTION: "Blacklists or un-blacklists users and guilds from the bot.",
            COMMAND_BLACKLIST_SUCCESS: (usersAdded, usersRemoved, guildsAdded, guildsRemoved) => [
                usersAdded.length ? `**Users Added**\n${util.codeBlock("", usersAdded.join(", "))}` : "",
                usersRemoved.length ? `**Users Removed**\n${util.codeBlock("", usersRemoved.join(", "))}` : "",
                guildsAdded.length ? `**Guilds Added**\n${util.codeBlock("", guildsAdded.join(", "))}` : "",
                guildsRemoved.length ? `**Guilds Removed**\n${util.codeBlock("", guildsRemoved.join(", "))}` : ""
            ].filter(val => val !== "").join("\n"),
            COMMAND_EVAL_DESCRIPTION: "Evaluates arbitrary Javascript. Reserved for bot owner.",
            COMMAND_EVAL_EXTENDEDHELP: [
                "The eval command evaluates code as-in, any error thrown from it will be handled.",
                "It also uses the flags feature. Write --silent, --depth=number or --async to customize the output.",
                "The --silent flag will make it output nothing.",
                "The --depth flag accepts a number, for example, --depth=2, to customize util.inspect's depth.",
                "The --async flag will wrap the code into an async function where you can enjoy the use of await, however, if you want to return something, you will need the return keyword",
                "The --showHidden flag will enable the showHidden option in util.inspect.",
                "If the output is too large, it'll send the output as a file, or in the console if the bot does not have the ATTACH_FILES permission."
            ].join("\n"),
            COMMAND_EVAL_ERROR: (time, output, type) => `**Error**:${output}\n**Type**:${type}\n${time}`,
            COMMAND_EVAL_OUTPUT: (time, output, type) => `**Output**:${output}\n**Type**:${type}\n${time}`,
            COMMAND_EVAL_SENDFILE: (time, type) => `Output was too long... sent the result as a file.\n**Type**:${type}\n${time}`,
            COMMAND_EVAL_SENDCONSOLE: (time, type) => `Output was too long... sent the result to console.\n**Type**:${type}\n${time}`,
            COMMAND_UNLOAD: (type, name) => `✅ Unloaded ${type}: ${name}`,
            COMMAND_UNLOAD_DESCRIPTION: "Unloads the klasa piece.",
            COMMAND_TRANSFER_ERROR: "❌ That file has been transfered already or never existed.",
            COMMAND_TRANSFER_SUCCESS: (type, name) => `✅ Successfully transferred ${type}: ${name}`,
            COMMAND_TRANSFER_FAILED: (type, name) => `Transfer of ${type}: ${name} to Client has failed. Please check your Console.`,
            COMMAND_TRANSFER_DESCRIPTION: "Transfers a core piece to its respective folder",
            COMMAND_RELOAD: (type, name) => `✅ Reloaded ${type}: ${name}`,
            COMMAND_RELOAD_ALL: (type) => `✅ Reloaded all ${type}.`,
            COMMAND_RELOAD_DESCRIPTION: "Reloads a klasa piece, or all pieces of a klasa store.",
            COMMAND_REBOOT: "Rebooting...",
            COMMAND_REBOOT_END: "Bye, bye!",
            COMMAND_REBOOT_DESCRIPTION: "Reboots the bot.",
            COMMAND_PING: "Ping?",
            COMMAND_PING_DESCRIPTION: "Tells you if bot works and ping of the bot.",
            COMMAND_PINGPONG: (diff, ping) => `Pong! \nBot <-> Discord ${diff}ms \nYou <-> Bot: ${ping}ms.`,
            COMMAND_INVITE_SELFBOT: "Why would you need an invite link for a selfbot...",
            COMMAND_INVITE: (client) => [
                `To add ${client.user.username} to your discord guild:`,
                client.invite,
                util.codeBlock("", [
                    "The above link is generated requesting the minimum permissions required to use every command currently.",
                    "I know not all permissions are right for every server, so don't be afraid to uncheck any of the boxes.",
                    "If you try to use a command that requires more permissions than the bot is granted, it will let you know."
                ].join(" ")),
                "Please file an issue at <https://github.com/dirigeants/klasa> if you find any bugs."
            ],
            COMMAND_INVITE_DESCRIPTION: "Displays the join server link of the bot.",
            COMMAND_INFO: [
                "Klasa is a 'plug-and-play' framework built on top of the Discord.js library.",
                "Most of the code is modularized, which allows developers to edit Klasa to suit their needs.",
                "",
                "Some features of Klasa include:",
                "• Fast Loading times with ES7 Support (Async/Await)",
                "• Per-server configuration, that can be extended with your own code",
                "• Customizable Command system with automated usage parsing and easy to use reloading and downloading modules",
                "• \"Monitors\" which can watch messages and act on them, like a normal message event (Swear Filters, Spam Protection, etc)",
                "• \"Inhibitors\" which can prevent commands from running based on a set of parameters (Permissions, Blacklists, etc)",
                "• \"Providers\" which allow you to connect with an outside database of your choosing.",
                "• \"Finalizers\" which run on messages after a successful command.",
                "• \"Extendables\", code that acts passively. They add properties or methods to existing Discord.js classes.",
                "• \"Languages\", which allow you to localize your bot.",
                "",
                "We hope to be a 100% customizable framework that can cater to all audiences. We do frequent updates and bugfixes when available.",
                "If you're interested in us, check us out at https://klasa.js.org"
            ],
            COMMAND_INFO_DESCRIPTION: "Provides some information about this bot.",
            COMMAND_HELP_DESCRIPTION: "Display help for a command.",
            COMMAND_HELP_NO_EXTENDED: "No extended help available.",
            COMMAND_HELP_DM: "📥 | The list of commands you have access to has been sent to your DMs.",
            COMMAND_HELP_NODM: "❌ | You have DMs disabled, I couldn't send you the commands in DMs.",
            COMMAND_HELP_USAGE: (usage) => `usage :: ${usage}`,
            COMMAND_HELP_EXTENDED: "Extended Help ::",
            COMMAND_ENABLE: (type, name) => `+ Successfully enabled ${type}: ${name}`,
            COMMAND_ENABLE_DESCRIPTION: "Re-enables or temporarily enables a command/inhibitor/monitor/finalizer. Default state restored on reboot.",
            COMMAND_DISABLE: (type, name) => `+ Successfully disabled ${type}: ${name}`,
            COMMAND_DISABLE_DESCRIPTION: "Re-disables or temporarily disables a command/inhibitor/monitor/finalizer/event. Default state restored on reboot.",
            COMMAND_DISABLE_WARN: "You probably don't want to disable that, since you wouldn't be able to run any command to enable it again",
            COMMAND_CONF_NOKEY: "You must provide a key",
            COMMAND_CONF_NOVALUE: "You must provide a value",
            COMMAND_CONF_GUARDED: (name) => `${util.toTitleCase(name)} may not be disabled.`,
            COMMAND_CONF_UPDATED: (key, response) => `Successfully updated the key **${key}**: \`${response}\``,
            COMMAND_CONF_KEY_NOT_ARRAY: "This key is not array type. Use the action 'reset' instead.",
            COMMAND_CONF_GET_NOEXT: (key) => `The key **${key}** does not seem to exist.`,
            COMMAND_CONF_GET: (key, value) => `The value for the key **${key}** is: \`${value}\``,
            COMMAND_CONF_RESET: (key, response) => `The key **${key}** has been reset to: \`${response}\``,
            COMMAND_CONF_SERVER_DESCRIPTION: "Define per-server configuration.",
            COMMAND_CONF_SERVER: (key, list) => `**Server Configuration${key}**\n${list}`,
            COMMAND_CONF_USER_DESCRIPTION: "Define per-user configuration.",
            COMMAND_CONF_USER: (key, list) => `**User Configuration${key}**\n${list}`,
            COMMAND_STATS: (botUsername, uptime, memUsage, processVersion, botVersion, discordVersion, klasaVersion, users, servers, channels) => [
                `= Statistics about ${botUsername} =`,
                "",
                `• Uptime     :: ${uptime}`,
                `• RAM Usage  :: ${memUsage}MB`,
                `• Node       :: ${processVersion}`,
                `• SweetieBot :: v${botVersion}`,
                `• Discord.js :: v${discordVersion}`,
                `• Klasa      :: v${klasaVersion}`,
                `• Users      :: ${users}`,
                `• Servers    :: ${servers}`,
                `• Channels   :: ${channels}`
            ],
            COMMAND_STATS_DESCRIPTION: "Tells you the stats of the bot."
        };
    }

    async init() {
        await super.init();
    }

};