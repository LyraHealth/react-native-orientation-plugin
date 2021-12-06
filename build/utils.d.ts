import { MergeResults } from '@expo/config-plugins/build/utils/generateCode';
export declare const appendContents: ({ src, newSrc, tag, comment }: {
    src: string;
    newSrc: string;
    tag: string;
    comment: string;
}) => MergeResults;
export declare const addLines: (content: string, find: string | RegExp, offset: number, toAdd: string[]) => string;
/**
 * Used with withDangerousMod to read the file with a given path
 */
export declare const readFileAsync: (path: string) => Promise<string>;
/**
 * Used with withDangerousMod to write to the file with a given path
 */
export declare const saveFileAsync: (path: string, content: string) => Promise<void>;
