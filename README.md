# Penetration Testing Quiz System

A modular, extensible quiz system for testing penetration testing knowledge across multiple topics.

## Features

- Multiple-choice questions categorized by chapter
- Random question selection
- Ability to select specific chapters to test
- Customizable quiz length
- Detailed results with explanations
- Easily expandable with new chapters

## File Structure

```
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # CSS styles
├── js/
│   ├── chapters.js         # Chapter definitions
│   ├── quiz.js             # Main quiz logic
│   └── questions/          # Question sets by chapter
│       ├── _template.js    # Template for new question sets
│       ├── footprinting-scanning.js
│       └── information-gathering.js
└── README.md               # This file
```

## How to Add a New Chapter

1. **Create a new question file:**
   - Copy `js/questions/_template.js` to a new file in the same directory with a meaningful name
   - Replace `YOUR_CHAPTER_ID` and `YOUR_CHAPTER_NAME` with your values
   - Add your questions following the template format

2. **Register the chapter:**
   - Open `js/chapters.js`
   - Add a new entry to the `availableChapters` array with your chapter details:
     ```javascript
     {
         id: 'yourChapterId',
         title: 'Your Chapter Title',
         description: 'Brief description of the chapter content',
         enabled: true
     }
     ```

3. **Include the new file:**
   - Open `index.html`
   - Add a script tag for your new question file before the `quiz.js` inclusion:
     ```html
     <script src="js/questions/your-chapter-file.js"></script>
     ```

## Question Format

Each question should follow this format:

```javascript
{
    question: "Your question text?",
    options: [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
    ],
    correctAnswer: 0, // Index of the correct option (0-based)
    chapter: "Your Chapter Name",
    explanation: "Explanation of the correct answer and why it's right."
}
```

## Tips for Good Questions

1. **Keep questions clear and concise**
2. **Make sure there is only one correct answer**
3. **Include a thorough explanation**
4. **Avoid very obvious incorrect options**
5. **Try to test understanding rather than just memorization**

## Customizing the System

- **Styling:** Edit `css/styles.css` to change the appearance
- **Quiz behavior:** Modify `js/quiz.js` to adjust quiz functionality
- **Question count options:** Change the `<select>` element in `index.html` to offer different numbers of questions