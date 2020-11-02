# ToDoList

[![HitCount](http://hits.dwyl.com/akheelsajjan/https://githubcom/akheelsajjan/HackerEarh.svg)](http://hits.dwyl.com/akheelsajjan/https://githubcom/akheelsajjan/HackerEarh)

Project Name - Real Time To do List


<!-------Landing Page--------->

Sign-In:
Two fields are present, where user has to enter Email-Id and Password to login.
If the credentials given are correct and if the user exits in database, user shall be logged In,
Else appropriate message will be shown to user.
User can click on Forgot Password if user dosn't remember the password.

Sign-Up:
There are total 6 fields. All are required to sign-up. The fields include "firstName", "lastName", "Country Code",
"Mobile Number", "Email Address" and "Password". The password must contain  atleast one digit, atleast one lowercase and
uppercase, a special character, and length should be minimum 8 and maximum 32.
On successfull login user shall get  message to user's maild-id, where user has to verify the email.
If user is already present with the given email-Id, user shall be redirected to login page. 

Forgot-Password:
User has to enter email-id to get the reset link.
If user is not present with given email, user shall be redirected to sign-up page.

Reset Password:
User has to enter the new password, the password must contain  atleast one digit, atleast one lowercase and
uppercase, a special character, and length should be minimum 8 and maximum 32.
User shall be redirected to login page after reseting the password.

<!-------End Of Landing Page--------->



<!-------My-To-Do-List--------------->

my-todo-list:
It is a private todo-list.User can create/edit/delete list, items and SubItems.
When user creates a list, user has to select the created list in order to create/view Items.
Items and SubItems have undo button which will bring back any recent changes.
(NOTE: I HAVE ADDED MARKED/UN-MARKED ON SUB-ITEM AND NOT ON ITEMS FOR BETTER USER-EXPERIENCE)
Any modifications on this page will only be reflected/visible to himself/herself.
All the undo's will be cleared off once the user logs out.

multi-todo:
It is similar to my-todo-list page, but in this case users list/lists will be visible to users friend.
User and user's friend can create/edit/delete list, items and subitems. Any modifications to list,items or subitems
will be notifyed to user's friend.

friends:
user can see all the user's under "All User" section. User can send other user a friend request.
Friend requests can be seen under request column, where user can accept/reject friend.
Accepted friend request users will be visible under my-friends column.

<!----End Of My-To-Do-List--------------->


ExtraFeatures: I have used Loader/Spinner. For Loader/Spinner I have used ngx-spinner which will be displayed until user gets response.












