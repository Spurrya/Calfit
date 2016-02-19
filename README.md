# CalFit

Concept:

Problems we are trying to solve:
1. White collar jobs involve lot of sitting. This has lot of negative effects on physical, mental health and most importantly productivity 
2. Even if employees do workouts after work, research says that it won't balance side effects of sitting long hours
3. Research says that short workout breaks during orking hours prevents side effects of long hours of sitting and improves productivity, But are not disciplined and don't know how to remind themselves in the right way to do those short workouts

Solution:
1. Make short workouts part of employee's work routine
2. Use the tools (Browser extension, Outlook calendar) and Devices (initially laptop, but in future mobile) employee uses most of the day to remind & encourage him to do short workouts
3. Use intelligent algorithms to decide when is the most effective time to remind a user
4. Use visually appealing ways to inspire user for workout

------------------

This is the node backend of a chrome extension. It authorises the user, creates a new event (for the purpose of demonstration) and gets all the calendar events. We sync the chrome extension with a CRM (Salesforce) Support ticket tracking software, where once the user has finished one major task (e.g. closing one support ticket), it checks if he has an upcoming meeting and pushes a notification to take a break using Google Cloud Messaging Service to all the devices the user uses. These devices includes Android phone,
Google chrome or iPhone.

#Usage

The chrome extension will be available on the Google store within the next week for you to test!
