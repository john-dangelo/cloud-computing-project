from time import sleep
from facebook_scraper import get_posts

######################################
#Command line args (accepts one to three)
#the first is always the jobId of the workflow
#the second is -t or -f for twitter or facebook
#the third is an integer for the number of posts
#
#Default for the second arg is facebook
#Default for the third arg is 10
######################################


endOfData = "~~EOD~~"


########## Data Emission. Call func you want with # of posts you want #########
def emitPostsFacebook(postsRequested,send):
    
	postsPerPage = int(postsRequested / 3)
 
	postsEmitted = 0;
    #might need to pass in cookies
	for post in get_posts('nintendo', pages=4, options={"posts_per_page": postsPerPage, "comments":True}, cookies={"c_user":"100016068128458", "xs":"5%3AG1pU-BZuD5_nnA%3A2%3A1670563019%3A-1%3A9976",}):
		try:
			comments = post['comments_full']
			for comment in comments:
				if(postsEmitted == postsRequested):
					#emit the end of data token
					return
				splitcomm = comment['comment_text'].splitlines()
				try:
					#Perform a function on each comment with .5 sec intervals between
					print(splitcomm[0])
					send(splitcomm[0])
    
					postsEmitted+=1
					sleep(0.5)
				except:
					postsEmitted+=1
					print("FAIL")
				
		except:
			print("empty")
	send(endOfData)
        
##################### Data emission above ###########################
    
#if we implement parameter passing, add args here
def container_main(data, send):
    emitPostsFacebook(600,send)

