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


The chrome extension will be available on the Google store within the next week for you to test!    

On a ticket closure in Salesforce,  the API is launched and it sees if the user registered in Saleforce, has any upcoming events in Microsoft Outlook. Based on algorithms, we decide if the user should take a break and then pushes a Google Cloud Messaging (GCM) and randomly suggests an activity to perform to chrome front-end.   

The user can accept or reject the request. If he accepts the request, we provide him the option to do workout with friends who also should take a break. The user's friends gets a GCM notification asking if he is interesting in joining you for a workout.  
  
The users who are interested and, accepted the request will have a calendar event created for them in Calendar outlook. 

#Usage

Currently, the chrome extension is not on chrome store. However, you can clone this git repository and install 'chrome-extension-using' onto your chrome browser.

#Important Notice

You must be registered as a user in our Azure Active Directory to be able to use this notification. The notifications only get triggered for tickets closed on Salesforce but we are planning to expand our platforms.

The API is currently being hosted on Microsoft Azure and will be available only till 20th March 2016. Please contact me (spurrya@gmail.com) if you are interested in using this product AFTER 20th March 2016.

#Demo

http://devpost.com/software/yofit

