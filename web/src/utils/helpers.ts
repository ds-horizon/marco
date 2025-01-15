import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Event = { tagName: string; timestamp: number };
type PatternResult = { [key: string]: number[] };

/**
 * Finds and returns patterns of sequential tags in the given data.
 *
 * @param data - Array of events, each containing a `tagName` and a `timestamp`.
 * @param tags - Array of strings representing the tag sequence to search for (e.g., ["T0", "T1", "T2"]).
 * @returns An object where keys (`T0`, `T1`, etc.) map to arrays of timestamps for each tag in matched patterns.
 *
 * This function searches for patterns where tags occur in the specified order (tags[0] -> tags[1] -> tags[2] ...).
 * Only complete patterns are recorded in the result, ensuring all keys have arrays of the same length.
 * The search avoids overlapping matches; once a pattern is found, the next match starts after it.
 */
const findPatterns = (data: Event[], tags: string[]): PatternResult => {
  // Initialize result with empty arrays for each tag
  const result = tags.reduce<PatternResult>((acc, value) => {
    acc[value] = [];
    return acc;
  }, {});

  let currentPattern: number[] = [];
  let tagIndex = 0;

  data.forEach(({ tagName, timestamp }) => {
    if (tagName === tags[tagIndex]) {
      currentPattern.push(timestamp);
      tagIndex++;

      if (tagIndex === tags.length) {
        currentPattern.forEach((time, idx) => result[tags[idx]].push(time));

        // Reset for the next match
        currentPattern = [];
        tagIndex = 0;
      }
    }
  });

  return result;
};

// Example usage
const data = [
  { tagName: 'MatchCenter', timestamp: 1733301898369 },
  { tagName: 'ContestCard', timestamp: 1733301898878 },
  { tagName: 'MatchCenter', timestamp: 1733301904456 },
  { tagName: 'Rewards', timestamp: 1733301905063 },
  { tagName: 'RewardsCardClicked', timestamp: 1733301911827 },
  { tagName: 'MatchCenter', timestamp: 1733301912185 },
  { tagName: 'ContestCard', timestamp: 1733301898369 },
  { tagName: 'Rewards', timestamp: 1733301898878 },
  { tagName: 'MatchCenter', timestamp: 1733301904456 },
  { tagName: 'Leaderboard', timestamp: 1733301905063 },
  { tagName: 'TeamPreview', timestamp: 1733301911827 },
];

const tags = ['MatchCenter', 'ContestCard', 'Rewards'];
const patterns = findPatterns(data, tags);
console.log(patterns);

// Sample output

// const output = {
//   "MatchCenter": [
//     1733301898369,
//     1733301912185
//   ],
//   "ContestCard": [
//     1733301898878,
//     1733301898369
//   ],
//   "Rewards": [
//     1733301905063,
//     1733301898878
//   ]
// }
