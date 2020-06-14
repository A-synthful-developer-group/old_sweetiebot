const { Language, util } = require("klasa");

module.exports = class extends Language {

    constructor(...args) {
        super(...args, { enabled: false });
        this.language = {
            DEFAULT: (key) => `${key} aún no ha sido localizado a es-419.`,
            DEFAULT_LANGUAGE: "Idioma Predeterminado",
            SETTING_GATEWAY_EXPECTS_GUILD: "El parámetro <Guild> espera un Servidor o un Objeto de Servidor.",
            SETTING_GATEWAY_VALUE_FOR_KEY_NOEXT: (data, key) => `El valor ${data} para la llave ${key} no existe.`,
            SETTING_GATEWAY_VALUE_FOR_KEY_ALREXT: (data, key) => `El valor ${data} para la llave ${key} ya existe.`,
            SETTING_GATEWAY_SPECIFY_VALUE: "Debes de especificar el valor a agregar o filtrar.",
            SETTING_GATEWAY_KEY_NOT_ARRAY: (key) => `La llave ${key} no es un Array.`,
            SETTING_GATEWAY_KEY_NOEXT: (key) => `La llave ${key} no existe en el esquema de datos actual.`,
            SETTING_GATEWAY_INVALID_TYPE: "El tipo de parámetro debe ser 'add' o 'remove'.",
            RESOLVER_INVALID_CUSTOM: (name, type) => `${name} debe ser un ${type} válido.`,
            RESOLVER_INVALID_PIECE: (name, piece) => `${name} debe ser una ${piece} de nombre válida.`,
            RESOLVER_INVALID_MSG: (name) => `${name} debe ser una id de mensaje válida.`,
            RESOLVER_INVALID_USER: (name) => `${name} debe ser una mención o una id de usuario válida.`,
            RESOLVER_INVALID_MEMBER: (name) => `${name} debe ser una mención o una id de usuario válida.`,
            RESOLVER_INVALID_CHANNEL: (name) => `${name} debe ser una etiqueta de canal o una id de canal válida.`,
            RESOLVER_INVALID_EMOJI: (name) => `${name} debe ser un emoji personalizado o una id de emoji válida.`,
            RESOLVER_INVALID_GUILD: (name) => `${name} debe ser una id de servidor válida.`,
            RESOLVER_INVALID_ROLE: (name) => `${name} debe ser una mención a un rol o una id de rol.`,
            RESOLVER_INVALID_LITERAL: (name) => `Tú opción no encaja con la única posibilidad: ${name}`,
            RESOLVER_INVALID_BOOL: (name) => `${name} debe ser 'true' o 'false'.`,
            RESOLVER_INVALID_INT: (name) => `${name} debe ser un entero.`,
            RESOLVER_INVALID_FLOAT: (name) => `${name} debe ser un número válido.`,
            RESOLVER_INVALID_REGEX_MATCH: (name, pattern) => `${name} debe seguir este patrón de regex \`${pattern}\`.`,
            RESOLVER_INVALID_URL: (name) => `${name} debe ser una url válida.`,
            RESOLVER_INVALID_DATE: (name) => `${name} debe ser una fecha válida.`,
            RESOLVER_INVALID_DURATION: (name) => `${name} debe ser un string de duración válido.`,
            RESOLVER_INVALID_TIME: (name) => `${name} debe ser un string de duración o de fecha válido.`,
            RESOLVER_STRING_SUFFIX: " caracteres",
            RESOLVER_MINMAX_EXACTLY: (name, min, suffix) => `${name} debe ser exactamente ${min}${suffix}.`,
            RESOLVER_MINMAX_BOTH: (name, min, max, suffix) => `${name} debe ser entre ${min} y ${max}${suffix}.`,
            RESOLVER_MINMAX_MIN: (name, min, suffix) => `${name} debe ser mayor que ${min}${suffix}.`,
            RESOLVER_MINMAX_MAX: (name, max, suffix) => `${name} debe ser menor que ${max}${suffix}.`,
            REACTIONHANDLER_PROMPT: "¿A qué página te gustaría ir?",
            COMMANDMESSAGE_MISSING: "Faltan dos o más argumentos requeridos después del final de la entrada.",
            COMMANDMESSAGE_MISSING_REQUIRED: (name) => `${name} es un argumento requerido.`,
            COMMANDMESSAGE_MISSING_OPTIONALS: (possibles) => `Falta una opción requerida: (${possibles})`,
            COMMANDMESSAGE_NOMATCH: (possibles) => `Tu opción no encaja con ninguna de las posibles: (${possibles})`,
            MONITOR_COMMAND_HANDLER_REPROMPT: (tag, error, time) => `${tag} | **${error}** | Tienes **${time}** segundos para responder a este mensaje con un argumento válido. Escribe **"ABORT"** para cancelar esto.`, // eslint-disable-line max-len
            MONITOR_COMMAND_HANDLER_REPEATING_REPROMPT: (tag, name, time) => `${tag} | **${name}** es un argumento repetido | Tienes **${time}** segundos para responder a este mensaje con argumentos válidos adicionales. Escribe **"CANCEL"** para cancelar esto.`, // eslint-disable-line max-len
            MONITOR_COMMAND_HANDLER_ABORTED: "Cancelado",
            INHIBITOR_COOLDOWN: (remaining) => `Acabas de usar este comando. Puedes usar este comando de nuevo en ${remaining} segundos.`,
            INHIBITOR_DISABLED: "Este comando se encuentra actualmente desactivado",
            INHIBITOR_MISSING_BOT_PERMS: (missing) => `Permisos insuficientes, hace falta: **${missing}**`,
            INHIBITOR_NSFW: "No deberías usar comandos NSFW en este canal.",
            INHIBITOR_PERMISSIONS: "No tienes permiso de usar este comando",
            INHIBITOR_REQUIRED_CONFIGS: (configs) => `El servidor no tiene ${configs.length !== 1 ? "los" : "el"} permiso${configs.length !== 1 ? "s" : ""} **${configs.join(", ")}** y por eso el comando no puede ejecutarse.`,
            INHIBITOR_RUNIN: (types) => `Este comando solo está disponible en los canales ${types}`, //¿Canales de texto/audio?
            INHIBITOR_RUNIN_NONE: (name) => `El comando ${name} no está configurado para ejecutarse en cualquier canal.`,
            COMMAND_BLACKLIST_DESCRIPTION: "Bloquear o desbloquear usuarios y servidores del bot.",
            COMMAND_BLACKLIST_SUCCESS: (usersAdded, usersRemoved, guildsAdded, guildsRemoved) => [
                usersAdded.length ? `**Usuarios añadidos**\n${util.codeBlock("", usersAdded.join(", "))}` : "",
                usersRemoved.length ? `**Usuarios removidos**\n${util.codeBlock("", usersRemoved.join(", "))}` : "",
                guildsAdded.length ? `**Servidores añadidos**\n${util.codeBlock("", guildsAdded.join(", "))}` : "",
                guildsRemoved.length ? `**Servidores removidos**\n${util.codeBlock("", guildsRemoved.join(", "))}` : ""
            ].filter(val => val !== "").join("\n"),
            COMMAND_EVAL_DESCRIPTION: "Ejecuta Javascript arbitrario. Reservado al dueño del bot.", //Prefiero usar "ejecuta" que "evalúa" en la traducción
            COMMAND_EVAL_EXTENDEDHELP: [
                "El comando eval ejecuta código tal como está, cualquier error arrojado desde él será procesado.",
                "También puedes incluir etiquetas. Escribe --silent, --depth=number o --async para personalizar la salida.", //He visto mucha gente referirse al output como "salida", aunque prefiero el termino "respuesta"
                "La etiqueta --silent hará que no se muestra nada en la salida.",
                "La etiqueta --depth acepta un número, por ejemplo, --depth=2 para personalizar la pronfundidad de util.inspect.", //¿intensidad?
                "La etiqueta --async ejecutará el código en una función asíncrona donde puedes disfrutar el uso del await, sin embargo, si quieres devolver algo, necesitas la palabra clave return",
                "La etiqueta --showHidden habilitará la opción showHidden en util.inspect.",
                "Si la salida es muy larga, se enviará como un archivo, o en la consola si no se tiene el permiso ATTACH_FILES."
            ].join("\n"),
            COMMAND_EVAL_ERROR: (time, output, type) => `**Error**:${output}\n**Tipo**:${type}\n${time}`,
            COMMAND_EVAL_OUTPUT: (time, output, type) => `**Salida**:${output}\n**Tipo**:${type}\n${time}`,
            COMMAND_EVAL_SENDFILE: (time, type) => `La salida es demasiado larga... enviando el resultado como archivo.\n**Tipo**:${type}\n${time}`,
            COMMAND_EVAL_SENDCONSOLE: (time, type) => `La salida es demasiado larga... enviando el resultado a la consola.\n**Tipo**:${type}\n${time}`,
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
