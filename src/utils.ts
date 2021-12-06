import {
    createGeneratedHeaderComment,
    MergeResults,
    removeGeneratedContents
} from '@expo/config-plugins/build/utils/generateCode'
import * as fs from 'fs';

// Fork of config-plugins mergeContents, but appends the contents to the end of the file.
export const appendContents = ({
    src,
    newSrc,
    tag,
    comment
}: {
    src: string
    newSrc: string
    tag: string
    comment: string
}): MergeResults => {
    const header = createGeneratedHeaderComment(newSrc, tag, comment)
    if (!src.includes(header)) {
        // Ensure the old generated contents are removed.
        const sanitizedTarget = removeGeneratedContents(src, tag)
        const contentsToAdd = [
            // @something
            header,
            // contents
            newSrc,
            // @end
            `${comment} @generated end ${tag}`
        ].join('\n')

        return {
            contents: sanitizedTarget ?? src + contentsToAdd,
            didMerge: true,
            didClear: !!sanitizedTarget
        }
    }
    return { contents: src, didClear: false, didMerge: false }
}

export const addLines = (content: string, find: string | RegExp, offset: number, toAdd: string[]) => {
    const lines = content.split('\n')

    let lineIndex = lines.findIndex(line => line.match(find))

    for (const newLine of toAdd) {
        if (!content.includes(newLine)) {
            lines.splice(lineIndex + offset, 0, newLine)
            lineIndex++
        }
    }

    return lines.join('\n')
}

/**
 * Used with withDangerousMod to read the file with a given path
 */
export const readFileAsync = (path: string): Promise<string> => {
    return fs.promises.readFile(path, 'utf8')
}

/**
 * Used with withDangerousMod to write to the file with a given path
 */
export const saveFileAsync = (path: string, content: string): Promise<void> => {
    return fs.promises.writeFile(path, content, 'utf8')
}