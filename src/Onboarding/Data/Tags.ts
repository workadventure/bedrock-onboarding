import type { Tag } from "../Type/Tags";

/**
 * All possible tags a player could have
 * @constant
 */
export const everyone: Tag[] = ["admin", "br", "hr", "ext", "fr", "pt", "alt", "guest"];

/**
 * All tags except guest
 * @constant
 */
export const everyoneButGuests: Tag[] = ["admin", "br", "hr", "ext", "fr", "pt", "alt"];

/**
 * Only the tags of BR employees
 * @constant
 */
export const employees: Tag[] = ["admin", "br", "hr"];

/**
 * All newbie tags and guest
 * @constant
 */
export const newbiesAndGuests: Tag[] = ["ext", "fr", "pt", "alt", "guest"];

/**
 * All possible tags a newbie could have
 * @constant
 */
export const newbies: Tag[] = ["ext", "fr", "pt", "alt", "admin"];