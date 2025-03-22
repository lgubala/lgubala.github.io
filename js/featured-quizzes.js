/**

 * Featured Quizzes Manager

 * Handles loading and displaying featured quizzes on the home page

 */

document.addEventListener('DOMContentLoaded', function() {

    // Only run on index page

    const featuredQuizzesContainer = document.getElementById('featured-quizzes-container');

    if (!featuredQuizzesContainer) return;



    console.log('Loading featured quizzes...');

    loadFeaturedQuizzes();



    /**

     * Load featured quizzes from API and display them

     */

    async function loadFeaturedQuizzes() {

        try {

            // Show loading state

            featuredQuizzesContainer.innerHTML = `

                <div class="col-span-3 flex justify-center py-8">

                    <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">

                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>

                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>

                    </svg>

                </div>

            `;



            // Fetch featured quizzes

            const response = await window.api.getFeaturedQuizzes();

            const quizzes = response.quizzes || [];

            

            console.log(`Loaded ${quizzes.length} featured quizzes`);

            

            if (quizzes.length === 0) {

                featuredQuizzesContainer.innerHTML = `

                    <div class="col-span-3 text-center py-8">

                        <p class="text-gray-500">No featured quizzes available at the moment.</p>

                        <a href="browse.html" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">

                            Browse All Quizzes

                        </a>

                    </div>

                `;

                return;

            }

            

            // Create quiz card elements

            featuredQuizzesContainer.innerHTML = '';

            

            quizzes.forEach(quiz => {

                const categoryName = quiz.category_name || 'Uncategorized';

                const rating = parseFloat(quiz.average_rating) || 0;

                const formattedRating = rating.toFixed(1);

                

                // Generate star rating HTML

                let starsHtml = '';

                for (let i = 1; i <= 5; i++) {

                    if (i <= Math.floor(rating)) {

                        starsHtml += '<i class="fas fa-star text-yellow-400"></i>';

                    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {

                        starsHtml += '<i class="fas fa-star-half-alt text-yellow-400"></i>';

                    } else {

                        starsHtml += '<i class="far fa-star text-yellow-400"></i>';

                    }

                }

                

                // Create quiz card element

                const quizCard = document.createElement('div');

                quizCard.className = 'bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-300 quiz-card cursor-pointer';

                quizCard.setAttribute('data-quiz-id', quiz.quiz_id);

                quizCard.innerHTML = `

                    <div class="p-6">

                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">

                            ${categoryName}

                        </span>

                        <h3 class="mt-3 text-lg font-medium text-gray-900">${quiz.title}</h3>

                        <p class="mt-2 text-sm text-gray-500 line-clamp-2">

                            ${quiz.description || 'Test your knowledge with this quiz.'}

                        </p>

                        <div class="mt-4 flex items-center">

                            <div class="flex-shrink-0">

                                <span class="text-sm font-medium text-gray-600">${quiz.questions_count || 0} questions</span>

                            </div>

                            <div class="ml-3 flex-1 flex justify-between">

                                <div class="text-sm">

                                    <div class="flex items-center">

                                        ${starsHtml}

                                        <span class="ml-1 text-gray-500">(${formattedRating})</span>

                                    </div>

                                </div>

                                <div>

                                    <a href="quiz.html?id=${quiz.quiz_id}" class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 start-quiz-btn">

                                        Start

                                    </a>

                                </div>

                            </div>

                        </div>

                    </div>

                `;

                

                // Add click event listener to navigate to quiz overview

                quizCard.addEventListener('click', (e) => {

                    // Prevent navigation if user clicked on Start button

                    if (e.target.closest('.start-quiz-btn')) {

                        return;

                    }

                    

                    // Navigate to quiz overview page

                    window.location.href = `quiz-overview.html?id=${quiz.quiz_id}`;

                });

                

                featuredQuizzesContainer.appendChild(quizCard);

            });

            

        } catch (error) {

            console.error('Error loading featured quizzes:', error);

            featuredQuizzesContainer.innerHTML = `

                <div class="col-span-3 text-center py-8">

                    <p class="text-red-500">Failed to load featured quizzes. Please try again later.</p>

                    <button id="retry-featured" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">

                        Retry

                    </button>

                </div>

            `;

            

            // Add retry button functionality

            document.getElementById('retry-featured')?.addEventListener('click', loadFeaturedQuizzes);

        }

    }

});