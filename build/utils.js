"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFileAsync = exports.readFileAsync = exports.addLines = exports.appendContents = void 0;
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const fs = __importStar(require("fs"));
// Fork of config-plugins mergeContents, but appends the contents to the end of the file.
const appendContents = ({ src, newSrc, tag, comment }) => {
    const header = (0, generateCode_1.createGeneratedHeaderComment)(newSrc, tag, comment);
    if (!src.includes(header)) {
        // Ensure the old generated contents are removed.
        const sanitizedTarget = (0, generateCode_1.removeGeneratedContents)(src, tag);
        const contentsToAdd = [
            // @something
            header,
            // contents
            newSrc,
            // @end
            `${comment} @generated end ${tag}`
        ].join('\n');
        return {
            contents: sanitizedTarget !== null && sanitizedTarget !== void 0 ? sanitizedTarget : src + contentsToAdd,
            didMerge: true,
            didClear: !!sanitizedTarget
        };
    }
    return { contents: src, didClear: false, didMerge: false };
};
exports.appendContents = appendContents;
const addLines = (content, find, offset, toAdd) => {
    const lines = content.split('\n');
    let lineIndex = lines.findIndex(line => line.match(find));
    for (const newLine of toAdd) {
        if (!content.includes(newLine)) {
            lines.splice(lineIndex + offset, 0, newLine);
            lineIndex++;
        }
    }
    return lines.join('\n');
};
exports.addLines = addLines;
/**
 * Used with withDangerousMod to read the file with a given path
 */
const readFileAsync = (path) => {
    return fs.promises.readFile(path, 'utf8');
};
exports.readFileAsync = readFileAsync;
/**
 * Used with withDangerousMod to write to the file with a given path
 */
const saveFileAsync = (path, content) => {
    return fs.promises.writeFile(path, content, 'utf8');
};
exports.saveFileAsync = saveFileAsync;
