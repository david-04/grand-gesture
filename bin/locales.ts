import { readFileSync, writeFileSync } from "node:fs";

//----------------------------------------------------------------------------------------------------------------------
// Data types
//----------------------------------------------------------------------------------------------------------------------

const LANGUAGES = ["en", "it", "pt_BR", "ru", "zh_CN", "zh_TW"] as const;

type Locales = Record<string, { message: string; description?: string }>;

const MESSAGE_WITH_CODE = "#$CODE $MESSAGE";
const CODE_REMOVAL_PATTERN = /^#[a-z\d]{2}\s?/gi;

//----------------------------------------------------------------------------------------------------------------------
// Global variables
//----------------------------------------------------------------------------------------------------------------------

const unusedIdentifiers = (() => {
    const IDENTIFIER_SYMBOLS = "abcdefghjkmnpqrstuvwxyz23456789".split("");
    return IDENTIFIER_SYMBOLS.flatMap(symbol1 => IDENTIFIER_SYMBOLS.map(symbol2 => `${symbol1}${symbol2}`)).sort(
        () => Math.random() - 0.5
    );
})();

const identifiersByMessageId = new Map<string, string>();

//----------------------------------------------------------------------------------------------------------------------
// Main program
//----------------------------------------------------------------------------------------------------------------------

const OPERATIONS = { "begin-translation": beginTranslation, "end-translation": endTranslation };

const [, , ...params] = process.argv;
const [operation, ...rest] = params;
if (!rest.length && OPERATIONS[operation]) {
    const english = load("en");
    for (const language of LANGUAGES) {
        console.log(`- ${language}`);
        OPERATIONS[operation](english, language);
    }
} else {
    console.error(`Invalid parameters: ${params.join(" ")}\nExpected: ${Object.keys(OPERATIONS).join(" or ")})`);
}

//----------------------------------------------------------------------------------------------------------------------
// Begin a translation
//----------------------------------------------------------------------------------------------------------------------

function beginTranslation(english: Locales, language: string) {
    const input = load(language);
    if (language === "en") {
        Object.entries(input).forEach(([key, value]) => (value.message = injectUniqueCode(key, value.message)));
        save(language, input);
    } else {
        const output: Locales = {};
        for (const key of Object.keys(english)) {
            const englishMessage = english[key].message ?? "";
            const message = input[key]?.message.trim() || englishMessage;
            output[key] = {
                message: injectUniqueCode(key, message),
                description: `${message === englishMessage ? "[TODO] " : ""}English: ${englishMessage}`,
            };
        }
        save(language, output);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// End a translation
//----------------------------------------------------------------------------------------------------------------------

function endTranslation(english: Locales, language: string) {
    const input = load(language);
    if (language === "en") {
        save(language, input);
    } else {
        const output: Locales = {};
        for (const key of Object.keys(english)) {
            const englishMessage = english[key].message ?? "";
            const message = input[key]?.message.trim();
            if (message && (message !== englishMessage || ["ext_name", "ext_des"].includes(key))) {
                output[key] = { message };
            }
        }
        save(language, output);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Load the file
//----------------------------------------------------------------------------------------------------------------------

function load(language: string) {
    const fileContent = readFileSync(getFileName(language), "utf-8").toString();
    const locales = JSON.parse(fileContent) as Locales;
    sort(locales);
    normalize(locales);
    return locales;
}

//----------------------------------------------------------------------------------------------------------------------
// Get the filename/path for a locale
//----------------------------------------------------------------------------------------------------------------------

function getFileName(language: string) {
    return `_locales/${language}/messages.json`;
}

//----------------------------------------------------------------------------------------------------------------------
// Sort the keys alphabetically
//----------------------------------------------------------------------------------------------------------------------

function sort(locales: Locales) {
    const entries = Object.entries(locales)
        .map(([key, value]) => ({ key, value }))
        .sort((a, b) => a.key.toLowerCase().localeCompare(b.key.toLowerCase()));
    entries.forEach(({ key }) => delete locales[key]);
    entries.forEach(({ key, value }) => (locales[key] = value));
}

//----------------------------------------------------------------------------------------------------------------------
// Normalize the messages and remove identifiers
//----------------------------------------------------------------------------------------------------------------------

export function normalize(locales: Locales) {
    for (const key of Object.keys(locales)) {
        locales[key].message = locales[key].message?.trim().replace(CODE_REMOVAL_PATTERN, "").trim() ?? "";
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Save locales
//----------------------------------------------------------------------------------------------------------------------

function save(language: string, locales: Locales) {
    writeFileSync(getFileName(language), JSON.stringify(locales, null, 4));
}

//----------------------------------------------------------------------------------------------------------------------
// Prepend identifiers
//----------------------------------------------------------------------------------------------------------------------

function injectUniqueCode(key: string, message: string) {
    const identifier = identifiersByMessageId.get(key) ?? unusedIdentifiers.pop();
    if (!identifier) {
        throw new Error("There are too many messages and not enough unique identifiers");
    }
    identifiersByMessageId.set(key, identifier);
    return MESSAGE_WITH_CODE.replace(/\$CODE/, identifier).replace(/\$MESSAGE/, message);
}
