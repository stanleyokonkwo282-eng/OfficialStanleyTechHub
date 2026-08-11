import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const quotes = [
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The harder the conflict, the more glorious the triumph.", author: "William Tecumseh Sherman" },
  { text: "Success consists of going from failure to failure without loss of enthusiasm.", author: "Winston Churchill" },
  { text: "Leadership is solving problems. The day soldiers stop bringing you their problems is the day you have stopped leading them.", author: "Colin Powell" },
  { text: "A good plan violently executed now is better than a perfect plan executed next week.", author: "George S. Patton" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Success is how high you bounce when you hit bottom.", author: "George S. Patton" },
  { text: "The best victory is that which requires no battle.", author: "Sun Tzu" },
  { text: "You have to think anyway, so why not think big?", author: "Donald Trump" },
  { text: "The road to success and the road to failure are almost exactly the same.", author: "Colin R. Davis" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
  { text: "Don’t be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
  { text: "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.", author: "Albert Schweitzer" },
  { text: "The secret of success is to do the common thing uncommonly well.", author: "John D. Rockefeller Jr." },
  { text: "Try not to become a man of success. Rather become a man of value.", author: "Albert Einstein" },
  { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
  { text: "Success is not in what you have, but in who you have become.", author: "John C. Maxwell" },
  { text: "The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack of will.", author: "Vince Lombardi" },
  { text: "Success is peace of mind, which is a direct result of self-satisfaction in knowing you did your best.", author: "John Wooden" },
  { text: "Success is not a destination, but the journey itself.", author: "Zig Ziglar" },
  { text: "You can’t wait for opportunities. You have to create them.", author: "Zig Ziglar" },
  { text: "Your attitude, not your aptitude, will determine your altitude.", author: "Zig Ziglar" },
  { text: "Success is dependent upon the glands of sweat.", author: "John J. Pershing" },
  { text: "From success to success is easy; it is only from failure to failure that the going is hard.", author: "John J. Pershing" },
  { text: "The man who wins may have been counted out several times, but he didn’t hear the referee.", author: "John J. Pershing" },
  { text: "A pint of sweat will save a gallon of blood.", author: "George S. Patton" },
  { text: "Never tell people how to do things. Tell them what to do and they will surprise you with their results.", author: "George S. Patton" },
  { text: "I am not afraid of an army of lions led by a sheep; I am afraid of an army of sheep led by a lion.", author: "Alexander the Great" },
  { text: "There is nothing impossible to him who will try.", author: "Alexander the Great" },
  { text: "He who fears being conquered is sure of defeat.", author: "Napoleon Bonaparte" },
  { text: "Impossible is a word to be found only in the dictionary of fools.", author: "Napoleon Bonaparte" },
  { text: "The battlefield is a scene of constant chaos. The winner will be the one who controls that chaos.", author: "George S. Patton" },
  { text: "Do not follow where the path may lead. Go instead where there is no path and leave a trail.", author: "Muriel Strode" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "God, grant me the serenity to accept the things I cannot change, courage to change the things I can, and wisdom to know the difference.", author: "Reinhold Niebuhr" },
  { text: "The best way to predict your future is to create it.", author: "Abraham Lincoln" },
  { text: "I am not bound to win, but I am bound to be true. I am not bound to succeed, but I am bound to live up to the light I have.", author: "Abraham Lincoln" },
  { text: "Give me six hours to chop down a tree and I will spend the first four sharpening the axe.", author: "Abraham Lincoln" },
  { text: "The dogmas of the quiet past are inadequate to the stormy present. The occasion is piled high with difficulty, and we must rise with the occasion.", author: "Abraham Lincoln" },
  { text: "Our greatest glory is not in never falling, but in rising every time we fall.", author: "Confucius" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { text: "Success is sweet and its relish is as savory to the ambitious as the honeyed dew to the bee.", author: "Horace" },
  { text: "The roots of true achievement lie in the will to become the best you can become.", author: "Harold Taylor" },
  { text: "The price of success is hard work, dedication to the job at hand, and the determination that whether we win or lose, we have applied the best of ourselves to the task.", author: "Vince Lombardi" },
  { text: "Winning is not a sometime thing; it is an all-the-time thing. You don’t win once in a while, you don’t do the right things once in a while, you do them all the time.", author: "Vince Lombardi" },
  { text: "If you’ll not settle for anything less than your best, you will be amazed at what you can accomplish.", author: "Vince Lombardi" },
  { text: "Leaders aren’t born, they are made. And they are made just like anything else, through hard work.", author: "Vince Lombardi" },
  { text: "The harder you work, the harder it is to surrender.", author: "Vince Lombardi" },
  { text: "The only place success comes before work is in the dictionary.", author: "Vince Lombardi" },
  { text: "Individual commitment to a group effort is what makes a team work, a company work, a society work, a civilization work.", author: "Vince Lombardi" },
  { text: "Perfection is not attainable, but if we chase perfection we can catch excellence.", author: "Vince Lombardi" },
  { text: "Success is the result of preparation, hard work, and learning from failure.", author: "Colin Powell" },
  { text: "There are no secrets to success. It is the result of preparation, hard work, and learning from failure.", author: "Colin Powell" },
  { text: "The best way out is always through.", author: "Robert Frost" },
  { text: "In three words I can sum up everything I have learned about life: it goes on.", author: "Robert Frost" },
  { text: "Success is not a good teacher, failure makes you humble.", author: "Shah Rukh Khan" },
  { text: "Success is not the absence of failure; it’s the absence of giving up.", author: "Unknown" },
  { text: "The harder you work for something, the greater you’ll feel when you achieve it.", author: "Unknown" },
  { text: "Success is not about the destination, it’s about the journey.", author: "Zig Ziglar" },
  { text: "You can’t climb the ladder of success with your hands in your pockets.", author: "Zig Ziglar" },
  { text: "If you are not willing to risk the usual, you will have to settle for ordinary.", author: "Jim Rohn" },
  { text: "Formal education will make you a living; self-education will make you a fortune.", author: "Jim Rohn" },
  { text: "Success is nothing more than a few simple disciplines, practiced every day.", author: "Jim Rohn" },
  { text: "Either you run the day, or the day runs you.", author: "Jim Rohn" },
  { text: "Don’t wish it were easier. Wish you were better.", author: "Jim Rohn" },
  { text: "The only way to achieve the impossible is to believe it is possible.", author: "Unknown" },
  { text: "Success is the greatest revenge.", author: "Unknown" },
  { text: "Don’t stop when you are tired. Stop when you are done.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Success doesn’t come to you. You go to it.", author: "Unknown" },
  { text: "Don’t wait for opportunity. Create it.", author: "Unknown" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Success is not measured by what you have accomplished, but by the obstacles you have overcome.", author: "Booker T. Washington" },
  { text: "Character is power.", author: "Booker T. Washington" },
  { text: "Nothing ever comes to one, that is worth having, except as a result of hard work.", author: "Booker T. Washington" },
  { text: "The world hates change, yet it is the only thing that has brought progress.", author: "Charles Kettering" },
  { text: "Believe you can and you’re halfway there.", author: "Theodore Roosevelt" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "The only man who never makes a mistake is the man who never does anything.", author: "Theodore Roosevelt" },
  { text: "Success is the reward for toil.", author: "Herodotus" },
  { text: "Adversity causes some men to break; others to break records.", author: "William Ward" },
  { text: "Success is to be measured not so much by the position that one has reached in life as by the obstacles which he has overcome while trying to succeed.", author: "Booker T. Washington" },
  { text: "I have not failed. I’ve just found 10,000 ways that won’t work.", author: "Thomas Edison" },
  { text: "Genius is one percent inspiration and ninety-nine percent perspiration.", author: "Thomas Edison" },
  { text: "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.", author: "Thomas Edison" },
  { text: "Opportunity is missed by most people because it is dressed in overalls and looks like work.", author: "Thomas Edison" },
  { text: "Many of life’s failures are people who did not realize how close they were to success when they gave up.", author: "Thomas Edison" },
  { text: "If we did all the things we were capable of doing, we would literally astound ourselves.", author: "Thomas Edison" },
  { text: "The three great essentials to achieve anything worthwhile are: hard work, stick-to-itiveness, and common sense.", author: "Thomas Edison" },
  { text: "Everything comes to him who hustles while he waits.", author: "Thomas Edison" },
  { text: "Restlessness is discontent and discontent is the first necessity of progress.", author: "Thomas Edison" },
  { text: "To invent, you need a good imagination and a pile of junk.", author: "Thomas Edison" },
  { text: "Success is a lousy teacher. It seduces smart people into thinking they can’t lose.", author: "Bill Gates" },
  { text: "Your most unhappy customers are your greatest source of learning.", author: "Bill Gates" },
  { text: "It’s fine to celebrate success but it is more important to heed the lessons of failure.", author: "Bill Gates" },
  { text: "We all need people who will give us feedback. That’s how we improve.", author: "Bill Gates" },
  { text: "If you are born poor, it is not your mistake, but if you die poor, it is your mistake.", author: "Bill Gates" },
  { text: "The most successful people are those who are good at plan B.", author: "James Yorke" },
  { text: "Failure is simply the opportunity to begin again, this time more intelligently.", author: "Henry Ford" },
  { text: "Whether you think you can or you think you can’t, you’re right.", author: "Henry Ford" },
  { text: "Obstacles are those frightful things you see when you take your eyes off your goal.", author: "Henry Ford" },
  { text: "Coming together is a beginning, staying together is progress, and working together is success.", author: "Henry Ford" },
  { text: "We make a living by what we get, but we make a life by what we give.", author: "Winston Churchill" },
  { text: "Attitude is a little thing that makes a big difference.", author: "Winston Churchill" },
  { text: "Success is the child of audacity.", author: "Winston Churchill" },
  { text: "Success is never final. Failure is never fatal. It is courage that counts.", author: "Winston Churchill" },
  { text: "To improve is to change; to be perfect is to change often.", author: "Winston Churchill" },
  { text: "If you are going through hell, keep going.", author: "Winston Churchill" },
  { text: "The price of greatness is responsibility.", author: "Winston Churchill" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "Pleasure in the job puts perfection in the work.", author: "Aristotle" },
  { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
  { text: "You are the average of the five people you spend the most time with.", author: "Jim Rohn" },
  { text: "If you want to be successful, you must respect one rule: never let failure be the reason to give up.", author: "Unknown" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.", author: "Steve Jobs" },
  { text: "Sometimes life hits you in the head with a brick. Don’t lose faith.", author: "Steve Jobs" },
  { text: "Success is not about being the best. It’s about always getting better.", author: "Unknown" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
  { text: "The only real failure in life is one who does not learn from their mistakes.", author: "Unknown" },
  { text: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" },
  { text: "I have a dream that one day every valley shall be exalted, every hill and mountain shall be made low, the rough places will be made straight.", author: "Martin Luther King Jr." },
  { text: "If you can’t fly then run, if you can’t run then walk, if you can’t walk then crawl, but whatever you do you have to keep moving forward.", author: "Martin Luther King Jr." },
  { text: "Faith is taking the first step even when you don’t see the whole staircase.", author: "Martin Luther King Jr." },
  { text: "The time is always right to do what is right.", author: "Martin Luther King Jr." },
  { text: "Injustice anywhere is a threat to justice everywhere.", author: "Martin Luther King Jr." },
  { text: "We must accept finite disappointment, but never lose infinite hope.", author: "Martin Luther King Jr." },
  { text: "The ultimate measure of a man is not where he stands in moments of comfort and convenience, but where he stands at times of challenge and controversy.", author: "Martin Luther King Jr." },
  { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Believe you can and you’re halfway there.", author: "Theodore Roosevelt" },
  { text: "A winner is a dreamer who never gave up.", author: "Nelson Mandela" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "It always seems impossible until it’s done.", author: "Nelson Mandela" },
  { text: "Courage is not the absence of fear, but the triumph over it.", author: "Nelson Mandela" },
  { text: "Success is the progressive realization of a worthy goal.", author: "Earl Nightingale" },
  { text: "The mind is like a parachute. It only works when it is open.", author: "Unknown" },
  { text: "Your habits will determine your future.", author: "Unknown" },
  { text: "If you want to achieve greatness, stop asking for permission.", author: "Unknown" },
  { text: "Don’t watch the clock; do what it does. Keep going.", author: "Unknown" },
  { text: "If you can’t feed a team with one pizza, that’s too many people.", author: "Jeff Bezos" },
  { text: "Work hard, have fun, make history.", author: "Jeff Bezos" },
  { text: "The most important single thing is to focus obsessively on the customer.", author: "Jeff Bezos" },
  { text: "If you double the number of experiments you do per year, you’re going to double your inventiveness.", author: "Jeff Bezos" },
  { text: "Don’t count the days, make the days count.", author: "Muhammad Ali" },
  { text: "It is the hard work that makes the finish line sweet.", author: "Unknown" },
  { text: "Success is not in never failing, but rising every time you fall.", author: "Unknown" },
  { text: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon" },
  { text: "Don’t fear failure. Not failure, but low aim, is the crime.", author: "Unknown" },
  { text: "Be brave. Take risks. Nothing can substitute experience.", author: "Unknown" },
  { text: "The way to develop the best that is in a man is by appreciation and encouragement.", author: "Charles Schwab" },
  { text: "I am always ready to learn although I do not always like being taught.", author: "Winston Churchill" },
  { text: "A fanatic is one who can’t change his mind and won’t change the subject.", author: "Winston Churchill" },
  { text: "History will be kind to me for I intend to write it.", author: "Winston Churchill" },
  { text: "I never worry about action, but only inaction.", author: "Winston Churchill" },
  { text: "We make a living by what we get, but we make a life by what we give.", author: "Winston Churchill" },
  { text: "Success is going from failure to failure without losing enthusiasm.", author: "Winston Churchill" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Differences of habit and language are nothing at all if our aims are identical and our hearts are open.", author: "J.K. Rowling" },
  { text: "It is our choices that show what we truly are, far more than our abilities.", author: "J.K. Rowling" },
  { text: "Happiness can be found even in the darkest of times, if one only remembers to turn on the light.", author: "J.K. Rowling" },
  { text: "We do not need magic to change the world, we have all the power we need inside ourselves.", author: "J.K. Rowling" },
  { text: "You must be the change you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "An eye for an eye only ends up making the whole world blind.", author: "Mahatma Gandhi" },
  { text: "Strength does not come from physical capacity. It comes from an indomitable will.", author: "Mahatma Gandhi" },
  { text: "A man is but the product of his thoughts. What he thinks, he becomes.", author: "Mahatma Gandhi" },
  { text: "First they ignore you, then they laugh at you, then they fight you, then you win.", author: "Mahatma Gandhi" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The future belongs to those who prepare for it today.", author: "Unknown" },
  { text: "Champions keep playing until they get it right.", author: "Unknown" },
  { text: "I can accept failure, everyone fails at something. But I can’t accept not trying.", author: "Unknown" },
  { text: "It is better to fail in originality than to succeed in imitation.", author: "Herman Melville" },
  { text: "Success is getting what you want. Happiness is wanting what you get.", author: "Unknown" },
  { text: "Try to be a rainbow in someone’s cloud.", author: "Maya Angelou" },
  { text: "You will face many defeats in life, but never let yourself be defeated.", author: "Maya Angelou" },
  { text: "We delight in the beauty of the butterfly, but rarely admit the changes it has gone through to achieve that beauty.", author: "Maya Angelou" },
  { text: "A smooth sea never made a skilled sailor.", author: "Unknown" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "Motivation gets you going, but discipline keeps you growing.", author: "John C. Maxwell" },
  { text: "The discipline that is required to win must be cultivated and maintained every single day.", author: "John C. Maxwell" },
  { text: "Successful people are simply those with successful habits.", author: "Brian Tracy" },
  { text: "If you want to achieve your goals, you must have a plan. If you don’t have a plan, you are planning to fail.", author: "Unknown" },
  { text: "A goal without a plan is just a wish.", author: "Antoine de Saint-Exupéry" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Efficiency is doing things right; effectiveness is doing the right things.", author: "Peter Drucker" },
  { text: "Knowledge has to be improved, challenged, and increased constantly, or it vanishes.", author: "Peter Drucker" },
  { text: "The greatest danger in times of turbulence is not the turbulence itself, but to act with yesterday’s logic.", author: "Peter Drucker" },
  { text: "The most important thing in communication is to hear what isn’t being said.", author: "Peter Drucker" },
  { text: "Success is doing ordinary things extraordinarily well.", author: "Unknown" },
  { text: "Excellence is not a skill. It is an attitude.", author: "Unknown" },
  { text: "I would rather fail in a cause that will ultimately succeed than succeed in a cause that will ultimately fail.", author: "Unknown" },
  { text: "I attribute my success to this: I never gave or took any excuse.", author: "Florence Nightingale" },
  { text: "I think the success of any endeavor is 90% mental and 10% physical.", author: "Unknown" },
  { text: "The secret of success is constancy to purpose.", author: "Benjamin Disraeli" },
  { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", author: "William Butler Yeats" },
  { text: "The successful man will profit from his mistakes and try again in a different way.", author: "Unknown" },
  { text: "Success is a journey, not a destination.", author: "Unknown" },
  { text: "The harder you work, the more luck you have.", author: "Unknown" },
  { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
  { text: "If you can dream it, you can achieve it.", author: "Unknown" },
  { text: "Opportunities don’t happen. You create them.", author: "Chris Grosser" },
  { text: "Success is not about having a lot. It is about giving a lot.", author: "Unknown" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Success is doing what you love and loving what you do.", author: "Unknown" },
  { text: "The secret of success is sincerity.", author: "Unknown" },
  { text: "The road to success is always under construction.", author: "Unknown" },
  { text: "Success is 1% inspiration and 99% perspiration.", author: "Thomas Edison" },
  { text: "If you want to succeed, you must be willing to pay the price.", author: "Unknown" },
  { text: "You must do the thing you think you cannot do.", author: "Eleanor Roosevelt" },
  { text: "The way to succeed is to double your failure rate.", author: "Thomas Watson" },
  { text: "Success is getting up one more time than you fall.", author: "Unknown" },
  { text: "If you want to succeed, you should strike out on new paths, rather than travel the worn paths of accepted success.", author: "John D. Rockefeller" },
  { text: "The successful person makes a habit of doing what the unsuccessful person does not do.", author: "Unknown" },
  { text: "Success is not the absence of problems, it’s the ability to solve them.", author: "Unknown" },
  { text: "The harder you work, the more you gain.", author: "Unknown" },
  { text: "Success is measured by the number of lives you touch.", author: "Unknown" },
  { text: "If you can’t cross the sea merely by standing and staring at the water.", author: "Unknown" },
  { text: "Don’t be afraid to fail. Be afraid not to try.", author: "Unknown" },
  { text: "A man who has committed a mistake and doesn’t correct it is committing another mistake.", author: "Confucius" },
  { text: "Time is the great equalizer. It is the one thing every man has in equal measure.", author: "James C. Humes" },
  { text: "A man who does not plan long ahead will find trouble right at his door.", author: "Confucius" },
  { text: "Success is the progressive realization of a worthy goal.", author: "Earl Nightingale" },
  { text: "You are the master of your destiny. You can influence, direct and control your own environment.", author: "Napoleon Hill" },
  { text: "If you can’t excel with talent, triumph with effort.", author: "Unknown" },
  { text: "You don’t have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Every champion was once a contender that refused to give up.", author: "Rocky Balboa" },
  { text: "It is not the size of the dog in the fight, but the size of the fight in the dog.", author: "Mark Twain" },
  { text: "The secret to getting ahead is getting started.", author: "Mark Twain" },
  { text: "Twenty years from now you will be more disappointed by the things that you didn’t do than by the ones you did do.", author: "Mark Twain" },
  { text: "I have never let my schooling interfere with my education.", author: "Mark Twain" },
  { text: "Winning isn’t everything, but wanting to win is.", author: "Vince Lombardi" },
  { text: "Practice does not make perfect. Only perfect practice makes perfect.", author: "Vince Lombardi" },
  { text: "The word ‘impossible’ is not in my vocabulary.", author: "George S. Patton" },
  { text: "A good plan today is better than a perfect plan tomorrow.", author: "George S. Patton" },
  { text: "Don’t judge me by my success, judge me by the seeds I plant.", author: "Unknown" },
  { text: "The best way to find yourself is to lose yourself in the service of others.", author: "Mahatma Gandhi" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Success is not about winning. It is about bringing out the best in others.", author: "Unknown" },
  { text: "The future belongs to those who prepare for it today.", author: "Unknown" },
  { text: "Champions keep playing until they get it right.", author: "Unknown" },
  { text: "I can accept failure, everyone fails at something. But I can’t accept not trying.", author: "Unknown" },
  { text: "Success is getting what you want. Happiness is wanting what you get.", author: "Unknown" },
  { text: "A successful man is one who can lay a firm foundation with the bricks others have thrown at him.", author: "David Brinkley" },
  { text: "Success is loving what you do and being good at it.", author: "Unknown" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "Motivation gets you going, but discipline keeps you growing.", author: "John C. Maxwell" },
  { text: "The discipline that is required to win must be cultivated and maintained every single day.", author: "John C. Maxwell" },
  { text: "Successful people are simply those with successful habits.", author: "Brian Tracy" },
  { text: "If you want to achieve your goals, you must have a plan. If you don’t have a plan, you are planning to fail.", author: "Unknown" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not a destination, it is a journey.", author: "Zig Ziglar" },
  { text: "If you are not willing to risk the usual, you will have to settle for ordinary.", author: "Jim Rohn" },
  { text: "Success is progressive realization of a worthy ideal.", author: "Earl Nightingale" },
  { text: "You can’t cross the sea merely by standing and staring at the water.", author: "Unknown" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Don’t watch the clock; do what it does. Keep going.", author: "Unknown" },
  { text: "The harder the conflict, the more glorious the triumph.", author: "William Tecumseh Sherman" },
  { text: "Success is how high you bounce when you hit bottom.", author: "George S. Patton" },
  { text: "A good plan violently executed now is better than a perfect plan executed next week.", author: "George S. Patton" },
  { text: "Leadership is solving problems. The day soldiers stop bringing you their problems is the day you have stopped leading them.", author: "Colin Powell" },
  { text: "The secret of success is to do the common thing uncommonly well.", author: "John D. Rockefeller Jr." },
  { text: "Success is peace of mind, which is a direct result of self-satisfaction in knowing you did your best.", author: "John Wooden" },
  { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
  { text: "Don’t wish it were easier. Wish you were better.", author: "Jim Rohn" },
  { text: "Success is dependent upon the glands of sweat.", author: "John J. Pershing" },
  { text: "From success to success is easy; it is only from failure to failure that the going is hard.", author: "John J. Pershing" },
  { text: "The man who wins may have been counted out several times, but he didn’t hear the referee.", author: "John J. Pershing" },
  { text: "A pint of sweat will save a gallon of blood.", author: "George S. Patton" },
  { text: "Never tell people how to do things. Tell them what to do and they will surprise you with their results.", author: "George S. Patton" },
  { text: "I am not afraid of an army of lions led by a sheep; I am afraid of an army of sheep led by a lion.", author: "Alexander the Great" },
  { text: "There is nothing impossible to him who will try.", author: "Alexander the Great" },
  { text: "He who fears being conquered is sure of defeat.", author: "Napoleon Bonaparte" },
  { text: "Impossible is a word to be found only in the dictionary of fools.", author: "Napoleon Bonaparte" },
  { text: "The battlefield is a scene of constant chaos. The winner will be the one who controls that chaos.", author: "George S. Patton" },
  { text: "Do not follow where the path may lead. Go instead where there is no path and leave a trail.", author: "Muriel Strode" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "God, grant me the serenity to accept the things I cannot change, courage to change the things I can, and wisdom to know the difference.", author: "Reinhold Niebuhr" },
  { text: "The best way to predict your future is to create it.", author: "Abraham Lincoln" },
  { text: "I am not bound to win, but I am bound to be true. I am not bound to succeed, but I am bound to live up to the light I have.", author: "Abraham Lincoln" },
  { text: "Give me six hours to chop down a tree and I will spend the first four sharpening the axe.", author: "Abraham Lincoln" },
  { text: "The dogmas of the quiet past are inadequate to the stormy present. The occasion is piled high with difficulty, and we must rise with the occasion.", author: "Abraham Lincoln" },
];

const QUOTE_DISPLAY_MS = 10000;

const fadeVariants = {
  enter: { opacity: 0, y: 30 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};

export default function QuotesHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
               }, QUOTE_DISPLAY_MS);
    return () => clearInterval(timer);
  }, []);

  const quote = quotes[index];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated background blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-400 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600 rounded-full blur-[140px] translate-x-1/3 translate-y-1/3"
      />

      {/* Quote content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <span className="text-6xl md:text-8xl font-black text-yellow-400/20 select-none">“</span>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial="enter"
            animate="center"
            exit="exit"
            variants={fadeVariants}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <p className="text-2xl md:text-5xl font-bold text-white leading-tight mb-8 tracking-tight">
              {quote.text}
            </p>
            <p className="text-yellow-400 text-lg md:text-xl font-semibold tracking-wide">
              — {quote.author}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-12 flex-wrap">
          {quotes.slice(0, 20).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === index ? "bg-yellow-400 w-6" : "bg-zinc-700 hover:bg-zinc-500"
              }`}
              aria-label={`Go to quote ${i + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16"
        >
          <a
            href="/courses"
            className="inline-block bg-yellow-400 text-black px-10 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 transition shadow-lg shadow-yellow-400/20"
          >
            Start Learning Now — FREE
          </a>
        </motion.div>
      </div>
    </section>
  );
}
