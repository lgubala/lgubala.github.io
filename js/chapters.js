/**
 * Available quiz chapters configuration
 * To add a new chapter:
 * 1. Add a new entry to this array
 * 2. Create a new JS file in the js/questions folder with the same ID as defined here
 * 3. Add the script reference to index.html
 */
const availableChapters = [
    {
        id: 'footprintingScanning',
        title: 'Footprinting & Scanning',
        description: 'Network mapping, port scanning, host discovery techniques',
        enabled: true  // Set to false to temporarily disable a chapter
    },
    {
        id: 'informationGathering',
        title: 'Information Gathering',
        description: 'Passive and active reconnaissance, DNS enumeration, Whois lookup',
        enabled: true
    }
    // To add more chapters, follow this format:
    // {
    //     id: 'newChapterId',          // Must match the variable name in the questions file
    //     title: 'New Chapter Title',   // Display name shown to the user
    //     description: 'Brief description of the chapter content',
    //     enabled: true                 // Whether the chapter is selectable
    // }
];

// Global variable to hold all questions from all chapters
let quizDataByChapter = {};