/**
 * Questions for the YOUR_CHAPTER_NAME chapter
 * 
 * Instructions for adding a new chapter:
 * 1. Create a new file in the js/questions folder with a descriptive name (e.g., new-chapter-name.js)
 * 2. Copy this template and replace YOUR_CHAPTER_ID and YOUR_CHAPTER_NAME with your values
 * 3. Add your questions following the format below
 * 4. Add the chapter to the availableChapters array in chapters.js
 * 5. Include your new script in index.html
 */

// This should match the ID in the availableChapters array in chapters.js
quizDataByChapter.YOUR_CHAPTER_ID = [
    {
        question: "Your question text here?",
        options: [
            "Option 1",
            "Option 2",
            "Option 3",
            "Option 4"
        ],
        correctAnswer: 0, // Index of the correct option (0-based)
        chapter: "YOUR_CHAPTER_NAME", // Display name for the chapter
        explanation: "Explanation for why the answer is correct and additional context about the topic."
    },
    // Add more questions following the same format
];